document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector('.experience-timeline');
    const cards = document.querySelectorAll('.experience-card');
    const indicators = document.querySelectorAll('.scroll-indicator');
    const prevBtn = document.querySelector('.scroll-btn.prev');
    const nextBtn = document.querySelector('.scroll-btn.next');
    let isScrolling = false;
    let scrollTimeout;

    // Initialize scroll indicators
    function updateIndicators() {
        if (!timeline) return;
        
        const scrollPosition = timeline.scrollLeft + timeline.offsetWidth / 2;
        const cardWidth = cards[0].offsetWidth + 24; // 24px for gap
        const activeIndex = Math.round(scrollPosition / cardWidth);
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
        
        // Update button states
        if (prevBtn && nextBtn) {
            prevBtn.disabled = timeline.scrollLeft <= 10;
            nextBtn.disabled = timeline.scrollLeft >= timeline.scrollWidth - timeline.offsetWidth - 10;
        }
    }

    // Scroll to specific card
    function scrollToCard(index) {
        if (isScrolling || !timeline) return;
        
        isScrolling = true;
        const card = cards[index];
        if (!card) return;
        
        const containerWidth = timeline.offsetWidth;
        const cardWidth = card.offsetWidth;
        const scrollPosition = card.offsetLeft - (containerWidth - cardWidth) / 2;
        
        timeline.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 500);
    }

    // Initialize
    if (timeline) {
        // Set up scroll event
        timeline.addEventListener('scroll', () => {
            if (!isScrolling) {
                updateIndicators();
            }
        }, { passive: true });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateIndicators, 250);
        });
        
        // Initial update
        updateIndicators();
        
        // Handle indicator clicks
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => scrollToCard(index));
        });
        
        // Handle navigation buttons
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const currentScroll = timeline.scrollLeft;
                const cardWidth = cards[0].offsetWidth + 24;
                const scrollAmount = Math.floor(timeline.offsetWidth / cardWidth) * cardWidth;
                
                timeline.scrollTo({
                    left: Math.max(0, currentScroll - scrollAmount),
                    behavior: 'smooth'
                });
            });
            
            nextBtn.addEventListener('click', () => {
                const currentScroll = timeline.scrollLeft;
                const cardWidth = cards[0].offsetWidth + 24;
                const scrollAmount = Math.floor(timeline.offsetWidth / cardWidth) * cardWidth;
                
                timeline.scrollTo({
                    left: Math.min(
                        timeline.scrollWidth - timeline.offsetWidth,
                        currentScroll + scrollAmount
                    ),
                    behavior: 'smooth'
                });
            });
        }
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'BODY') {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const currentScroll = timeline.scrollLeft;
                    timeline.scrollTo({
                        left: Math.max(0, currentScroll - 300),
                        behavior: 'smooth'
                    });
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const currentScroll = timeline.scrollLeft;
                    timeline.scrollTo({
                        left: Math.min(
                            timeline.scrollWidth - timeline.offsetWidth,
                            currentScroll + 300
                        ),
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    
    // Add touch support for mobile
    if (timeline) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        timeline.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        timeline.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0 && prevBtn && !prevBtn.disabled) {
                    // Swipe right
                    prevBtn.click();
                } else if (nextBtn && !nextBtn.disabled) {
                    // Swipe left
                    nextBtn.click();
                }
            }
        }
    }
});
