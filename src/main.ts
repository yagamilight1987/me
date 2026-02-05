import './style.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);


// Horizontal Scroll for Testimonials
document.addEventListener('DOMContentLoaded', () => {
    const horizontalSections = gsap.utils.toArray(".horiz-gallery-wrapper");

    horizontalSections.forEach((sec: any) => {
        const pinWrap = sec.querySelector(".horiz-gallery-strip");
        if (!pinWrap) return;

        let pinWrapWidth: number;
        let horizontalScrollLength: number;

        function refresh() {
            pinWrapWidth = pinWrap.scrollWidth;
            horizontalScrollLength = pinWrapWidth - window.innerWidth + 100; // Adding buffer
        }

        refresh();

        // Pinning and horizontal scrolling
        gsap.to(pinWrap, {
            scrollTrigger: {
                scrub: true,
                trigger: sec,
                pin: sec,
                start: "center center",
                end: () => `+=${pinWrapWidth}`,
                invalidateOnRefresh: true,
            },
            x: () => -horizontalScrollLength,
            ease: "none"
        });

        ScrollTrigger.addEventListener("refreshInit", refresh);
    });
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('#hero-title');
    const heroSection = document.querySelector('#hero-section');

    if (!heroTitle || !heroSection) return;

    const originalText = heroTitle.textContent || "Forward Deployed Engineer";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    // Since ScrambleTextPlugin is a Club GreenSock plugin, we'll implement a 
    // lightweight custom version that works with standard GSAP for reliability.
    function scramble(element: Element, newText: string) {
        const duration = 2; // seconds

        gsap.to({}, {
            duration: duration,
            onUpdate: function () {
                const progress = this.progress();
                const revealIndex = Math.floor(newText.length * progress);

                element.textContent = newText
                    .split("")
                    .map((_, index) => {
                        if (index < revealIndex) {
                            return newText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
            },
            onComplete: () => {
                element.textContent = newText;
            },
            ease: "none"
        });
    }

    // Trigger animation when hero section is entered
    ScrollTrigger.create({
        trigger: heroSection,
        start: "top center",
        onEnter: () => scramble(heroTitle, originalText),
        onEnterBack: () => scramble(heroTitle, originalText),
    });

    // Initial load animation
    gsap.from("#hero-section > div", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Scroll to Top Logic
    const scrollTopBtn = document.getElementById('scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.remove('opacity-0', 'translate-y-10', 'invisible');
                scrollTopBtn.classList.add('opacity-100', 'translate-y-0', 'visible');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'translate-y-10', 'invisible');
                scrollTopBtn.classList.remove('opacity-100', 'translate-y-0', 'visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
