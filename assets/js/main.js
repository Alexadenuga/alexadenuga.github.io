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
  const contactForm = document.querySelector(".contact__form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form values
      const formData = {
        name: this.querySelector('input[name="name"]').value.trim(),
        email: this.querySelector('input[name="email"]').value.trim(),
        subject: this.querySelector('input[name="subject"]').value.trim(),
        message: this.querySelector('textarea[name="message"]').value.trim(),
      };

      // Simple validation
      if (!formData.name || !formData.email || !formData.message) {
        alert("Please fill in all required fields");
        return;
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Please enter a valid email address");
        return;
      }

      // Here you would typically send the form data to a server
      console.log("Form submitted:", formData);

      // Show success message
      alert("Thank you for your message! I will get back to you soon.");

      // Reset form
      this.reset();
    });
  }

  // ===== Current Year in Footer =====
  const currentYear = new Date().getFullYear();
  document.getElementById("current-year").textContent = currentYear;
});
