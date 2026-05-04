// MK Transports - JavaScript

// Initialize Google Places Autocomplete as a global callback for the Maps API
window.initAutocomplete = function() {
    const fromInput = document.getElementById('quickFrom');
    const toInput = document.getElementById('quickTo');

    if (fromInput && window.google) {
        new google.maps.places.Autocomplete(fromInput, {
            componentRestrictions: { country: 'in' }, // Restrict to India
            fields: ['formatted_address', 'geometry'],
            types: ['geocode']
        });
    }

    if (toInput && window.google) {
        new google.maps.places.Autocomplete(toInput, {
            componentRestrictions: { country: 'in' }, // Restrict to India
            fields: ['formatted_address', 'geometry'],
            types: ['geocode']
        });
    }
};

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileToggle');
    const nav = document.getElementById('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('open');
        });
    }
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                nav.classList.remove('active');
                mobileMenuBtn.classList.remove('open');
            }
        });
    });
    
    // Header Background Change on Scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Form Submission
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Create WhatsApp message
            const whatsappMessage = `Hello MK Transports, I am interested in your services.%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Service:* ${service}%0A*Message:* ${message || 'No message'}`;
            
            // Redirect to WhatsApp
            const whatsappNumber = '919643943256';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            alert('Thank you for your inquiry! You will be redirected to WhatsApp to complete your request.');
            
            // Reset form
            quoteForm.reset();
        });
    }

    // Quick Quote Form Submission
    const quickQuoteForm = document.getElementById('quickQuoteForm');
    if (quickQuoteForm) {
        quickQuoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const from = document.getElementById('quickFrom').value;
            const to = document.getElementById('quickTo').value;
            const weight = document.getElementById('quickWeight').value;
            const vehicle = document.getElementById('quickVehicle').value;
            const phone = document.getElementById('quickPhone').value;
            
            // Create WhatsApp message
            const whatsappMessage = `Hello MK Transports, I want to book a truck.%0A%0A*From:* ${from}%0A*To:* ${to}%0A*Weight:* ${weight} tons%0A*Vehicle Type:* ${vehicle}%0A*Phone:* ${phone}`;
            
            // Redirect to WhatsApp
            const whatsappNumber = '919643943256';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
            
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            alert('Thank you for your booking request! You will be redirected to WhatsApp to complete your booking.');
            
            // Reset form
            quickQuoteForm.reset();
        });
    }
    
    // Animate Stats on Scroll
    const stats = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + '+';
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe service cards
    document.querySelectorAll('.service-card, .fleet-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add animation class
    const style = document.createElement('style');
    style.textContent = `
        .animate {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Stagger animation delay
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Phone link for mobile
    const contactPhone = document.querySelector('.header-phone span');
    if (contactPhone) {
        contactPhone.style.cursor = 'pointer';
        contactPhone.addEventListener('click', function() {
            window.location.href = 'tel:9643943256';
        });
    }

    initCookieConsent();
    console.log('MK Transports Website Loaded Successfully');
});

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        return key === name ? decodeURIComponent(value) : acc;
    }, '');
}

function initCookieConsent() {
    const consent = getCookie('mk_cookie_consent');
    const banner = document.getElementById('cookieConsentBanner');
    const acceptAllBtn = document.getElementById('acceptAllCookies');
    const necessaryBtn = document.getElementById('acceptNecessaryCookies');

    if (!banner) return;

    if (!consent) {
        banner.classList.add('visible');
    } else {
        applyCookieConsent(consent);
    }

    if (acceptAllBtn) acceptAllBtn.addEventListener('click', () => saveCookieConsent('all'));
    if (necessaryBtn) necessaryBtn.addEventListener('click', () => saveCookieConsent('necessary'));
}

function saveCookieConsent(value) {
    setCookie('mk_cookie_consent', value, 365);
    setCookie('mk_cookie_consent_date', new Date().toISOString(), 365);
    if (value === 'all') {
        setCookie('mk_visit_count', String(Number(getCookie('mk_visit_count') || 0) + 1), 365);
        setCookie('mk_last_action', new Date().toISOString(), 365);
    } else {
        setCookie('mk_last_visit', new Date().toISOString(), 365);
    }
    const banner = document.getElementById('cookieConsentBanner');
    if (banner) banner.classList.remove('visible');
}

function applyCookieConsent(value) {
    if (value === 'all') {
        setCookie('mk_visit_count', String(Number(getCookie('mk_visit_count') || 0) + 1), 365);
    } else if (value === 'necessary') {
        setCookie('mk_last_visit', new Date().toISOString(), 365);
    }
}
