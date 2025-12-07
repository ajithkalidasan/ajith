/**
 * Three.js Scene - Interactive 3D Monogram
 * Portfolio: Ajith K - Python Developer
 * 
 * Features:
 * - 3D geometric monogram (AK) that reacts to cursor
 * - Spring-based physics for smooth motion
 * - Parallax depth effect
 * - Reduced motion support
 * - Lazy initialization
 */

(function () {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Configuration
    const CONFIG = {
        container: 'hero-3d-canvas',
        enableMouse: !prefersReducedMotion,
        enableFloat: !prefersReducedMotion,
        spring: {
            stiffness: 0.03,
            damping: 0.92
        },
        rotationLimit: prefersReducedMotion ? 0 : 0.25, // radians
        floatAmplitude: prefersReducedMotion ? 0 : 0.15,
        floatSpeed: 0.001
    };

    // State
    let scene, camera, renderer, monogram;
    let targetRotationX = 0, targetRotationY = 0;
    let currentRotationX = 0, currentRotationY = 0;
    let mouseX = 0, mouseY = 0;
    let animationFrame;
    let isInitialized = false;

    /**
     * Initialize the Three.js scene
     */
    function init() {
        const container = document.getElementById(CONFIG.container);
        if (!container) {
            console.warn('Three.js container not found');
            return;
        }

        // Scene setup
        scene = new THREE.Scene();

        // Camera
        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap for performance
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Create monogram
        createMonogram();

        // Lighting
        setupLighting();

        // Event listeners
        if (CONFIG.enableMouse) {
            container.addEventListener('mousemove', onMouseMove);
            container.addEventListener('mouseleave', onMouseLeave);
        }
        window.addEventListener('resize', onWindowResize);

        // Start animation
        isInitialized = true;
        animate();
    }

    /**
     * Create the 3D monogram geometry
     */
    function createMonogram() {
        // Create a group to hold all parts
        monogram = new THREE.Group();

        // Material with gradient-like appearance
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x0066FF,
            metalness: 0.1,
            roughness: 0.3,
            clearcoat: 0.8,
            clearcoatRoughness: 0.2,
            envMapIntensity: 1.5
        });

        const materialSecondary = new THREE.MeshPhysicalMaterial({
            color: 0x6366F1,
            metalness: 0.15,
            roughness: 0.25,
            clearcoat: 0.6,
            clearcoatRoughness: 0.3
        });

        // Create geometric shapes for "AK" monogram
        // Using low-poly approach for performance

        // Central octahedron (core)
        const coreGeometry = new THREE.OctahedronGeometry(0.8, 0);
        const core = new THREE.Mesh(coreGeometry, material);
        core.name = 'core';
        monogram.add(core);

        // Orbiting smaller shapes
        const orbitGeometry = new THREE.TetrahedronGeometry(0.25, 0);

        const orbit1 = new THREE.Mesh(orbitGeometry, materialSecondary);
        orbit1.position.set(1.2, 0.5, 0);
        orbit1.name = 'orbit1';
        monogram.add(orbit1);

        const orbit2 = new THREE.Mesh(orbitGeometry, materialSecondary);
        orbit2.position.set(-1.0, -0.6, 0.3);
        orbit2.name = 'orbit2';
        monogram.add(orbit2);

        const orbit3 = new THREE.Mesh(orbitGeometry, materialSecondary);
        orbit3.position.set(0.3, -0.9, -0.5);
        orbit3.name = 'orbit3';
        monogram.add(orbit3);

        // Ring around core
        const ringGeometry = new THREE.TorusGeometry(1.1, 0.04, 8, 32);
        const ring = new THREE.Mesh(ringGeometry, materialSecondary);
        ring.rotation.x = Math.PI / 2;
        ring.name = 'ring';
        monogram.add(ring);

        // Add wireframe overlay for depth
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0066FF,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const coreWireframe = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.82, 0),
            wireframeMaterial
        );
        monogram.add(coreWireframe);

        scene.add(monogram);
    }

    /**
     * Setup scene lighting
     */
    function setupLighting() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);

        // Key light (front-top-right)
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
        keyLight.position.set(3, 4, 5);
        scene.add(keyLight);

        // Fill light (front-left)
        const fillLight = new THREE.DirectionalLight(0x6366F1, 0.4);
        fillLight.position.set(-3, 2, 3);
        scene.add(fillLight);

        // Rim light (back)
        const rimLight = new THREE.DirectionalLight(0x0066FF, 0.5);
        rimLight.position.set(0, -2, -5);
        scene.add(rimLight);
    }

    /**
     * Handle mouse movement - cursor tracking
     */
    function onMouseMove(event) {
        const container = document.getElementById(CONFIG.container);
        const rect = container.getBoundingClientRect();

        // Normalize to -1 to 1
        mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

        // Set target rotation based on mouse position
        targetRotationY = mouseX * CONFIG.rotationLimit;
        targetRotationX = -mouseY * CONFIG.rotationLimit;
    }

    /**
     * Reset rotation when mouse leaves
     */
    function onMouseLeave() {
        targetRotationX = 0;
        targetRotationY = 0;
    }

    /**
     * Handle window resize
     */
    function onWindowResize() {
        const container = document.getElementById(CONFIG.container);
        if (!container || !camera || !renderer) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    /**
     * Animation loop with spring physics
     */
    function animate() {
        animationFrame = requestAnimationFrame(animate);

        if (!monogram) return;

        // Spring physics for smooth following
        const dx = targetRotationX - currentRotationX;
        const dy = targetRotationY - currentRotationY;

        currentRotationX += dx * CONFIG.spring.stiffness;
        currentRotationY += dy * CONFIG.spring.stiffness;

        currentRotationX *= CONFIG.spring.damping;
        currentRotationY *= CONFIG.spring.damping;

        // Apply rotation to monogram
        monogram.rotation.x = currentRotationX;
        monogram.rotation.y = currentRotationY;

        // Continuous slow rotation (if motion enabled)
        if (CONFIG.enableFloat) {
            const time = Date.now() * CONFIG.floatSpeed;

            // Gentle float effect
            monogram.position.y = Math.sin(time) * CONFIG.floatAmplitude;

            // Rotate child elements differently for visual interest
            const core = monogram.getObjectByName('core');
            if (core) {
                core.rotation.y += 0.002;
                core.rotation.x += 0.001;
            }

            const ring = monogram.getObjectByName('ring');
            if (ring) {
                ring.rotation.z += 0.003;
            }

            // Orbit elements
            ['orbit1', 'orbit2', 'orbit3'].forEach((name, i) => {
                const orbit = monogram.getObjectByName(name);
                if (orbit) {
                    const orbitTime = time + i * 2;
                    orbit.position.y += Math.sin(orbitTime * 1.5) * 0.001;
                    orbit.rotation.x += 0.01;
                    orbit.rotation.y += 0.008;
                }
            });
        }

        renderer.render(scene, camera);
    }

    /**
     * Cleanup function
     */
    function dispose() {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        const container = document.getElementById(CONFIG.container);
        if (container && renderer) {
            container.removeChild(renderer.domElement);
        }

        if (renderer) {
            renderer.dispose();
        }

        window.removeEventListener('resize', onWindowResize);

        isInitialized = false;
    }

    /**
     * Lazy initialization - wait for Three.js to load
     */
    function lazyInit() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded yet, retrying...');
            setTimeout(lazyInit, 100);
            return;
        }

        // Check if container exists
        const container = document.getElementById(CONFIG.container);
        if (!container) {
            // Container might not exist yet, use MutationObserver
            const observer = new MutationObserver((mutations, obs) => {
                if (document.getElementById(CONFIG.container)) {
                    obs.disconnect();
                    init();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            return;
        }

        init();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', lazyInit);
    } else {
        lazyInit();
    }

    // Expose for debugging
    window.ThreeScene = {
        init,
        dispose,
        isInitialized: () => isInitialized
    };

})();
