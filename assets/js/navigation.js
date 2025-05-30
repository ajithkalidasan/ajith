document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    // Toggle mobile menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('scale-y-0', 'h-0');
            mobileMenu.classList.add('scale-y-100', 'h-auto', 'py-2');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.remove('scale-y-100', 'h-auto', 'py-2');
            mobileMenu.classList.add('scale-y-0', 'h-0');
            document.body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Smooth scrolling for all links
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

    // Navbar scroll effect
    const nav = document.getElementById('main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove background on scroll
        if (currentScroll > 50) {
            nav.classList.add('bg-gray-900/95', 'backdrop-blur-md', 'py-3', 'shadow-lg');
            nav.classList.remove('py-4');
        } else {
            nav.classList.remove('bg-gray-900/95', 'backdrop-blur-md', 'shadow-lg');
            nav.classList.add('py-4');
        }

        // Hide/show navbar on scroll
        if (currentScroll <= 0) {
            nav.classList.remove('transform', '-translate-y-full');
            return;
        }
        
        if (currentScroll > lastScroll && !isMenuOpen) {
            // Scrolling down
            nav.classList.add('transform', '-translate-y-full');
        } else {
            // Scrolling up
            nav.classList.remove('transform', '-translate-y-full');
        }
        
        lastScroll = currentScroll;
    });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    
    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = '#' + section.getAttribute('id');
            }
        });

        // Update desktop nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-white', 'bg-gradient-to-r', 'from-indigo-500/20', 'to-purple-500/20');
            if (link.getAttribute('href') === current) {
                link.classList.add('text-white', 'bg-gradient-to-r', 'from-indigo-500/20', 'to-purple-500/20');
            }
        });

        // Update mobile nav links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('text-white', 'bg-gray-800/50');
            if (link.getAttribute('href') === current) {
                link.classList.add('text-white', 'bg-gray-800/50');
            }
        });
    }


    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Run once on load
});
