// Track Booking Portal

const cityCoordinates = {
    delhi: { lat: 28.7041, lng: 77.1025 },
    gurgaon: { lat: 28.4595, lng: 77.0266 },
    noida: { lat: 28.5355, lng: 77.3910 },
    faridabad: { lat: 28.4089, lng: 77.3178 },
    ghaziabad: { lat: 28.6692, lng: 77.4538 },
    jaipur: { lat: 26.9124, lng: 75.7873 },
    lucknow: { lat: 26.8467, lng: 80.9462 },
    meerut: { lat: 28.9845, lng: 77.7064 },
    alwar: { lat: 27.5600, lng: 76.6250 }
};

const partnerTrucks = [
    { name: 'MK Partner 1', type: 'Truck', status: 'Available', color: '#1a5f2a' },
    { name: 'MK Partner 2', type: 'Mini Truck', status: 'On Duty', color: '#f4a024' },
    { name: 'MK Partner 3', type: 'Tempo', status: 'Nearby', color: '#0d3d16' },
    { name: 'MK Partner 4', type: 'Container', status: 'Available', color: '#0066cc' }
];

function getCityCoordinates(cityName) {
    if (!cityName) {
        return { lat: 28.7041, lng: 77.1025 }; // Default to Delhi
    }

    const key = cityName.trim().toLowerCase();
    if (cityCoordinates[key]) {
        return cityCoordinates[key];
    }

    const normalized = key.replace(/\s+/g, '_');
    if (cityCoordinates[normalized]) {
        return cityCoordinates[normalized];
    }

    // Fallback if the exact city is not in the list
    return Object.values(cityCoordinates)[0] || { lat: 28.7041, lng: 77.1025 };
}

let liveMarker;
let liveInterval;
let trackingMap;
let trackingPath = [];

window.initBookingTracker = function() {
    initTrackingPage();
};

function initTrackingPage() {
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    const bookingId = new URLSearchParams(window.location.search).get('id');
    const booking = bookingId ? bookings.find(b => String(b.id) === bookingId) : bookings[0];

    if (!booking) {
        document.getElementById('bookingSummary').innerHTML = '<p class="no-bookings">No booking found. Create a booking first.</p>';
        return;
    }

    renderBookingSummary(booking);
    initializeMap(booking);
    renderNearbyTrucks(booking);
    startLiveTracking(booking);
}

function renderBookingSummary(booking) {
    const pickup = booking.stops[0];
    const delivery = booking.stops[booking.stops.length - 1];
    const statusText = booking.status === 'pending' ? 'Driver Assigned' : booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

    const html = `
        <div class="booking-summary-row">
            <strong>Booking ID</strong>
            <span>${booking.id}</span>
        </div>
        <div class="booking-summary-row">
            <strong>Customer</strong>
            <span>${booking.customerName}</span>
        </div>
        <div class="booking-summary-row">
            <strong>Phone</strong>
            <span>${booking.customerPhone}</span>
        </div>
        <div class="booking-summary-row">
            <strong>Pickup</strong>
            <span>${pickup.city} - ${pickup.address}</span>
        </div>
        <div class="booking-summary-row">
            <strong>Delivery</strong>
            <span>${delivery.city} - ${delivery.address}</span>
        </div>
        <div class="booking-summary-row">
            <strong>Vehicle</strong>
            <span>${booking.vehicleType}</span>
        </div>
        <div class="booking-summary-row">
            <strong>Weight</strong>
            <span>${booking.totalWeight} tons</span>
        </div>
        <div class="booking-summary-row">
            <strong>Status</strong>
            <span>${statusText}</span>
        </div>
    `;

    document.getElementById('bookingSummary').innerHTML = html;
    document.getElementById('trackingStatus').textContent = statusText;
    document.getElementById('assignedDriver').textContent = 'MK Delivery Partner';
    document.getElementById('assignedVehicle').textContent = booking.vehicleType.replace('_', ' ');
}

function initializeMap(booking) {
    const pickup = booking.stops[0];
    const delivery = booking.stops[booking.stops.length - 1];
    const start = getCityCoordinates(pickup.city);
    const end = getCityCoordinates(delivery.city);
    const bounds = new google.maps.LatLngBounds();

    trackingMap = new google.maps.Map(document.getElementById('trackingMap'), {
        center: start,
        zoom: 8,
        disableDefaultUI: true
    });

    const pickupMarker = new google.maps.Marker({
        position: start,
        map: trackingMap,
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: '#1a5f2a',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff'
        },
        title: 'Pickup Location'
    });

    const deliveryMarker = new google.maps.Marker({
        position: end,
        map: trackingMap,
        icon: {
            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5,
            fillColor: '#dc3545',
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff'
        },
        title: 'Delivery Location'
    });

    bounds.extend(start);
    bounds.extend(end);
    trackingMap.fitBounds(bounds, 100);

    trackingPath = [start, end];
    new google.maps.Polyline({
        path: trackingPath,
        geodesic: true,
        strokeColor: '#1a5f2a',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: trackingMap
    });

    liveMarker = new google.maps.Marker({
        position: start,
        map: trackingMap,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#f4a024',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#1a5f2a'
        },
        title: 'Live Truck Location'
    });
}

function renderNearbyTrucks(booking) {
    const pickup = booking.stops[0];
    const start = getCityCoordinates(pickup.city);
    const nearbyContainer = document.getElementById('nearbyList');
    nearbyContainer.innerHTML = '';

    partnerTrucks.forEach((truck, index) => {
        const offset = getNearbyOffset(index);
        const position = { lat: start.lat + offset.lat, lng: start.lng + offset.lng };

        new google.maps.Marker({
            position,
            map: trackingMap,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: truck.color,
                fillOpacity: 1,
                strokeWeight: 1,
                strokeColor: '#ffffff'
            },
            title: truck.name
        });

        nearbyContainer.insertAdjacentHTML('beforeend', `
            <div class="nearby-item">
                <div>
                    <strong>${truck.name}</strong>
                    <p>${truck.type}</p>
                </div>
                <span class="nearby-status ${truck.status.toLowerCase().replace(' ', '-')}">${truck.status}</span>
            </div>
        `);
    });

    document.getElementById('nearbyCount').textContent = partnerTrucks.length;
}

function getNearbyOffset(index) {
    const offsets = [
        { lat: 0.05, lng: 0.03 },
        { lat: -0.04, lng: -0.02 },
        { lat: 0.03, lng: -0.04 },
        { lat: -0.05, lng: 0.04 }
    ];
    return offsets[index % offsets.length];
}

function startLiveTracking(booking) {
    if (liveInterval) {
        clearInterval(liveInterval);
    }

    let step = 0;
    const totalSteps = 60;
    const start = trackingPath[0];
    const end = trackingPath[trackingPath.length - 1];

    updateTrackingProgress(0);

    liveInterval = setInterval(() => {
        step++;
        const progress = Math.min(step / totalSteps, 1);
        const nextPosition = {
            lat: start.lat + (end.lat - start.lat) * progress,
            lng: start.lng + (end.lng - start.lng) * progress
        };

        if (liveMarker) {
            liveMarker.setPosition(nextPosition);
        }

        updateTrackingProgress(progress);

        if (progress >= 1) {
            clearInterval(liveInterval);
            document.getElementById('trackingStatus').textContent = 'Delivered';
            document.getElementById('trackingStatus').classList.add('delivered');
            document.getElementById('trackingProgress').style.width = '100%';
        }
    }, 2500);
}

function updateTrackingProgress(progress) {
    const percent = Math.round(progress * 100);
    const statusElement = document.getElementById('trackingStatus');
    const progressFill = document.getElementById('trackingProgress');

    progressFill.style.width = `${percent}%`;

    if (percent < 10) {
        statusElement.textContent = 'Driver Assigned';
    } else if (percent < 90) {
        statusElement.textContent = 'In Transit';
    } else {
        statusElement.textContent = 'Almost Delivered';
    }
}

function getCityCoordinates(cityName) {
    const key = cityName.trim().toLowerCase();
    return cityCoordinates[key] || cityCoordinates.delhi;
}
