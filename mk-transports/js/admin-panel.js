// Master Admin Panel JavaScript

// Sample data
let loadsData = [];
let driversData = [];
let partnersData = [];
let acceptedLoadsData = [];
let customersData = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    setupNavigation();
    renderDashboard();
    updateBadges();
});

// Load data from localStorage
function loadDataFromStorage() {
    loadsData = JSON.parse(localStorage.getItem('mkLoads') || '[]');
    driversData = JSON.parse(localStorage.getItem('mkDrivers') || '[]');
    partnersData = JSON.parse(localStorage.getItem('mkPartners') || '[]');
    acceptedLoadsData = JSON.parse(localStorage.getItem('mkAcceptedLoads') || '[]');
    customersData = JSON.parse(localStorage.getItem('mkCustomers') || '[]');
    
    // If no data, add sample data
    if (loadsData.length === 0) {
        loadsData = getSampleLoads();
        localStorage.setItem('mkLoads', JSON.stringify(loadsData));
    }
    
    if (driversData.length === 0) {
        driversData = getSampleDrivers();
        localStorage.setItem('mkDrivers', JSON.stringify(driversData));
    }
    
    if (partnersData.length === 0) {
        partnersData = getSamplePartners();
        localStorage.setItem('mkPartners', JSON.stringify(partnersData));
    }
}

// Sample loads
function getSampleLoads() {
    return [
        { id: 1, pickup: 'Delhi', delivery: 'Gurgaon', cargo: 'Industrial Goods', weight: '5 tons', price: '3500', customer: 'Rajesh Kumar', phone: '9876543210', status: 'pending', date: '2026-04-27' },
        { id: 2, pickup: 'Noida', delivery: 'Jaipur', cargo: 'Textiles', weight: '8 tons', price: '18000', customer: 'Amit Sharma', phone: '9876543211', status: 'pending', date: '2026-04-27' },
        { id: 3, pickup: 'Faridabad', delivery: 'Lucknow', cargo: 'Electronics', weight: '3 tons', price: '22000', customer: 'Suresh Patel', phone: '9876543212', status: 'accepted', date: '2026-04-26' },
        { id: 4, pickup: 'Ghaziabad', delivery: 'Alwar', cargo: 'Machinery Parts', weight: '10 tons', price: '12000', customer: 'Vijay Singh', phone: '9876543213', status: 'pending', date: '2026-04-26' },
        { id: 5, pickup: 'Delhi', delivery: 'Meerut', cargo: 'Food Grains', weight: '7 tons', price: '6000', customer: 'Mohit Gupta', phone: '9876543214', status: 'completed', date: '2026-04-25' }
    ];
}

// Sample drivers
function getSampleDrivers() {
    return [
        { id: 1, name: 'Raj Kumar', phone: '9876543201', vehicleType: 'truck', vehicleNumber: 'DL 01 AB 1234', capacity: '10', location: 'Delhi', serviceAreas: ['delhi', 'up', 'haryana'], acceptedLoads: 5, completedTrips: 3, earnings: 15000 },
        { id: 2, name: 'Suraj Singh', phone: '9876543202', vehicleType: 'tempo', vehicleNumber: 'HR 02 CD 5678', capacity: '5', location: 'Gurgaon', serviceAreas: ['delhi', 'haryana'], acceptedLoads: 3, completedTrips: 2, earnings: 8000 },
        { id: 3, name: 'Mahesh Yadav', phone: '9876543203', vehicleType: 'pickup', vehicleNumber: 'UP 03 EF 9012', capacity: '3', location: 'Noida', serviceAreas: ['up', 'delhi'], acceptedLoads: 2, completedTrips: 1, earnings: 5000 }
    ];
}

// Sample partners
function getSamplePartners() {
    return [
        { id: 1, name: 'Baba Transport', phone: '9876543301', vehicleType: 'truck', vehicleNumber: 'RJ 04 GH 3456', location: 'Jaipur', trips: 10, earnings: 50000 },
        { id: 2, name: 'Fast Movers', phone: '9876543302', vehicleType: 'container', vehicleNumber: 'DL 05 IJ 7890', location: 'Delhi', trips: 8, earnings: 40000 }
    ];
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Update active nav
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            // Show page
            document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${page}`).classList.add('active');
            
            // Update title
            document.getElementById('pageTitle').textContent = this.querySelector('span').textContent;
            
            // Render page content
            renderPage(page);
        });
    });
}

// Render page content
function renderPage(page) {
    switch(page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'loads':
            renderLoads();
            break;
        case 'drivers':
            renderDrivers();
            break;
        case 'partners':
            renderPartners();
            break;
        case 'accepted':
            renderAcceptedLoads();
            break;
        case 'customers':
            renderCustomers();
            break;
        case 'earnings':
            renderEarnings();
            break;
    }
}

// Render Dashboard
function renderDashboard() {
    // Update stats
    document.getElementById('totalLoads').textContent = loadsData.length;
    document.getElementById('totalDrivers').textContent = driversData.length;
    document.getElementById('acceptedCount').textContent = acceptedLoadsData.length;
    
    // Calculate earnings
    const totalEarnings = acceptedLoadsData.reduce((sum, load) => sum + parseInt(load.price || 0), 0);
    document.getElementById('totalEarnings').textContent = `₹${totalEarnings.toLocaleString()}`;
    
    // Recent loads
    const recentLoadsList = document.getElementById('recentLoadsList');
    recentLoadsList.innerHTML = loadsData.slice(0, 3).map(load => `
        <div class="list-item">
            <div class="list-item-info">
                <h4>${load.pickup} → ${load.delivery}</h4>
                <p>${load.cargo} • ${load.weight}</p>
            </div>
            <span class="status ${load.status}">${load.status}</span>
        </div>
    `).join('');
    
    // Recent drivers
    const recentDriversList = document.getElementById('recentDriversList');
    recentDriversList.innerHTML = driversData.slice(0, 3).map(driver => `
        <div class="list-item">
            <div class="list-item-info">
                <h4>${driver.name}</h4>
                <p>${driver.vehicleType} • ${driver.vehicleNumber}</p>
            </div>
            <span>${driver.completedTrips || 0} trips</span>
        </div>
    `).join('');
}

// Render Loads
function renderLoads() {
    const tbody = document.getElementById('loadsTableBody');
    tbody.innerHTML = loadsData.map(load => `
        <tr>
            <td>#${load.id}</td>
            <td>${load.pickup}</td>
            <td>${load.delivery}</td>
            <td>${load.cargo}</td>
            <td>${load.weight}</td>
            <td>₹${parseInt(load.price).toLocaleString()}</td>
            <td>${load.customer}</td>
            <td>${load.phone}</td>
            <td><span class="status ${load.status}">${load.status}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editLoad(${load.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteLoad(${load.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Render Drivers
function renderDrivers() {
    const grid = document.getElementById('driversGrid');
    grid.innerHTML = driversData.map(driver => `
        <div class="driver-card">
            <div class="driver-header">
                <div class="driver-avatar">${driver.name.charAt(0)}</div>
                <div class="driver-info">
                    <h4>${driver.name}</h4>
                    <p>${driver.phone}</p>
                </div>
            </div>
            <div class="driver-details">
                <div class="detail-item">
                    <i class="fas fa-truck"></i>
                    <span>${driver.vehicleType}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-id-card"></i>
                    <span>${driver.vehicleNumber}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${driver.location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-box"></i>
                    <span>${driver.capacity} tons</span>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);">
                <small style="color: var(--gray);">Trips: ${driver.completedTrips || 0} • Earnings: ₹${driver.earnings || 0}</small>
            </div>
        </div>
    `).join('');
}

// Render Partners
function renderPartners() {
    const grid = document.getElementById('partnersGrid');
    grid.innerHTML = partnersData.map(partner => `
        <div class="partner-card">
            <div class="partner-header">
                <div class="partner-avatar">${partner.name.charAt(0)}</div>
                <div class="partner-info">
                    <h4>${partner.name}</h4>
                    <p>${partner.phone}</p>
                </div>
            </div>
            <div class="partner-details">
                <div class="detail-item">
                    <i class="fas fa-truck"></i>
                    <span>${partner.vehicleType}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-id-card"></i>
                    <span>${partner.vehicleNumber}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${partner.location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-route"></i>
                    <span>${partner.trips || 0} trips</span>
                </div>
            </div>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);">
                <small style="color: var(--gray);">Earnings: ₹${partner.earnings || 0}</small>
            </div>
        </div>
    `).join('');
}

// Render Accepted Loads
function renderAcceptedLoads() {
    const tbody = document.getElementById('acceptedTableBody');
    const accepted = acceptedLoadsData.length > 0 ? acceptedLoadsData : loadsData.filter(l => l.status === 'accepted');
    
    tbody.innerHTML = accepted.map(load => `
        <tr>
            <td>#${load.id}</td>
            <td>${load.pickup} → ${load.delivery}</td>
            <td>${load.cargo}</td>
            <td>₹${parseInt(load.price).toLocaleString()}</td>
            <td>${load.driverName || 'Not Assigned'}</td>
            <td>${load.customerPhone || '-'}</td>
            <td><span class="status accepted">Accepted</span></td>
            <td>
                <button class="btn btn-sm btn-success" onclick="completeLoad(${load.id})">Complete</button>
            </td>
        </tr>
    `).join('');
}

// Render Customers
function renderCustomers() {
    const list = document.getElementById('customersList');
    const customers = loadsData.map(l => ({ name: l.customer, phone: l.phone, load: `${l.pickup} → ${l.delivery}`, date: l.date }));
    
    list.innerHTML = customers.map(cust => `
        <div class="list-item">
            <div class="list-item-info">
                <h4>${cust.name}</h4>
                <p>${cust.load}</p>
            </div>
            <div class="list-item-actions">
                <a href="tel:${cust.phone}" class="btn btn-sm btn-primary"><i class="fas fa-phone"></i></a>
                <span style="color: var(--gray); font-size: 13px;">${cust.date}</span>
            </div>
        </div>
    `).join('');
}

// Render Earnings
function renderEarnings() {
    const totalEarnings = acceptedLoadsData.reduce((sum, load) => sum + parseInt(load.price || 0), 0);
    const commission = Math.round(totalEarnings * 0.1);
    
    document.getElementById('totalEarningsAmount').textContent = `₹${totalEarnings.toLocaleString()}`;
    document.getElementById('monthlyEarnings').textContent = `₹${totalEarnings.toLocaleString()}`;
    document.getElementById('commissionEarned').textContent = `₹${commission.toLocaleString()}`;
    
    const tbody = document.getElementById('earningsTableBody');
    tbody.innerHTML = acceptedLoadsData.map(load => {
        const tripAmount = parseInt(load.price || 0);
        const comm = Math.round(tripAmount * 0.1);
        return `
            <tr>
                <td>${load.date || '2026-04-27'}</td>
                <td>${load.pickup} → ${load.delivery}</td>
                <td>${load.driverName || 'N/A'}</td>
                <td>₹${tripAmount.toLocaleString()}</td>
                <td style="color: var(--success);">₹${comm.toLocaleString()}</td>
            </tr>
        `;
    }).join('');
}

// Update badges
function updateBadges() {
    document.getElementById('loadsBadge').textContent = loadsData.filter(l => l.status === 'pending').length;
    document.getElementById('driversBadge').textContent = driversData.length;
    document.getElementById('partnersBadge').textContent = partnersData.length;
}

// Modal functions
function openAddLoadModal() {
    document.getElementById('addLoadModal').classList.add('show');
}

function openAddPartnerModal() {
    document.getElementById('addPartnerModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Add new load
document.getElementById('addLoadForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newLoad = {
        id: Date.now(),
        pickup: document.getElementById('loadPickup').value,
        delivery: document.getElementById('loadDelivery').value,
        cargo: document.getElementById('loadCargo').value,
        weight: document.getElementById('loadWeight').value,
        price: document.getElementById('loadPrice').value,
        distance: document.getElementById('loadDistance').value,
        customer: document.getElementById('loadCustomer').value,
        phone: document.getElementById('loadCustomerPhone').value,
        pickupAddress: document.getElementById('loadPickupAddress').value,
        deliveryAddress: document.getElementById('loadDeliveryAddress').value,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
    };
    
    loadsData.push(newLoad);
    localStorage.setItem('mkLoads', JSON.stringify(loadsData));
    
    alert('Load added successfully!');
    closeModal('addLoadModal');
    this.reset();
    renderLoads();
    updateBadges();
});

// Add new partner
document.getElementById('addPartnerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newPartner = {
        id: Date.now(),
        name: document.getElementById('partnerName').value,
        phone: document.getElementById('partnerPhone').value,
        vehicleType: document.getElementById('partnerVehicleType').value,
        vehicleNumber: document.getElementById('partnerVehicleNumber').value,
        location: document.getElementById('partnerLocation').value,
        trips: 0,
        earnings: 0
    };
    
    partnersData.push(newPartner);
    localStorage.setItem('mkPartners', JSON.stringify(partnersData));
    
    alert('Partner added successfully!');
    closeModal('addPartnerModal');
    this.reset();
    renderPartners();
    updateBadges();
});

// Edit load
function editLoad(id) {
    const load = loadsData.find(l => l.id === id);
    if (load) {
        alert(`Edit load #${id}\n\nIn production, this would open an edit form.`);
    }
}

// Delete load
function deleteLoad(id) {
    if (confirm('Are you sure you want to delete this load?')) {
        loadsData = loadsData.filter(l => l.id !== id);
        localStorage.setItem('mkLoads', JSON.stringify(loadsData));
        renderLoads();
        updateBadges();
    }
}

// Complete load
function completeLoad(id) {
    if (confirm('Mark this load as completed?')) {
        const loadIndex = loadsData.findIndex(l => l.id === id);
        if (loadIndex !== -1) {
            loadsData[loadIndex].status = 'completed';
            localStorage.setItem('mkLoads', JSON.stringify(loadsData));
            renderAcceptedLoads();
            updateBadges();
        }
    }
}

// Search drivers
function searchDrivers() {
    const search = document.getElementById('driverSearch').value.toLowerCase();
    const filtered = driversData.filter(d => 
        d.name.toLowerCase().includes(search) || 
        d.phone.includes(search) ||
        d.vehicleNumber.toLowerCase().includes(search)
    );
    
    const grid = document.getElementById('driversGrid');
    grid.innerHTML = filtered.map(driver => `
        <div class="driver-card">
            <div class="driver-header">
                <div class="driver-avatar">${driver.name.charAt(0)}</div>
                <div class="driver-info">
                    <h4>${driver.name}</h4>
                    <p>${driver.phone}</p>
                </div>
            </div>
            <div class="driver-details">
                <div class="detail-item">
                    <i class="fas fa-truck"></i>
                    <span>${driver.vehicleType}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-id-card"></i>
                    <span>${driver.vehicleNumber}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${driver.location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-box"></i>
                    <span>${driver.capacity} tons</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Export data
function exportData() {
    const data = {
        loads: loadsData,
        drivers: driversData,
        partners: partnersData,
        acceptedLoads: acceptedLoadsData,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mk-transports-data.json';
    a.click();
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This cannot be undone!')) {
        if (confirm('This will delete all loads, drivers, and partners. Continue?')) {
            localStorage.clear();
            location.reload();
        }
    }
}

// Settings form
document.getElementById('companySettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Company settings saved!');
});

document.getElementById('commissionSettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Commission settings saved!');
});