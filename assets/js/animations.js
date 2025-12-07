/**
 * GSAP Animations - Physics-based Motion
 * Portfolio: Ajith K - Python Developer
 * 
 * Features:
 * - Spring/inertia animations for UI elements
 * - Scroll-triggered animations
 * - Project card expansion
 * - Mouse cursor lag effects
 * - Reduced motion support
 */

(function () {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = prefersReducedMotion.matches;

    // Listen for changes
    prefersReducedMotion.addEventListener('change', (e) => {
        reducedMotion = e.matches;
        if (reducedMotion) {
            killAllAnimations();
        }
    });

    // GSAP spring configuration
    const SPRING = {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 1
    };

    const SPRING_SOFT = {
        type: 'spring',
        stiffness: 150,
        damping: 20,
        mass: 1
    };

    /**
     * Initialize all animations
     */
    function init() {
        if (!window.gsap) {
            console.warn('GSAP not loaded');
            return;
        }

        // Register plugins
        if (gsap.registerPlugin && ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Set GSAP defaults
        gsap.defaults({
            ease: 'power3.out',
            duration: reducedMotion ? 0 : 0.6
        });

        // Initialize animations only if motion is allowed
        if (!reducedMotion) {
            initScrollAnimations();
            initHoverAnimations();
            initProjectCards();
            initSkillNodes();
            initParallax();
            initCursorFollow();
        } else {
            // Show all elements immediately
            gsap.set('.fade-in', { opacity: 1, y: 0 });
        }
    }

    /**
     * Scroll-triggered fade-in animations
     */
    function initScrollAnimations() {
        // Fade in sections on scroll
        gsap.utils.toArray('.fade-in').forEach((element, i) => {
            gsap.fromTo(element,
                {
                    opacity: 0,
                    y: 40
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    delay: i * 0.05
                }
            );
        });

        // Stagger animation for grid items
        gsap.utils.toArray('.stagger-grid').forEach(grid => {
            const items = grid.querySelectorAll('.stagger-item');
            gsap.fromTo(items,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.2)',
                    scrollTrigger: {
                        trigger: grid,
                        start: 'top 80%'
                    }
                }
            );
        });

        // Skill bars animation
        gsap.utils.toArray('.skill-progress').forEach(bar => {
            const width = bar.style.width;
            gsap.fromTo(bar,
                { width: '0%' },
                {
                    width: width,
                    duration: 1.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 90%'
                    }
                }
            );
        });

        // Section titles
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.fromTo(title,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: title,
                        start: 'top 85%'
                    }
                }
            );
        });
    }

    /**
     * Hover animations with spring physics
     */
    function initHoverAnimations() {
        // Glass cards
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -6,
                    scale: 1.01,
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.12)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.06)',
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });

        // Buttons with spring
        document.querySelectorAll('.btn, .btn-primary, .btn-secondary').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    y: -2,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'back.out(2)'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });

        // Tech chips
        document.querySelectorAll('.tech-chip').forEach(chip => {
            chip.addEventListener('mouseenter', () => {
                gsap.to(chip, {
                    y: -3,
                    scale: 1.05,
                    duration: 0.25,
                    ease: 'back.out(3)'
                });
            });

            chip.addEventListener('mouseleave', () => {
                gsap.to(chip, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Project card expansion with spring animation
     */
    function initProjectCards() {
        document.querySelectorAll('.project-card').forEach(card => {
            const details = card.querySelector('.project-card-details');
            const expandBtn = card.querySelector('.expand-btn');
            let isExpanded = false;

            if (!details) return;

            // Set initial state
            gsap.set(details, { height: 0, opacity: 0 });

            const toggleExpand = () => {
                isExpanded = !isExpanded;
                card.classList.toggle('expanded', isExpanded);

                if (isExpanded) {
                    // Expand with spring
                    gsap.to(details, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.5,
                        ease: 'power3.out',
                        onStart: () => {
                            details.style.overflow = 'hidden';
                        },
                        onComplete: () => {
                            details.style.overflow = 'visible';
                        }
                    });

                    // Animate expand button rotation
                    if (expandBtn) {
                        gsap.to(expandBtn, {
                            rotation: 180,
                            duration: 0.4,
                            ease: 'back.out(1.5)'
                        });
                    }
                } else {
                    // Collapse
                    gsap.to(details, {
                        height: 0,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.inOut'
                    });

                    if (expandBtn) {
                        gsap.to(expandBtn, {
                            rotation: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                }
            };

            // Click to expand
            if (expandBtn) {
                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleExpand();
                });
            }

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand();
                }
            });
        });
    }

    /**
     * Skills map node interactions
     */
    function initSkillNodes() {
        document.querySelectorAll('.skill-node').forEach(node => {
            const tooltip = node.querySelector('.skill-tooltip');

            node.addEventListener('mouseenter', () => {
                gsap.to(node, {
                    y: -8,
                    scale: 1.08,
                    duration: 0.3,
                    ease: 'back.out(2)'
                });

                if (tooltip) {
                    gsap.to(tooltip, {
                        opacity: 1,
                        y: -12,
                        visibility: 'visible',
                        duration: 0.25,
                        ease: 'power2.out'
                    });
                }
            });

            node.addEventListener('mouseleave', () => {
                gsap.to(node, {
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.5)'
                });

                if (tooltip) {
                    gsap.to(tooltip, {
                        opacity: 0,
                        y: -8,
                        duration: 0.2,
                        ease: 'power2.in',
                        onComplete: () => {
                            tooltip.style.visibility = 'hidden';
                        }
                    });
                }
            });

            // Focus states for accessibility
            node.addEventListener('focus', () => {
                gsap.to(node, {
                    y: -6,
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            node.addEventListener('blur', () => {
                gsap.to(node, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Parallax effects on scroll
     */
    function initParallax() {
        // Background blobs
        gsap.utils.toArray('.bg-blob').forEach((blob, i) => {
            const speed = 0.2 + (i * 0.1);
            gsap.to(blob, {
                y: () => window.innerHeight * speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1
                }
            });
        });

        // Hero 3D container subtle parallax
        const hero3d = document.querySelector('.hero-3d-container');
        if (hero3d) {
            gsap.to(hero3d, {
                y: 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#home',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    }

    /**
     * Custom cursor with lag effect
     */
    function initCursorFollow() {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow animation
        gsap.ticker.add(() => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.15;
            cursorY += dy * 0.15;

            gsap.set(cursor, {
                x: cursorX,
                y: cursorY
            });
        });

        // Cursor states
        document.querySelectorAll('a, button, .interactive').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 1.5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    /**
     * Hero section entrance animation
     */
    function animateHeroEntrance() {
        if (reducedMotion) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo('.hero-badge',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 }
        )
            .fromTo('.hero-title',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8 },
                '-=0.3'
            )
            .fromTo('.hero-tagline',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                '-=0.4'
            )
            .fromTo('.hero-cta',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
                '-=0.3'
            )
            .fromTo('.hero-3d-container',
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
                '-=0.5'
            );
    }

    /**
     * Kill all animations (for reduced motion)
     */
    function killAllAnimations() {
        gsap.killTweensOf('*');
        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }

        // Reset all transforms
        gsap.set('.fade-in, .glass-card, .btn, .tech-chip, .skill-node', {
            clearProps: 'all'
        });
    }

    /**
     * Magnetic button effect
     */
    function initMagneticButtons() {
        document.querySelectorAll('.btn-magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setTimeout(animateHeroEntrance, 100);
        });
    } else {
        init();
        setTimeout(animateHeroEntrance, 100);
    }

    // Expose for external use
    window.Animations = {
        init,
        animateHeroEntrance,
        killAllAnimations
    };

})();
