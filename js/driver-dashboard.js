// Driver Dashboard - Load Management System with Accept/Decline

// Sample load data (in real app, this would come from server)
const sampleLoads = [
    {
        id: 1,
        pickup: 'Delhi',
        pickupArea: 'delhi',
        delivery: 'Gurgaon',
        deliveryArea: 'haryana',
        distance: '25 km',
        cargo: 'Industrial Goods',
        weight: '5 tons',
        price: '₹3,500',
        customer: 'Rajesh Kumar',
        customerPhone: '9876543210',
        pickupAddress: 'Sector 14, Delhi',
        deliveryAddress: 'Sector 44, Gurgaon',
        postedTime: '10 min ago'
    },
    {
        id: 2,
        pickup: 'Noida',
        pickupArea: 'up',
        delivery: 'Jaipur',
        deliveryArea: 'rajasthan',
        distance: '280 km',
        cargo: 'Textiles',
        weight: '8 tons',
        price: '₹18,000',
        customer: 'Amit Sharma',
        customerPhone: '9876543211',
        pickupAddress: 'Sector 62, Noida',
        deliveryAddress: 'MI Road, Jaipur',
        postedTime: '25 min ago'
    },
    {
        id: 3,
        pickup: 'Faridabad',
        pickupArea: 'haryana',
        delivery: 'Lucknow',
        deliveryArea: 'up',
        distance: '350 km',
        cargo: 'Electronics',
        weight: '3 tons',
        price: '₹22,000',
        customer: 'Suresh Patel',
        customerPhone: '9876543212',
        pickupAddress: 'Ballabgarh, Faridabad',
        deliveryAddress: 'Gomti Nagar, Lucknow',
        postedTime: '1 hour ago'
    },
    {
        id: 4,
        pickup: 'Ghaziabad',
        pickupArea: 'up',
        delivery: 'Alwar',
        deliveryArea: 'rajasthan',
        distance: '180 km',
        cargo: 'Machinery Parts',
        weight: '10 tons',
        price: '₹12,000',
        customer: 'Vijay Singh',
        customerPhone: '9876543213',
        pickupAddress: 'Industrial Area, Ghaziabad',
        deliveryAddress: 'RIICO Industrial Area, Alwar',
        postedTime: '2 hours ago'
    },
    {
        id: 5,
        pickup: 'Delhi',
        pickupArea: 'delhi',
        delivery: 'Meerut',
        deliveryArea: 'up',
        distance: '80 km',
        cargo: 'Food Grains',
        weight: '7 tons',
        price: '₹6,000',
        customer: 'Mohit Gupta',
        customerPhone: '9876543214',
        pickupAddress: 'Azadpur, Delhi',
        deliveryAddress: 'Civil Lines, Meerut',
        postedTime: '3 hours ago'
    }
];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if driver is logged in
    const driverData = localStorage.getItem('mkDriverLoggedIn');
    if (!driverData) {
        window.location.href = 'driver-login.html';
        return;
    }
    
    const driver = JSON.parse(driverData);
    
    // Update driver info
    document.getElementById('driverName').textContent = `Welcome, ${driver.name}`;
    document.getElementById('profileName').textContent = driver.name;
    document.getElementById('profilePhone').textContent = driver.phone;
    document.getElementById('profileVehicle').textContent = driver.vehicleType.charAt(0).toUpperCase() + driver.vehicleType.slice(1);
    document.getElementById('profileVehicleNumber').textContent = driver.vehicleNumber;
    document.getElementById('profileLocation').textContent = driver.location;
    
    // Load stats
    loadDriverStats(driver);
    
    // Load available loads (from bookings)
    loadAvailableLoads(driver);
    
    // Load accepted loads
    loadAcceptedLoads(driver);
    
    // Setup logout (using onclick in HTML now)
});

// Load driver statistics
function loadDriverStats(driver) {
    const acceptedLoads = JSON.parse(localStorage.getItem('mkAcceptedLoads') || '[]');
    const driverAccepted = acceptedLoads.filter(l => l.driverId === driver.id);
    
    document.getElementById('availableLoads').textContent = getPendingBookingsCount();
    document.getElementById('acceptedLoads').textContent = driverAccepted.length;
    document.getElementById('completedTrips').textContent = driver.completedTrips || 0;
    document.getElementById('totalEarnings').textContent = `₹${driver.earnings || 0}`;
}

// Get pending bookings count
function getPendingBookingsCount() {
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    return bookings.filter(b => b.status === 'pending').length;
}

// Load available loads based on driver's service areas - FROM BOOKINGS
function loadAvailableLoads(driver) {
    const container = document.getElementById('loadsContainer');
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    
    // Filter by driver's service areas
    const availableLoads = pendingBookings.filter(booking => {
        return booking.stops.some(stop => 
            driver.serviceAreas.includes(getAreaFromCity(stop.city))
        );
    });
    
    if (availableLoads.length === 0) {
        container.innerHTML = `
            <div class="no-loads">
                <i class="fas fa-truck"></i>
                <p>No load requests available in your service area. Update your service areas in registration.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = availableLoads.map(booking => {
        const pickup = booking.stops[0];
        const delivery = booking.stops[booking.stops.length - 1];
        const intermediateStops = booking.stops.length - 2;
        
        return `
            <div class="load-card" data-load-id="${booking.id}">
                <div class="load-info">
                    <h4>${booking.cargoType} • ${booking.totalWeight} tons</h4>
                    <div class="load-route">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${pickup.city}</span>
                        <i class="fas fa-arrow-right arrow"></i>
                        <span>${delivery.city}</span>
                        ${intermediateStops > 0 ? `<span style="color: var(--gray); font-size: 12px;">(+${intermediateStops} stops)</span>` : ''}
                    </div>
                    <div class="load-details">
                        <div class="load-detail">
                            <i class="fas fa-truck"></i>
                            <span>${booking.vehicleType}</span>
                        </div>
                        <div class="load-detail">
                            <i class="fas fa-user"></i>
                            <span>${booking.customerName}</span>
                        </div>
                        <div class="load-detail">
                            <i class="fas fa-clock"></i>
                            <span>${formatDate(booking.date)}</span>
                        </div>
                    </div>
                </div>
                <div class="load-actions">
                    <button class="btn btn-primary" onclick="viewLoadDetails(${booking.id})">View</button>
                    <button class="btn btn-success" onclick="acceptLoad(${booking.id})">Accept</button>
                    <button class="btn btn-danger" onclick="declineLoad(${booking.id})">Decline</button>
                </div>
            </div>
        `;
    }).join('');
}

// Get area from city name
function getAreaFromCity(city) {
    const cityLower = city.toLowerCase();
    if (cityLower.includes('delhi') || cityLower.includes('ncr')) return 'delhi';
    if (cityLower.includes('noida') || cityLower.includes('ghaziabad') || cityLower.includes('meerut') || cityLower.includes('lucknow')) return 'up';
    if (cityLower.includes('gurgaon') || cityLower.includes('faridabad') || cityLower.includes('haryana')) return 'haryana';
    if (cityLower.includes('jaipur') || cityLower.includes('alwar') || cityLower.includes('rajasthan')) return 'rajasthan';
    return 'delhi';
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN');
}

// Load driver's accepted loads
function loadAcceptedLoads(driver) {
    const container = document.getElementById('myLoadsContainer');
    const acceptedLoads = JSON.parse(localStorage.getItem('mkAcceptedLoads') || '[]');
    const driverAccepted = acceptedLoads.filter(l => l.driverId === driver.id);
    
    if (driverAccepted.length === 0) {
        container.innerHTML = `
            <div class="no-loads">
                <i class="fas fa-clipboard-list"></i>
                <p>No accepted loads yet. Accept a load from above to start.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = driverAccepted.map(load => {
        const pickup = load.stops ? load.stops[0] : { city: load.pickup };
        const delivery = load.stops ? load.stops[load.stops.length - 1] : { city: load.delivery };
        
        return `
            <div class="load-card" style="border-color: var(--success);">
                <div class="load-info">
                    <h4>${load.cargoType} • ${load.totalWeight} tons</h4>
                    <div class="load-route">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${pickup.city}</span>
                        <i class="fas fa-arrow-right arrow"></i>
                        <span>${delivery.city}</span>
                    </div>
                    <div class="load-details">
                        <div class="load-detail">
                            <i class="fas fa-user"></i>
                            <span>${load.customerName}</span>
                        </div>
                        <div class="load-detail">
                            <i class="fas fa-phone"></i>
                            <span>${load.customerPhone}</span>
                        </div>
                    </div>
                </div>
                <div class="load-actions">
                    <button class="btn btn-success">Accepted</button>
                    <button class="btn btn-primary" onclick="callCustomer('${load.customerPhone}')">
                        <i class="fas fa-phone"></i> Call
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// View load details in modal
function viewLoadDetails(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const modal = document.getElementById('loadModal');
    const content = document.getElementById('loadDetailsContent');
    
    // Build stops HTML
    const stopsHtml = booking.stops.map((stop, index) => `
        <p><strong>${index === 0 ? 'Pickup' : index === booking.stops.length - 1 ? 'Delivery' : 'Stop ' + (index + 1)}:</strong> <span>${stop.city} - ${stop.address}</span></p>
    `).join('');
    
    content.innerHTML = `
        <p><strong>Customer:</strong> <span>${booking.customerName}</span></p>
        <p><strong>Phone:</strong> <span>${booking.customerPhone}</span></p>
        <p><strong>Cargo Type:</strong> <span>${booking.cargoType}</span></p>
        <p><strong>Weight:</strong> <span>${booking.totalWeight} tons</span></p>
        <p><strong>Vehicle:</strong> <span>${booking.vehicleType}</span></p>
        <p><strong>Date:</strong> <span>${formatDate(booking.date)}</span></p>
        ${stopsHtml}
        ${booking.additionalNotes ? `<p><strong>Notes:</strong> <span>${booking.additionalNotes}</span></p>` : ''}
    `;
    
    // Store booking ID for acceptance
    document.getElementById('acceptLoadBtn').onclick = () => acceptLoad(bookingId);
    
    modal.classList.add('show');
}

// Close modal
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('loadModal').classList.remove('show');
});

// Close modal on outside click
document.getElementById('loadModal').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

// Accept a load
function acceptLoad(bookingId) {
    const driverData = localStorage.getItem('mkDriverLoggedIn');
    if (!driverData) {
        alert('Please login first!');
        window.location.href = 'driver-login.html';
        return;
    }
    
    const driver = JSON.parse(driverData);
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
        alert('Booking not found!');
        return;
    }
    
    const booking = bookings[bookingIndex];
    
    // Check if already accepted by this driver
    if (booking.acceptedBy && booking.acceptedBy.includes(driver.id)) {
        alert('You have already responded to this load!');
        return;
    }
    
    // Update booking status
    bookings[bookingIndex].status = 'accepted';
    bookings[bookingIndex].acceptedBy = bookings[bookingIndex].acceptedBy || [];
    bookings[bookingIndex].acceptedBy.push(driver.id);
    bookings[bookingIndex].acceptedDriver = driver.name;
    bookings[bookingIndex].acceptedDriverPhone = driver.phone;
    localStorage.setItem('mkBookings', JSON.stringify(bookings));
    
    // Add to accepted loads
    let acceptedLoads = JSON.parse(localStorage.getItem('mkAcceptedLoads') || '[]');
    acceptedLoads.push({
        ...booking,
        driverId: driver.id,
        driverName: driver.name,
        acceptedTime: new Date().toISOString()
    });
    localStorage.setItem('mkAcceptedLoads', JSON.stringify(acceptedLoads));
    
    // Update driver's stats
    let drivers = JSON.parse(localStorage.getItem('mkDrivers') || '[]');
    const driverIndex = drivers.findIndex(d => d.id === driver.id);
    if (driverIndex !== -1) {
        drivers[driverIndex].acceptedLoads = (drivers[driverIndex].acceptedLoads || 0) + 1;
        localStorage.setItem('mkDrivers', JSON.stringify(drivers));
    }
    
    alert(`Load Accepted! \n\nPickup: ${booking.stops[0].city}\nDelivery: ${booking.stops[booking.stops.length - 1].city}\n\nContact customer: ${booking.customerPhone}`);
    
    // Refresh the page
    location.reload();
}

// Decline a load
function declineLoad(bookingId) {
    const driverData = localStorage.getItem('mkDriverLoggedIn');
    if (!driverData) {
        alert('Please login first!');
        window.location.href = 'driver-login.html';
        return;
    }
    
    const driver = JSON.parse(driverData);
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
        alert('Booking not found!');
        return;
    }
    
    const booking = bookings[bookingIndex];
    
    // Track declined drivers
    if (!booking.declinedBy) {
        bookings[bookingIndex].declinedBy = [];
    }
    bookings[bookingIndex].declinedBy.push(driver.id);
    localStorage.setItem('mkBookings', JSON.stringify(bookings));
    
    alert('Load declined. You will not be shown this load again.');
    
    // Remove from view
    const loadCard = document.querySelector(`[data-load-id="${bookingId}"]`);
    if (loadCard) {
        loadCard.style.display = 'none';
    }
    
    // Update available count
    document.getElementById('availableLoads').textContent = getPendingBookingsCount();
}

// Call customer
function callCustomer(phone) {
    window.location.href = `tel:${phone}`;
}

// Make functions global
window.viewLoadDetails = viewLoadDetails;
window.acceptLoad = acceptLoad;
window.declineLoad = declineLoad;
window.callCustomer = callCustomer;
window.logoutDriver = logoutDriver;

// Logout function
function logoutDriver() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('mkDriverLoggedIn');
        window.location.href = 'driver-login.html';
    }
}