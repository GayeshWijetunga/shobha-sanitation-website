document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile Menu Toggle ──────────────────────────────────────
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // ── Smooth Scrolling ────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // ── Fade-in on Scroll ───────────────────────────────────────
    const fadeElements = document.querySelectorAll('.fade-in');
    const checkFade = () => {
        const triggerBottom = window.innerHeight * 0.85;
        fadeElements.forEach(el => {
            if (el.getBoundingClientRect().top < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', checkFade);
    checkFade();

    // ── Active Nav Link ─────────────────────────────────────────
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) link.classList.add('active');
    });

    // ── Modal Setup ─────────────────────────────────────────────
    const overlay       = document.getElementById('quoteModalOverlay');
    const modalWABtn    = document.getElementById('modalWhatsApp');
    const modalEmailBtn = document.getElementById('modalEmail');
    const modalTitle    = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');

    if (!overlay) return;

    const closeModal = () => overlay.classList.remove('active');
    document.getElementById('quoteModalClose').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    /**
     * Open the modal with specific WhatsApp + Email URLs.
     * Optionally update the modal heading/subtitle.
     */
    function openModal(waURL, emailURL, title, subtitle) {
        modalWABtn.href    = waURL;
        modalEmailBtn.href = emailURL;
        if (modalTitle)    modalTitle.textContent    = title    || 'Get a Free Quote';
        if (modalSubtitle) modalSubtitle.textContent = subtitle || 'Choose how you\'d like to reach us:';
        overlay.classList.add('active');
    }

    // ── Generic Quote Triggers (non-form buttons) ───────────────
    const genericWA = 'https://wa.me/94707185555?text=' +
                      encodeURIComponent('Hello, I would like to get a quote for cleaning services.');
    const genericEmail = 'mailto:shobhasanitation@gmail.com' +
                         '?subject=' + encodeURIComponent('Cleaning Service Quote Request') +
                         '&body='    + encodeURIComponent('Hello, I would like to request a quote for your cleaning services.');

    document.querySelectorAll('.quote-trigger').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            openModal(genericWA, genericEmail, 'Get a Free Quote', 'Choose how you\'d like to reach us:');
        });
    });

    // ── Contact Form Submission ─────────────────────────────────
    // Intercepts form submit → builds personalised WA + Email from form data → shows modal
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            // Collect values
            const name    = (document.getElementById('name')?.value    || '').trim();
            const phone   = (document.getElementById('phone')?.value   || '').trim();
            const email   = (document.getElementById('email')?.value   || '').trim();
            const svcEl   = document.getElementById('service');
            const service = svcEl ? svcEl.options[svcEl.selectedIndex]?.text : '';
            const date    = (document.getElementById('date')?.value    || '').trim();
            const timeEl  = document.getElementById('time');
            const time    = timeEl ? timeEl.options[timeEl.selectedIndex]?.text : '';
            const message = (document.getElementById('message')?.value || '').trim();

            const svcLabel = (service && service !== '-- Choose a Service --') ? service : '';

            // ── WhatsApp message (bold markdown) ──
            let waMsg = `*New Quote Request — SHOBHA SANITATION*\n\n`;
            waMsg += `*Name:*    ${name}\n`;
            waMsg += `*Phone:*   ${phone}\n`;
            if (email)    waMsg += `*Email:*   ${email}\n`;
            if (svcLabel) waMsg += `*Service:* ${svcLabel}\n`;
            if (date)     waMsg += `*Date:*    ${date}\n`;
            if (time)     waMsg += `*Time:*    ${time}\n`;
            if (message)  waMsg += `\n*Additional Details:*\n${message}\n`;
            waMsg += `\nThank you!`;

            const waURL = 'https://wa.me/94707185555?text=' + encodeURIComponent(waMsg);

            // ── Email body (plain text) ──
            let emailBody = `Hello SHOBHA SANITATION,\n\n`;
            emailBody += `I would like to request a free quote for your cleaning services.\n\n`;
            emailBody += `--- Quote Request Details ---\n\n`;
            emailBody += `Name:    ${name}\n`;
            emailBody += `Phone:   ${phone}\n`;
            if (email)    emailBody += `Email:   ${email}\n`;
            if (svcLabel) emailBody += `Service: ${svcLabel}\n`;
            if (date)     emailBody += `Preferred Date: ${date}\n`;
            if (time)     emailBody += `Preferred Time: ${time}\n`;
            if (message)  emailBody += `\nAdditional Details:\n${message}\n`;
            emailBody += `\nThank you.`;

            const emailURL = 'mailto:shobhasanitation@gmail.com' +
                             '?subject=' + encodeURIComponent('Cleaning Service Quote Request') +
                             '&body='    + encodeURIComponent(emailBody);

            openModal(
                waURL,
                emailURL,
                'Send Your Quote Request',
                'Your details are ready — choose how to send them:'
            );

            // Reset form after modal opens
            form.reset();
        });
    });

});
