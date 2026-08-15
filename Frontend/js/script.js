// ================================
// Cyber Shield Landing Page
// ================================

const menuBtn = document.getElementById("menuBtn");

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        const navLinks = document.querySelector(".nav-links");

        if (!navLinks) return;

        navLinks.classList.toggle("mobile-open");

    });

}


// ================================
// Navbar Scroll Effect
// ================================

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.style.background =
            "rgba(3, 7, 13, 0.92)";

    } else {

        navbar.style.background =
            "rgba(3, 7, 13, 0.7)";

    }

});


// ================================
// Reveal Animation
// ================================

const revealElements =
    document.querySelectorAll(
        ".feature-card, .step, .stat-card, .security-banner"
    );

const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach((element) => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition = "opacity 0.7s ease, transform 0.7s ease";

    observer.observe(element);

});