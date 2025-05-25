// Main JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    // Typewriter Effect for Developer Roles
    const typewriterElement = document.getElementById('typewriter');
    const roles = ['Backend Developer (Python)', 'Django & Odoo Expert'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // ms
    let pauseDuration = 2000; // ms to pause before starting to delete
    let currentTimeout;

    function typeWriter() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Delete character
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Type character
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal speed when typing
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            typingSpeed = pauseDuration;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }

        currentTimeout = setTimeout(typeWriter, typingSpeed);
    }

    // Start the typewriter effect if the element exists
    if (typewriterElement) {
        // Initial delay before starting
        setTimeout(typeWriter, 1000);
    }
    
    // Clean up timeouts when the page is unloaded
    window.addEventListener('beforeunload', () => {
        if (currentTimeout) clearTimeout(currentTimeout);
    });
    
    // Experience Carousel
    const experiences = [
        {
            text: 'Creative Python Developer with 1+ year of experience in Odoo ERP development. Skilled in building custom modules and streamlining business workflows.',
            icon: 'fas fa-cogs'
        },
        {
            text: 'Passionate about Django development, focusing on crafting scalable backend systems and RESTful APIs for modern web applications.',
            icon: 'fas fa-laptop-code'
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
            <div class="flex items-start">
                <i class="${exp.icon} text-indigo-400 mt-1 mr-3"></i>
                <span>${exp.text}</span>
            </div>
        `;
        expElement.classList.add('opacity-0');
        setTimeout(() => {
            expElement.classList.remove('opacity-0');
            expElement.classList.add('opacity-100');
        }, 10);
    }
    
    function changeExperience(direction) {
        expElement.classList.remove('opacity-100');
        expElement.classList.add('opacity-0');
        
        setTimeout(() => {
            currentExpIndex = (currentExpIndex + direction + experiences.length) % experiences.length;
            updateExperience();
            // Reset auto-rotate timer
            resetAutoRotate();
        }, 300);
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

    // Initialize experience carousel if elements exist
    if (expElement && prevBtn && nextBtn) {
        updateExperience();
        startAutoRotate();
        
        prevBtn.addEventListener('click', () => changeExperience(-1));
        nextBtn.addEventListener('click', () => changeExperience(1));
        
        // Pause auto-rotate on hover
        expElement.parentElement.addEventListener('mouseenter', () => {
            clearInterval(autoRotateInterval);
        });
        
        expElement.parentElement.addEventListener('mouseleave', () => {
            startAutoRotate();
        });
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('animate-fadeInDown');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide back to top button on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.remove('opacity-100', 'visible');
                backToTopBtn.classList.add('opacity-0', 'invisible');
            }
        });

        // Smooth scroll to top when button is clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Fade in animation for elements with .fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('opacity-100', 'translate-y-0');
            }
        });
    };

    // Run once on page load
    fadeInOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', fadeInOnScroll);
});
