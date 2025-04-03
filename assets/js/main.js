/* ===== Main Functions ===== */
document.addEventListener("DOMContentLoaded", function () {
  // ===== Mobile Menu Toggle =====
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");

  // Show Menu
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
      document.body.style.overflow = "hidden";
    });
  }

  // Hide Menu
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "";
    });
  }

  // Close menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav__link, .footer__link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "";
    });
  });

  // ===== Header Scroll Effect =====
  function scrollHeader() {
    const header = document.getElementById("header");
    if (window.scrollY >= 80) {
      header.classList.add("scroll-header");
    } else {
      header.classList.remove("scroll-header");
    }
  }
  window.addEventListener("scroll", scrollHeader);

  // ===== Scroll Up Button =====
  function scrollUp() {
    const scrollUp = document.getElementById("scroll-up");
    if (window.scrollY >= 560) {
      scrollUp.classList.add("show-scroll");
    } else {
      scrollUp.classList.remove("show-scroll");
    }
  }
  window.addEventListener("scroll", scrollUp);

  // ===== Dark/Light Theme Toggle =====
  const themeButton = document.getElementById("theme-button");
  const darkTheme = "dark-theme";
  const iconTheme = "uil-sun";

  // Check for previously selected theme
  const selectedTheme = localStorage.getItem("selected-theme");
  const selectedIcon = localStorage.getItem("selected-icon");

  // Apply saved theme if exists
  if (selectedTheme) {
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](
      darkTheme
    );
    themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
      iconTheme
    );
  }

  // Toggle theme manually
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    // Save theme preference
    localStorage.setItem(
      "selected-theme",
      document.body.classList.contains(darkTheme) ? "dark" : "light"
    );
    localStorage.setItem(
      "selected-icon",
      themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun"
    );
  });

  // ===== Animated Skill Bars =====
  function animateSkills() {
    const skills = document.querySelectorAll(".skills__percentage");

    skills.forEach((skill) => {
      const skillLevel = skill.parentElement.getAttribute("data-level");
      skill.style.width = skillLevel;
    });
  }

  // Initialize skill animation when skills section is in view
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkills();
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillsSection = document.querySelector(".skills");
  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // ===== Smooth Scrolling =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Calculate position considering fixed header
        const headerHeight = document.getElementById("header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ===== Active Link Highlighting =====
  const sections = document.querySelectorAll("section[id]");

  function activateCurrentSection() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document
          .querySelector(`.nav__menu a[href="#${sectionId}"]`)
          .classList.add("active-link");
        document
          .querySelector(`.footer__link[href="#${sectionId}"]`)
          .classList.add("active-link");
      } else {
        document
          .querySelector(`.nav__menu a[href="#${sectionId}"]`)
          .classList.remove("active-link");
        document
          .querySelector(`.footer__link[href="#${sectionId}"]`)
          .classList.remove("active-link");
      }
    });
  }

  // Run on initial load
  activateCurrentSection();

  // Run on scroll
  window.addEventListener("scroll", activateCurrentSection);

  // ===== Contact Form Handling =====
  // main.js - Complete FormSubmit Implementation
  document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.querySelector(".contact__form");

    if (contactForm) {
      contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Get form elements
        const formElements = this.elements;
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML =
          '<i class="uil uil-spinner uil-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
          // Validate form
          if (
            !formElements.name.value.trim() ||
            !formElements.email.value.trim() ||
            !formElements.message.value.trim()
          ) {
            throw new Error("Please fill in all required fields");
          }

          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formElements.email.value.trim())) {
            throw new Error("Please enter a valid email address");
          }

          // Prepare form data
          const formData = new FormData(this);

          // Send to FormSubmit
          const response = await fetch(this.action, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          });

          // Check response
          if (response.ok) {
            showAlert("Message sent successfully!", "success");
            this.reset();

            // Reset floating labels
            document.querySelectorAll(".contact__label").forEach((label) => {
              label.style.top = "0.75rem";
              label.style.fontSize = "var(--small-font-size)";
            });
          } else {
            throw new Error("Failed to send message");
          }
        } catch (error) {
          console.error("Form submission error:", error);
          showAlert(
            error.message || "Failed to send message. Please try again.",
            "error"
          );
        } finally {
          // Reset button state
          submitButton.innerHTML = originalButtonText;
          submitButton.disabled = false;
        }
      });
    }

    // Alert notification function
    function showAlert(message, type) {
      // Remove any existing alerts first
      const existingAlert = document.querySelector(".form-alert");
      if (existingAlert) existingAlert.remove();

      // Create alert element
      const alertEl = document.createElement("div");
      alertEl.className = `form-alert form-alert-${type}`;
      alertEl.textContent = message;

      // Style the alert (you can customize these)
      alertEl.style.position = "fixed";
      alertEl.style.top = "20px";
      alertEl.style.right = "20px";
      alertEl.style.padding = "12px 24px";
      alertEl.style.borderRadius = "4px";
      alertEl.style.color = "white";
      alertEl.style.backgroundColor = type === "error" ? "#e74c3c" : "#2ecc71";
      alertEl.style.zIndex = "10000";
      alertEl.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      alertEl.style.animation = "alertSlideIn 0.3s ease-out";

      // Add to DOM
      document.body.appendChild(alertEl);

      // Remove after 5 seconds
      setTimeout(() => {
        alertEl.style.animation = "alertSlideOut 0.3s ease-in";
        setTimeout(() => alertEl.remove(), 300);
      }, 5000);
    }

    // Add required CSS animations
    const style = document.createElement("style");
    style.textContent = `
        @keyframes alertSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes alertSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .uil-spin {
            animation: spin 1s linear infinite;
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
  });

  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .uil-spin {
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
  document.head.appendChild(style);

  // ===== Current Year in Footer =====
  const currentYear = new Date().getFullYear();
  document.getElementById("current-year").textContent = currentYear;
});
