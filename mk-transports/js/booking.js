// Booking System JavaScript

let stopCount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
    document.getElementById('bookingDate').value = today;
    
    // Add initial stops (pickup and delivery)
    addStop('pickup');
    addStop('delivery');
    
    // Load recent bookings
    loadRecentBookings();
    prefillCustomerInfo();
    
    // Setup form submission
    setupBookingForm();
});

// Prefill customer contact details when a registered user reaches the booking page
function prefillCustomerInfo() {
    const customerJson = localStorage.getItem('mkCurrentCustomer');
    if (!customerJson) return;

    const customer = JSON.parse(customerJson);
    if (!customer) return;

    const nameField = document.getElementById('customerName');
    const phoneField = document.getElementById('customerPhone');
    const emailField = document.getElementById('customerEmail');

    if (nameField) nameField.value = customer.name || '';
    if (phoneField) phoneField.value = customer.phone || '';
    if (emailField) emailField.value = customer.email || '';
}

// Add a new stop
function addStop(type = null) {
    stopCount++;
    
    const container = document.getElementById('stopsContainer');
    const stops = container.querySelectorAll('.stop-item');
    const totalStops = stops.length;
    
    // Determine stop type
    let stopType, stopLabel, stopIcon;
    if (totalStops === 0) {
        stopType = 'pickup';
        stopLabel = 'Pickup Location';
        stopIcon = 'fa-map-marker';
    } else if (type === 'pickup') {
        stopType = 'pickup';
        stopLabel = 'Pickup Location';
        stopIcon = 'fa-map-marker';
    } else if (type === 'delivery') {
        stopType = 'delivery';
        stopLabel = 'Delivery Location';
        stopIcon = 'fa-flag-checkered';
    } else {
        stopType = 'stop';
        stopLabel = 'Intermediate Stop';
        stopIcon = 'fa-map-pin';
    }
    
    const stopHtml = `
        <div class="stop-item" data-stop-id="${stopCount}">
            <div class="stop-header">
                <div class="stop-number">
                    <i class="fas ${stopIcon}"></i>
                    <span>Stop ${totalStops + 1}</span>
                </div>
                ${totalStops > 1 ? `<button type="button" class="remove-stop" onclick="removeStop(${stopCount})"><i class="fas fa-times"></i></button>` : ''}
            </div>
            <div class="stop-fields">
                <div class="form-group">
                    <div class="stop-type-label ${stopType}">${stopLabel}</div>
                    <input type="text" class="stop-city" placeholder="City name" required>
                </div>
                <div class="form-group">
                    <div class="stop-type-label">Date</div>
                    <input type="date" class="stop-date" required>
                </div>
                <div class="form-group">
                    <div class="stop-type-label">Full Address</div>
                    <input type="text" class="stop-address" placeholder="Complete address" required>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', stopHtml);
    
    // Set min date for new stop
    const newStop = container.lastElementChild;
    const dateInput = newStop.querySelector('.stop-date');
    dateInput.min = document.getElementById('bookingDate').value;
    dateInput.value = document.getElementById('bookingDate').value;
}

// Remove a stop
function removeStop(stopId) {
    const stop = document.querySelector(`[data-stop-id="${stopId}"]`);
    if (stop) {
        stop.remove();
        // Renumber stops
        renumberStops();
    }
}

// Renumber stops after removal
function renumberStops() {
    const stops = document.querySelectorAll('.stop-item');
    stops.forEach((stop, index) => {
        const numberSpan = stop.querySelector('.stop-number span');
        numberSpan.textContent = `Stop ${index + 1}`;
        
        // Update type label
        const typeLabel = stop.querySelector('.stop-type-label');
        if (index === 0) {
            typeLabel.className = 'stop-type-label pickup';
            typeLabel.textContent = 'Pickup Location';
        } else if (index === stops.length - 1) {
            typeLabel.className = 'stop-type-label delivery';
            typeLabel.textContent = 'Delivery Location';
        } else {
            typeLabel.className = 'stop-type-label stop';
            typeLabel.textContent = 'Intermediate Stop';
        }
    });
}

// Toggle return trip (placeholder for future)
function toggleReturnTrip() {
    const tripType = document.getElementById('tripType').value;
    // Can add return trip logic here
}

// Setup booking form
function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all form data
        const booking = collectBookingData();
        
        // Save records to localStorage
        saveBooking(booking);
        saveCustomer(booking);
        saveLoad(booking);
        notifyCompany(booking);
        
        // Redirect customer to tracking portal
        alert('Booking request submitted successfully! Your booking is saved and notification has been prepared.');
        window.location.href = `track-booking.html?id=${booking.id}`;
    });
}

// Collect booking data
function collectBookingData() {
    // Get stops
    const stops = [];
    document.querySelectorAll('.stop-item').forEach(stop => {
        stops.push({
            type: stop.querySelector('.stop-city') ? 
                  (stop === document.querySelector('.stop-item:first-child') ? 'pickup' : 
                   (stop === document.querySelector('.stop-item:last-child') ? 'delivery' : 'stop')) : 'stop',
            city: stop.querySelector('.stop-city').value,
            date: stop.querySelector('.stop-date').value,
            address: stop.querySelector('.stop-address').value
        });
    });
    
    // Get requirements
    const requirements = [];
    document.querySelectorAll('input[name="requirement"]:checked').forEach(cb => {
        requirements.push(cb.value);
    });
    
    return {
        id: Date.now(),
        tripType: document.getElementById('tripType').value,
        date: document.getElementById('bookingDate').value,
        stops: stops,
        cargoType: document.getElementById('cargoType').value,
        totalWeight: document.getElementById('totalWeight').value,
        requirements: requirements,
        vehicleType: document.getElementById('vehicleType').value,
        vehicleCount: document.getElementById('vehicleCount').value,
        customerName: document.getElementById('customerName').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerEmail: document.getElementById('customerEmail').value,
        additionalNotes: document.getElementById('additionalNotes').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
}

// Save booking
function saveBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    bookings.unshift(booking); // Add to beginning
    localStorage.setItem('mkBookings', JSON.stringify(bookings));
}

// Save customer registration details
function saveCustomer(booking) {
    const customers = JSON.parse(localStorage.getItem('mkCustomers') || '[]');
    const existing = customers.find(c => c.phone === booking.customerPhone || (booking.customerEmail && c.email === booking.customerEmail));
    const customerRecord = {
        id: existing ? existing.id : Date.now(),
        name: booking.customerName,
        phone: booking.customerPhone,
        email: booking.customerEmail,
        mostRecentBooking: booking.date,
        bookings: existing ? Array.from(new Set([booking.id, ...(existing.bookings || [])])) : [booking.id]
    };

    if (existing) {
        const index = customers.findIndex(c => c.id === existing.id);
        customers[index] = customerRecord;
    } else {
        customers.unshift(customerRecord);
    }

    localStorage.setItem('mkCustomers', JSON.stringify(customers));
}

// Save bookings in admin load list too
function saveLoad(booking) {
    const loads = JSON.parse(localStorage.getItem('mkLoads') || '[]');
    const loadRecord = {
        id: booking.id,
        pickup: booking.stops[0]?.city || '',
        delivery: booking.stops[booking.stops.length - 1]?.city || '',
        cargo: booking.cargoType,
        weight: `${booking.totalWeight} tons`,
        price: 'TBD',
        customer: booking.customerName,
        phone: booking.customerPhone,
        pickupAddress: booking.stops[0]?.address || '',
        deliveryAddress: booking.stops[booking.stops.length - 1]?.address || '',
        status: 'pending',
        date: booking.date,
        vehicleType: booking.vehicleType,
        customerEmail: booking.customerEmail,
        additionalNotes: booking.additionalNotes
    };
    loads.unshift(loadRecord);
    localStorage.setItem('mkLoads', JSON.stringify(loads));
}

// Notify company by email and WhatsApp
function notifyCompany(booking) {
    const companyPhone = '919643943256';
    const companyEmail = 'info.mktransporter@gmail.com';
    const pickup = booking.stops[0]?.city || 'N/A';
    const delivery = booking.stops[booking.stops.length - 1]?.city || 'N/A';
    const pickupAddress = booking.stops[0]?.address || 'N/A';
    const deliveryAddress = booking.stops[booking.stops.length - 1]?.address || 'N/A';

    const emailBody = `New truck booking request has been submitted.%0A%0ACustomer Name: ${booking.customerName}%0APhone: ${booking.customerPhone}%0AEmail: ${booking.customerEmail || 'N/A'}%0A%0APickup: ${pickup}%0APickup Address: ${pickupAddress}%0ADelivery: ${delivery}%0ADelivery Address: ${deliveryAddress}%0A%0AVehicle Type: ${booking.vehicleType}%0AWeight: ${booking.totalWeight} tons%0A%0AAdditional Notes: ${booking.additionalNotes || 'None'}`;
    const mailtoUrl = `mailto:${companyEmail}?subject=New Truck Booking Request&body=${emailBody}`;
    const whatsappMessage = `New booking received for ${booking.customerName}. Pickup: ${pickup}. Delivery: ${delivery}. Contact: ${booking.customerPhone}.`;
    const whatsappUrl = `https://wa.me/91${companyPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(mailtoUrl, '_blank');
    window.open(whatsappUrl, '_blank');
}

// Load recent bookings
function loadRecentBookings() {
    const bookings = JSON.parse(localStorage.getItem('mkBookings') || '[]');
    const container = document.getElementById('recentBookingsList');
    
    if (bookings.length === 0) {
        container.innerHTML = '<p class="no-bookings">No bookings yet. Submit a booking above.</p>';
        return;
    }
    
    // Show last 5 bookings
    container.innerHTML = bookings.slice(0, 5).map(booking => {
        const pickup = booking.stops[0]?.city || 'N/A';
        const delivery = booking.stops[booking.stops.length - 1]?.city || 'N/A';
        
        return `
            <div class="booking-card">
                <div class="booking-info">
                    <h4>${booking.customerName} • ${booking.customerPhone}</h4>
                    <div class="booking-route">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${pickup}</span>
                        <i class="fas fa-arrow-right arrow"></i>
                        <span>${delivery}</span>
                        ${booking.stops.length > 2 ? `<span style="color: var(--gray); font-size: 12px;">(+${booking.stops.length - 2} stops)</span>` : ''}
                    </div>
                    <div class="booking-details">
                        <span><i class="fas fa-box"></i> ${booking.cargoType}</span>
                        <span><i class="fas fa-weight-hanging"></i> ${booking.totalWeight} tons</span>
                        <span><i class="fas fa-truck"></i> ${booking.vehicleType}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <a href="track-booking.html?id=${booking.id}" class="btn btn-secondary">Track</a>
                    <span class="booking-status ${booking.status}">${booking.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Make functions global
window.addStop = addStop;
window.removeStop = removeStop;
window.toggleReturnTrip = toggleReturnTrip;