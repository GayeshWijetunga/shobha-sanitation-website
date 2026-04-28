document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fade-in Animation on Scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const checkFade = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', checkFade);
    checkFade(); // Initial check

    // Set Active State on Navigation based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    // Form Submission Handler (WhatsApp Redirect)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value || '';
            const phone = document.getElementById('phone')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const service = document.getElementById('service')?.options[document.getElementById('service')?.selectedIndex]?.text || '';
            const date = document.getElementById('date')?.value || '';
            const time = document.getElementById('time')?.options[document.getElementById('time')?.selectedIndex]?.text || '';
            const message = document.getElementById('message')?.value || '';
            
            // Construct message
            let waMessage = `*New Quote Request*\n\n`;
            waMessage += `*Name:* ${name}\n`;
            waMessage += `*Phone:* ${phone}\n`;
            if (email) waMessage += `*Email:* ${email}\n`;
            if (service && service !== '-- Choose a Service --') waMessage += `*Service:* ${service}\n`;
            if (date) waMessage += `*Date:* ${date}\n`;
            if (time) waMessage += `*Time:* ${time}\n`;
            if (message) waMessage += `\n*Details:*\n${message}`;
            
            // Redirect to WhatsApp
            const encodedMessage = encodeURIComponent(waMessage);
            window.open(`https://wa.me/94707185555?text=${encodedMessage}`, '_blank');
            
            // Optional: Show alert and reset
            // alert('Redirecting to WhatsApp...');
            form.reset();
        });
    });
});
