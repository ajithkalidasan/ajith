/**
 * Main JavaScript for Portfolio Website
 * Portfolio: Ajith K - Python Developer
 * 
 * Updated for light theme with physics-based motion
 */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ================================
    // TYPEWRITER EFFECT
    // ================================

    const typewriterElement = document.getElementById('typewriter');
    const roles = ['Backend Developer', 'Django & Odoo Expert', 'Python Engineer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let pauseDuration = 2000;
    let currentTimeout;

    function typeWriter() {
        if (prefersReducedMotion) {
            // Show full text without animation
            typewriterElement.textContent = roles[roleIndex];
            roleIndex = (roleIndex + 1) % roles.length;
            currentTimeout = setTimeout(typeWriter, 3000);
            return;
        }

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = pauseDuration;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        currentTimeout = setTimeout(typeWriter, typingSpeed);
    }

    if (typewriterElement) {
        setTimeout(typeWriter, 1000);
    }

    window.addEventListener('beforeunload', () => {
        if (currentTimeout) clearTimeout(currentTimeout);
    });

    // ================================
    // EXPERIENCE CAROUSEL
    // ================================

    const experiences = [
        {
            text: 'I build resilient backends and thoughtful developer experiences. Django, PostgreSQL, and clean engineering—delivered with care.',
            icon: 'fas fa-laptop-code'
        },
        {
            text: 'Creative Python Developer with 1+ year of experience in Odoo ERP development. Skilled in building custom modules and streamlining business workflows.',
            icon: 'fas fa-cogs'
        },
        {
            text: 'Hands-on experience with PostgreSQL and Docker, ensuring robust database structures and efficient, containerized deployments.',
            icon: 'fas fa-database'
        },
        {
            text: 'Proficient in Git, GitHub, HTML, CSS, XML, and JavaScript—empowering seamless integration across backend and frontend workflows.',
            icon: 'fas fa-code'
        }
    ];

    let currentExpIndex = 0;
    const expElement = document.getElementById('experience-text');
    const prevBtn = document.getElementById('prev-exp');
    const nextBtn = document.getElementById('next-exp');
    let autoRotateInterval;

    function updateExperience() {
        const exp = experiences[currentExpIndex];
        expElement.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style="background: var(--color-accent-primary-light);">
                    <i class="${exp.icon}" style="color: var(--color-accent-primary);"></i>
                </div>
                <span style="color: var(--color-text-secondary);">${exp.text}</span>
            </div>
        `;

        if (!prefersReducedMotion) {
            expElement.style.opacity = '0';
            expElement.style.transform = 'translateY(10px)';
            setTimeout(() => {
                expElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                expElement.style.opacity = '1';
                expElement.style.transform = 'translateY(0)';
            }, 10);
        }
    }

    function changeExperience(direction) {
        if (!prefersReducedMotion) {
            expElement.style.opacity = '0';
            expElement.style.transform = 'translateY(-10px)';
        }

        setTimeout(() => {
            currentExpIndex = (currentExpIndex + direction + experiences.length) % experiences.length;
            updateExperience();
            resetAutoRotate();
        }, prefersReducedMotion ? 0 : 300);
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            changeExperience(1);
        }, 5000);
    }

    function resetAutoRotate() {
        clearInterval(autoRotateInterval);
        startAutoRotate();
    }

    if (expElement && prevBtn && nextBtn) {
        updateExperience();
        startAutoRotate();

        prevBtn.addEventListener('click', () => changeExperience(-1));
        nextBtn.addEventListener('click', () => changeExperience(1));

        expElement.parentElement.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });

        expElement.parentElement.addEventListener('mouseleave', () => {
            startAutoRotate();
        });
    }

    // ================================
    // MOBILE MENU
    // ================================

    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;

            if (menuOpen) {
                mobileMenu.style.display = 'block';
                mobileMenu.style.transform = 'scaleY(1)';
                mobileMenu.style.height = 'auto';
                menuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
            } else {
                mobileMenu.style.transform = 'scaleY(0)';
                mobileMenu.style.height = '0';
                menuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            }
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                mobileMenu.style.transform = 'scaleY(0)';
                mobileMenu.style.height = '0';
                menuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            });
        });
    }

    // ================================
    // SMOOTH SCROLLING
    // ================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ================================
    // BACK TO TOP BUTTON
    // ================================

    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    // ================================
    // NAVIGATION SCROLL EFFECT
    // ================================

    const nav = document.getElementById('main-nav');
    let lastScroll = 0;

    if (nav) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.style.background = 'var(--glass-bg-strong)';
                nav.style.backdropFilter = 'blur(16px)';
                nav.style.boxShadow = 'var(--shadow-md)';
            } else {
                nav.style.background = 'transparent';
                nav.style.backdropFilter = 'none';
                nav.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }

    // ================================
    // FADE IN ON SCROLL
    // ================================

    const fadeElements = document.querySelectorAll('.fade-in:not(.initialized)');

    if (!prefersReducedMotion) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('initialized');
                    entry.target.style.animationPlayState = 'running';
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(element => {
            element.style.animationPlayState = 'paused';
            fadeObserver.observe(element);
        });
    } else {
        // Show all elements immediately without animation
        fadeElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.animation = 'none';
        });
    }

    // ================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ================================

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();

    // ================================
    // LAZY LOAD SCRIPTS
    // ================================

    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        if (callback) {
            script.onload = callback;
        }
        document.body.appendChild(script);
    }

    // Lazy load Three.js and the scene
    if (document.getElementById('hero-3d-canvas')) {
        // Check if Three.js is already loaded
        if (typeof THREE === 'undefined') {
            loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
                // Three.js scene will initialize automatically
            });
        }
    }

    // ================================
    // PROJECT CARD EXPANSION
    // ================================

    document.querySelectorAll('.project-card').forEach(card => {
        const expandBtn = card.querySelector('.expand-btn');
        const details = card.querySelector('.project-card-details');

        if (expandBtn && details) {
            expandBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                card.classList.toggle('expanded');

                if (card.classList.contains('expanded')) {
                    expandBtn.style.transform = 'rotate(180deg)';
                } else {
                    expandBtn.style.transform = 'rotate(0deg)';
                }
            });
        }
    });

    // ================================
    // SKILL NODES KEYBOARD SUPPORT
    // ================================

    document.querySelectorAll('.skill-node').forEach(node => {
        node.setAttribute('tabindex', '0');
        node.setAttribute('role', 'button');

        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                node.click();
            }
        });
    });

    // ================================
    // CONSOLE EASTER EGG
    // ================================

    console.log('%c👋 Hello, fellow developer!', 'font-size: 16px; font-weight: bold; color: #0066FF;');
    console.log('%cInterested in the code? Check out my GitHub!', 'font-size: 12px; color: #4A4A68;');
    console.log('%chttps://github.com/ajithkalidasan', 'font-size: 12px; color: #0066FF;');
});
