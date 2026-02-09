(function attachScrollAnimationsModule() {
  const Ello = (window.Ello = window.Ello || {});

  function initSectionReveal() {
    const targets = document.querySelectorAll("[data-animate]");
    if (!targets.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    targets.forEach((element) => observer.observe(element));
  }

  Ello.initScrollAnimations = function initScrollAnimations() {
    initSectionReveal();
  };
})();
