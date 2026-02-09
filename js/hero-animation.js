(function attachHeroAnimationModule() {
  const Ello = (window.Ello = window.Ello || {});

  Ello.initHeroAnimation = function initHeroAnimation() {
    const hero = document.querySelector(".hero");
    const title = document.querySelector("[data-hero-title]");

    if (!hero || !title) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const activateHero = () => {
      hero.classList.add("hero--active");
    };

    // Ativa a entrada/rotação assim que o hero cruza a viewport.
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      activateHero();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            activateHero();
            observer.unobserve(hero);
          });
        },
        {
          threshold: 0.45,
          rootMargin: "0px 0px -10% 0px"
        }
      );

      observer.observe(hero);
    }

    if (prefersReducedMotion) {
      title.style.setProperty("--hero-parallax-y", "0px");
      return;
    }

    // Parallax vertical suave no bloco do título (sem layout thrashing).
    let currentY = 0;
    let targetY = 0;
    let rafId = null;

    const updateParallaxTarget = () => {
      const rect = hero.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const heroCenter = rect.top + rect.height * 0.5;
      const viewportCenter = viewportHeight * 0.5;
      const normalized = (viewportCenter - heroCenter) / viewportHeight;

      targetY = Math.max(-1, Math.min(1, normalized)) * 18;

      if (!rafId) {
        rafId = window.requestAnimationFrame(renderParallax);
      }
    };

    const renderParallax = () => {
      currentY += (targetY - currentY) * 0.12;
      title.style.setProperty("--hero-parallax-y", `${currentY.toFixed(2)}px`);

      if (Math.abs(targetY - currentY) > 0.05) {
        rafId = window.requestAnimationFrame(renderParallax);
        return;
      }

      rafId = null;
    };

    updateParallaxTarget();
    window.addEventListener("scroll", updateParallaxTarget, { passive: true });
    window.addEventListener("resize", updateParallaxTarget);
  };
})();
