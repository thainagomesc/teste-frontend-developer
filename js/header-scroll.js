(function attachHeaderScrollModule() {
  const Ello = (window.Ello = window.Ello || {});

  Ello.initHeaderScroll = function initHeaderScroll() {
    const header = document.querySelector("[data-header]");
    if (!header) {
      return;
    }

    let lastY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      header.classList.toggle("header--scrolled", currentY > 18);

      if (currentY <= 80) {
        header.classList.remove("header--hidden");
      } else if (delta > 2) {
        header.classList.add("header--hidden");
      } else if (delta < -2) {
        header.classList.remove("header--hidden");
      }

      lastY = currentY < 0 ? 0 : currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateHeader();
  };
})();
