document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('customerRegisterForm');
    const messageBox = document.getElementById('registerMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const company = document.getElementById('regCompany').value.trim();
        const city = document.getElementById('regCity').value.trim();
        const address = document.getElementById('regAddress').value.trim();

        if (!name || !phone || !city) {
            showMessage('Please complete the required fields.', 'error');
            return;
        }

        const customer = {
            id: Date.now(),
            name,
            phone,
            email,
            company,
            city,
            address,
            registeredAt: new Date().toISOString(),
            bookings: []
        };

        saveCustomerProfile(customer);
        localStorage.setItem('mkCurrentCustomer', JSON.stringify(customer));

        showMessage('Registration successful. You can now proceed to book a truck.', 'success');
        form.reset();

        setTimeout(() => {
            window.location.href = 'book-truck.html';
        }, 1800);
    });

    function saveCustomerProfile(customer) {
        const customers = JSON.parse(localStorage.getItem('mkCustomers') || '[]');
        const existingIndex = customers.findIndex(item => item.phone === customer.phone || (customer.email && item.email === customer.email));

        if (existingIndex >= 0) {
            customers[existingIndex] = {
                ...customers[existingIndex],
                name: customer.name,
                email: customer.email,
                company: customer.company,
                city: customer.city,
                address: customer.address,
                registeredAt: customers[existingIndex].registeredAt || customer.registeredAt
            };
        } else {
            customers.unshift(customer);
        }

        localStorage.setItem('mkCustomers', JSON.stringify(customers));
    }

    function showMessage(text, type) {
        if (!messageBox) return;
        messageBox.textContent = text;
        messageBox.className = `register-message ${type}`;
    }
});
