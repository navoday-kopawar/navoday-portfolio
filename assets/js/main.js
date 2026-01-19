(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    /* ======================================================
       LOTTIE INITIALIZATION (WITH FALLBACK)
    ====================================================== */

    const lottieElements = document.querySelectorAll("[data-lottie]");

    lottieElements.forEach((container) => {
      const animationPath = container.getAttribute("data-lottie");
      const fallbackImage = container.getAttribute("data-fallback");

      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.justifyContent = "center";

      if (window.lottie) {
        try {
          const animation = lottie.loadAnimation({
            container: container,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: animationPath,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid meet",
            },
          });

          animation.setSubframe(false);

          animation.addEventListener("data_failed", () => {
            container.innerHTML = `<img src="${fallbackImage}" alt="Logo">`;
          });
        } catch {
          container.innerHTML = `<img src="${fallbackImage}" alt="Logo">`;
        }
      } else {
        container.innerHTML = `<img src="${fallbackImage}" alt="Logo">`;
      }
    });

    /* ======================================================
       DYNAMIC COMPONENT LOADING
    ====================================================== */

    fetch("./assets/components/portfolio-card.html")
      .then((res) => res.text())
      .then((html) => {
        const container = document.getElementById("portfolio-card-container");
        if (container) container.innerHTML = html;
      })
      .catch((err) => console.error("Portfolio card failed to load", err));

    /* ======================================================
       ELEMENT REFERENCES
    ====================================================== */

    const mobileMenu = document.getElementById("mobileMenu");
    const mobileToggle = document.getElementById("mobileToggle");

    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeToggleMobileBtn = document.getElementById("theme-toggle-mobile");

    const themeToggleDarkIcon = document.getElementById(
      "theme-toggle-dark-icon",
    );
    const themeToggleLightIcon = document.getElementById(
      "theme-toggle-light-icon",
    );
    const themeToggleMobileDarkIcon = document.getElementById(
      "theme-toggle-mobile-dark-icon",
    );
    const themeToggleMobileLightIcon = document.getElementById(
      "theme-toggle-mobile-light-icon",
    );

    const contactForm = document.getElementById("contactForm");
    const contactSubmit = document.getElementById("contactSubmit");

    /* ======================================================
       MOBILE MENU HANDLING
    ====================================================== */

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", () => {
        const hidden = mobileMenu.classList.toggle("hidden");
        mobileMenu.setAttribute("aria-hidden", hidden.toString());
        mobileToggle.setAttribute("aria-expanded", (!hidden).toString());
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
          mobileMenu.setAttribute("aria-hidden", "true");
          mobileToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* ======================================================
       SMOOTH SCROLLING
    ====================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
          mobileMenu.setAttribute("aria-hidden", "true");
          mobileToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    /* ======================================================
       FADE-IN ANIMATION (INTERSECTION OBSERVER)
    ====================================================== */

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".fade-in").forEach((el) => {
        el.classList.add("visible");
      });
    } else {
      const fadeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              fadeObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );

      document.querySelectorAll(".fade-in").forEach((el) => {
        fadeObserver.observe(el);
      });
    }

    /* ======================================================
       SKILL BAR ANIMATION
    ====================================================== */

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".skill-bar").forEach((bar) => {
        bar.style.width = bar.dataset.percent + "%";
      });
    } else {
      const skillObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const percent = bar.dataset.percent;
              if (percent) {
                bar.style.width = percent + "%";
                bar.setAttribute("aria-valuenow", percent);
              }
              observer.unobserve(bar);
            }
          });
        },
        { threshold: 0.3 },
      );

      document.querySelectorAll(".skill-bar").forEach((bar) => {
        bar.style.width = "0%";
        skillObserver.observe(bar);
      });
    }

    /* ======================================================
       ACTIVE NAVIGATION LINK
    ====================================================== */

    const navLinks = document.querySelectorAll(".nav-link");
    const sections = [...document.querySelectorAll("section[id]")];

    function updateActiveNav() {
      const headerOffset = 120;
      let closestSection = null;
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top - headerOffset);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = section.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          closestSection && link.getAttribute("href") === `#${closestSection}`,
        );
      });
    }

    let navTicking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (!navTicking) {
          requestAnimationFrame(() => {
            updateActiveNav();
            navTicking = false;
          });
          navTicking = true;
        }
      },
      { passive: true },
    );

    window.addEventListener("resize", updateActiveNav);
    updateActiveNav();

    /* ======================================================
       THEME HANDLING
    ====================================================== */

    function setThemeIcons(isDark) {
      themeToggleDarkIcon?.classList.toggle("hidden", isDark);
      themeToggleLightIcon?.classList.toggle("hidden", !isDark);
      themeToggleMobileDarkIcon?.classList.toggle("hidden", isDark);
      themeToggleMobileLightIcon?.classList.toggle("hidden", !isDark);
    }

    function applyInitialTheme() {
      const isDark = document.documentElement.classList.contains("dark");
      setThemeIcons(isDark);
    }

    function toggleTheme() {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("color-theme", isDark ? "dark" : "light");
      setThemeIcons(isDark);
    }

    applyInitialTheme();
    themeToggleBtn?.addEventListener("click", toggleTheme);
    themeToggleMobileBtn?.addEventListener("click", toggleTheme);

    /* ======================================================
       CONTACT FORM
    ====================================================== */

    if (contactForm && contactSubmit) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
          contactForm.reportValidity();
          return;
        }

        contactSubmit.disabled = true;
        contactSubmit.textContent = "Sending...";

        const formData = {
          name: contactForm.name.value,
          email: contactForm.email.value,
          message: contactForm.message.value,
        };

        // Send message ONLY to you
        emailjs
          .send("service_pzxcmxq", "template_xihd8fo", formData)
          .then(() => {
            contactSubmit.textContent = "Sent!";
            contactForm.reset();

            const toast = document.createElement("div");
            toast.className = "toast";
            toast.textContent = "Message sent successfully!";
            document.body.appendChild(toast);

            setTimeout(() => {
              toast.remove();
              contactSubmit.disabled = false;
              contactSubmit.textContent = "Send Message";
            }, 2500);
          })
          .catch((error) => {
            console.error("EmailJS error:", error);

            contactSubmit.disabled = false;
            contactSubmit.textContent = "Send Message";

            const toast = document.createElement("div");
            toast.className = "toast";
            toast.textContent = "Failed to send message. Try again.";
            document.body.appendChild(toast);

            setTimeout(() => toast.remove(), 3000);
          });
      });
    }
  });
})();
