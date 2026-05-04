// Driver Authentication System
// Uses localStorage for demo purposes

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if already logged in - redirect to dashboard
    const driverData = localStorage.getItem('mkDriverLoggedIn');
    if (driverData) {
        const driver = JSON.parse(driverData);
        // If on login/register page and already logged in, go to dashboard
        if (window.location.href.includes('driver-login.html') || 
            window.location.href.includes('driver-register.html')) {
            window.location.href = 'driver-dashboard.html';
            return;
        }
    }
    
    // Update navigation if logged in
    if (driverData) {
        const driver = JSON.parse(driverData);
        updateNavForLoggedIn(driver.name);
    }
    
    // Driver Login Form
    const loginForm = document.getElementById('driverLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phone = document.getElementById('loginPhone').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!phone || !password) {
                alert('Please enter both phone number and password');
                return;
            }
            
            // Get registered drivers
            const drivers = JSON.parse(localStorage.getItem('mkDrivers') || '[]');
            
            // Find matching driver
            const driver = drivers.find(d => d.phone === phone && d.password === password);
            
            if (driver) {
                // Save login session
                localStorage.setItem('mkDriverLoggedIn', JSON.stringify(driver));
                alert('Login successful! Redirecting to dashboard...');
                window.location.href = 'driver-dashboard.html';
            } else {
                alert('Invalid phone number or password.\n\nIf you are a new driver, please register first.');
            }
        });
    }
    
    // Driver Registration Form
    const registerForm = document.getElementById('driverRegisterForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('regName').value.trim();
            const phone = document.getElementById('regPhone').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const vehicleType = document.getElementById('regVehicleType').value;
            const vehicleNumber = document.getElementById('regVehicleNumber').value.trim().toUpperCase();
            const capacity = document.getElementById('regCapacity').value;
            const location = document.getElementById('regLocation').value.trim();
            
            // Get selected service areas
            const areas = [];
            document.querySelectorAll('input[name="area"]:checked').forEach(checkbox => {
                areas.push(checkbox.value);
            });
            
            // Validation
            if (!name || !phone || !password || !vehicleType || !vehicleNumber || !capacity || !location) {
                alert('Please fill in all required fields!');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 4) {
                alert('Password must be at least 4 characters!');
                return;
            }
            
            if (areas.length === 0) {
                alert('Please select at least one service area!');
                return;
            }
            
            // Get existing drivers
            let drivers = JSON.parse(localStorage.getItem('mkDrivers') || '[]');
            
            // Check if phone already registered
            if (drivers.find(d => d.phone === phone)) {
                alert('This phone number is already registered!\n\nPlease login with your existing account.');
                window.location.href = 'driver-login.html';
                return;
            }
            
            // Create new driver object
            const newDriver = {
                id: Date.now(),
                name: name,
                phone: phone,
                password: password,
                vehicleType: vehicleType,
                vehicleNumber: vehicleNumber,
                capacity: capacity,
                location: location,
                serviceAreas: areas,
                acceptedLoads: 0,
                completedTrips: 0,
                earnings: 0,
                registeredDate: new Date().toISOString()
            };
            
            // Add to drivers array
            drivers.push(newDriver);
            localStorage.setItem('mkDrivers', JSON.stringify(drivers));
            
            // Auto login
            localStorage.setItem('mkDriverLoggedIn', JSON.stringify(newDriver));
            
            alert('Registration successful!\n\nWelcome to MK Transports driver network.');
            window.location.href = 'driver-dashboard.html';
        });
    }
});

// Update navigation for logged in driver
function updateNavForLoggedIn(name) {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (dashboardLink) {
        dashboardLink.style.display = 'block';
        dashboardLink.textContent = 'Dashboard';
    }
    if (logoutLink) {
        logoutLink.style.display = 'block';
    }
}

// Logout function (called from dashboard)
function logoutDriver() {
    localStorage.removeItem('mkDriverLoggedIn');
    window.location.href = 'driver-login.html';
}

// Make function global
window.logoutDriver = logoutDriver;