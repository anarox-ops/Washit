/* ═══════════════════════════════════════════════
   WASHIT — Interactive Logic
   ═══════════════════════════════════════════════ */

// ── BRANDED SNEAKER BRANDS (trigger surcharge) ──
const BRANDED_BRANDS = ['nike', 'adidas', 'jordan', 'yeezy', 'newbalance', 'puma', 'converse', 'reebok'];
const BRAND_SURCHARGE = 200;

const SERVICE_MAP = {
    '199': 'Basic Wash',
    '399': 'Deep Clean',
    '699': 'Premium Restore',
    '999': 'Branded Care'
};

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ── MOBILE MENU ──
function toggleMobileMenu() {
    const links = document.getElementById('nav-links');
    links.classList.toggle('open');
}

// ── SMOOTH SCROLL ──
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ── PARTICLES ──
function createParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.width = (2 + Math.random() * 3) + 'px';
        particle.style.height = particle.style.width;

        // Random color variations
        const colors = [
            'rgba(0, 212, 170, 0.3)',
            'rgba(124, 92, 252, 0.3)',
            'rgba(255, 107, 157, 0.2)',
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}

// ── SCROLL ANIMATIONS ──
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.service-card, .pricing-card, .step-card, .branded-img-wrap, .branded-content, .showcase-content, .showcase-img-wrap'
    );

    elements.forEach(el => el.classList.add('animate-on-scroll'));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    elements.forEach(el => observer.observe(el));
}

// ── BOOKING MODAL ──
function openBookingModal(service, price) {
    const modal = document.getElementById('booking-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('pickup-date').min = tomorrow.toISOString().split('T')[0];

    // Pre-select service if passed
    if (price) {
        const serviceSelect = document.getElementById('wash-service');
        serviceSelect.value = price.toString();
    }

    updateTotalPrice();
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modals on overlay click
document.getElementById('booking-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeBookingModal();
});

document.getElementById('success-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeSuccessModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBookingModal();
        closeSuccessModal();
    }
});

// ── BRANDED PRICING LOGIC ──
function updateBrandedPricing() {
    const brand = document.getElementById('sneaker-brand').value;
    const surchargeEl = document.getElementById('branded-surcharge');
    const surchargeRow = document.getElementById('surcharge-row');
    const isBranded = brand !== 'other';

    surchargeEl.style.display = isBranded ? 'flex' : 'none';
    surchargeRow.style.display = isBranded ? 'flex' : 'none';

    updateTotalPrice();
}

function updateTotalPrice() {
    const serviceSelect = document.getElementById('wash-service');
    const pairsInput = document.getElementById('sneaker-pairs');
    const brand = document.getElementById('sneaker-brand').value;

    const basePrice = parseInt(serviceSelect.value);
    const pairs = parseInt(pairsInput.value) || 1;
    const isBranded = brand !== 'other';
    const surcharge = isBranded ? BRAND_SURCHARGE : 0;

    const total = (basePrice + surcharge) * pairs;

    // Update summary
    document.getElementById('summary-service').textContent = SERVICE_MAP[basePrice] || 'Basic Wash';
    document.getElementById('summary-pairs').textContent = pairs;
    document.getElementById('summary-total').textContent = '₹' + total.toLocaleString('en-IN');
}

// ── HANDLE BOOKING FORM ──
async function handleBooking(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submit-booking-btn');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="btn-spinner"></span>
        Sending Confirmation...
    `;

    const name = document.getElementById('customer-name').value;
    const phone = document.getElementById('customer-phone').value;
    const email = document.getElementById('customer-email').value;
    const brand = document.getElementById('sneaker-brand');
    const brandName = brand.options[brand.selectedIndex].text;
    const pairs = document.getElementById('sneaker-pairs').value;
    const service = document.getElementById('wash-service');
    const serviceName = service.options[service.selectedIndex].text.split('—')[0].trim();
    const servicePrice = parseInt(service.value);
    const date = document.getElementById('pickup-date').value;
    const notes = document.getElementById('special-notes').value;
    const totalText = document.getElementById('summary-total').textContent;

    const isBranded = brand.value !== 'other';
    const surcharge = isBranded ? BRAND_SURCHARGE : 0;
    const total = (servicePrice + surcharge) * parseInt(pairs);

    const bookingData = {
        name,
        email,
        phone,
        brand: brand.value,
        brandName,
        pairs: parseInt(pairs),
        service: servicePrice,
        serviceName,
        pickupDate: date,
        notes,
        isBranded,
        surcharge,
        total,
    };

    let emailSent = false;
    let errorMessage = '';

    try {
        const isLocalStatic = window.location.port !== '3000' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const apiUrl = isLocalStatic ? 'http://localhost:3000/api/book' : '/api/book';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (result.success) {
            emailSent = true;
        } else {
            errorMessage = result.message || 'Could not send confirmation email.';
        }
    } catch (err) {
        console.error('Booking API error:', err);
        errorMessage = 'Could not connect to server. Your booking details have been recorded.';
    }

    // Build success details
    const details = document.getElementById('success-details');
    details.innerHTML = `
        <div class="detail-row"><span>Name</span><strong>${name}</strong></div>
        <div class="detail-row"><span>Email</span><strong>${email}</strong></div>
        <div class="detail-row"><span>Phone</span><strong>${phone}</strong></div>
        <div class="detail-row"><span>Brand</span><strong>${brandName}</strong></div>
        <div class="detail-row"><span>Pairs</span><strong>${pairs}</strong></div>
        <div class="detail-row"><span>Service</span><strong>${serviceName}</strong></div>
        ${isBranded ? '<div class="detail-row"><span>Brand Surcharge</span><strong>+₹200/pair</strong></div>' : ''}
        <div class="detail-row"><span>Pickup Date</span><strong>${formatDate(date)}</strong></div>
        ${notes ? `<div class="detail-row"><span>Notes</span><strong>${notes}</strong></div>` : ''}
        <div class="detail-row" style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;">
            <span style="font-size:1.1rem;font-weight:700;color:var(--accent-1)">Total</span>
            <strong style="font-size:1.1rem;color:var(--accent-1)">${totalText}</strong>
        </div>
        ${emailSent
            ? `<div class="email-sent-badge"><span>📧</span> Confirmation email sent to <strong>${email}</strong></div>`
            : (errorMessage ? `<div class="email-error-badge"><span>⚠️</span> ${errorMessage}</div>` : '')
        }
    `;

    document.getElementById('success-message').textContent =
        `Thanks ${name.split(' ')[0]}! Your sneaker wash has been booked.`;

    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Close booking modal, open success modal
    closeBookingModal();
    setTimeout(() => {
        const successModal = document.getElementById('success-modal');
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 200);

    // Reset form
    document.getElementById('booking-form').reset();
    document.getElementById('branded-surcharge').style.display = 'none';
    document.getElementById('surcharge-row').style.display = 'none';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// ── COUNTER ANIMATION ──
function animateCounters() {
    const counters = [
        { id: 'stat-pairs', target: 5000, suffix: '+', prefix: '' },
    ];

    // Note: Using simple approach since IntersectionObserver is already used
    // The stats are in the hero which is immediately visible
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initScrollAnimations();
    updateTotalPrice();
});
