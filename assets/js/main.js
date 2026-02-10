gsap.registerPlugin(ScrollTrigger);

// Horizontal Scroll for Testimonials
document.addEventListener('DOMContentLoaded', function () {
    var horizontalSections = gsap.utils.toArray(".horiz-gallery-wrapper");

    horizontalSections.forEach(function (sec) {
        var pinWrap = sec.querySelector(".horiz-gallery-strip");
        if (!pinWrap) return;

        var pinWrapWidth;
        var horizontalScrollLength;

        function refresh() {
            pinWrapWidth = pinWrap.scrollWidth;
            horizontalScrollLength = pinWrapWidth - window.innerWidth + 100;
        }

        refresh();

        gsap.to(pinWrap, {
            scrollTrigger: {
                scrub: true,
                trigger: sec,
                pin: sec,
                start: "center center",
                end: function () { return "+=" + pinWrapWidth; },
                invalidateOnRefresh: true,
            },
            x: function () { return -horizontalScrollLength; },
            ease: "none"
        });

        ScrollTrigger.addEventListener("refreshInit", refresh);
    });
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', function () {
    var heroTitle = document.querySelector('#hero-title');
    var heroSection = document.querySelector('#hero-section');

    if (!heroTitle || !heroSection) return;

    var originalText = heroTitle.textContent || "Forward Deployed Engineer";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    function scramble(element, newText) {
        gsap.to({}, {
            duration: 2,
            onUpdate: function () {
                var progress = this.progress();
                var revealIndex = Math.floor(newText.length * progress);

                element.textContent = newText
                    .split("")
                    .map(function (_, index) {
                        if (index < revealIndex) {
                            return newText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
            },
            onComplete: function () {
                element.textContent = newText;
            },
            ease: "none"
        });
    }

    ScrollTrigger.create({
        trigger: heroSection,
        start: "top center",
        onEnter: function () { scramble(heroTitle, originalText); },
        onEnterBack: function () { scramble(heroTitle, originalText); },
    });

    gsap.from("#hero-section > div", {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Scroll to Top Logic
    var scrollTopBtn = document.getElementById('scroll-to-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.remove('opacity-0', 'translate-y-10', 'invisible');
                scrollTopBtn.classList.add('opacity-100', 'translate-y-0', 'visible');
            } else {
                scrollTopBtn.classList.add('opacity-0', 'translate-y-10', 'invisible');
                scrollTopBtn.classList.remove('opacity-100', 'translate-y-0', 'visible');
            }
        });

        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
