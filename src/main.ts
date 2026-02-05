import './style.css'

// Carousel Logic
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.testimonial-slide') as NodeListOf<HTMLElement>;
    const dots = document.querySelectorAll('.carousel-dot') as NodeListOf<HTMLElement>;
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const carouselContainer = document.getElementById('testimonials-carousel');

    if (!slides.length || !carouselContainer) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayInterval: number | null = null;
    const intervalTime = 5000;

    function updateSlide(index: number) {
        // Normalize index
        if (index < 0) currentSlide = totalSlides - 1;
        else if (index >= totalSlides) currentSlide = 0;
        else currentSlide = index;

        // Update slides
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.remove('translate-x-full', 'opacity-0');
                slide.classList.add('translate-x-0', 'opacity-100');
                slide.style.zIndex = '10';
            } else {
                slide.classList.remove('translate-x-0', 'opacity-100');
                slide.classList.add('translate-x-full', 'opacity-0');
                slide.style.zIndex = '0';
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.remove('bg-charcoal', 'hover:bg-silver');
                dot.classList.add('bg-blood-red');
            } else {
                dot.classList.add('bg-charcoal', 'hover:bg-silver');
                dot.classList.remove('bg-blood-red');
            }
        });
    }

    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            updateSlide(currentSlide + 1);
        }, intervalTime);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Event Listeners
    prevBtn?.addEventListener('click', () => {
        updateSlide(currentSlide - 1);
        stopAutoplay();
        startAutoplay(); // Reset timer
    });

    nextBtn?.addEventListener('click', () => {
        updateSlide(currentSlide + 1);
        stopAutoplay();
        startAutoplay(); // Reset timer
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    // Pause on hover
    carouselContainer.addEventListener('mouseenter', stopAutoplay);
    carouselContainer.addEventListener('mouseleave', startAutoplay);

    // Initialize
    updateSlide(0);
    startAutoplay();
});