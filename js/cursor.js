(function attachCursorModule() {
  const Ello = (window.Ello = window.Ello || {});

  Ello.initCursor = function initCursor() {
    const canUseFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cursor = document.querySelector(".cursor");

    if (!cursor || !canUseFinePointer || prefersReducedMotion) {
      return;
    }

    document.body.classList.add("cursor-enabled");

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;
    let currentX = targetX;
    let currentY = targetY;
    let rafId = null;

    const render = () => {
      currentX += (targetX - currentX) * 0.17;
      currentY += (targetY - currentY) * 0.17;

      cursor.style.setProperty("--cursor-x", `${currentX}px`);
      cursor.style.setProperty("--cursor-y", `${currentY}px`);
      rafId = window.requestAnimationFrame(render);
    };

    const setHoverState = (isHovering) => {
      cursor.classList.toggle("is-hover", isHovering);
      cursor.style.setProperty("--cursor-scale", isHovering ? "1.6" : "1");
    };

    const interactiveSelector = "a, button, input, textarea, label, [data-cursor-hover]";
    const interactiveElements = document.querySelectorAll(interactiveSelector);

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setHoverState(true));
      element.addEventListener("mouseleave", () => setHoverState(false));
    });

    window.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("is-active");
    });

    window.addEventListener("mousedown", () => {
      cursor.style.setProperty("--cursor-scale", "1.2");
    });

    window.addEventListener("mouseup", () => {
      cursor.style.setProperty("--cursor-scale", cursor.classList.contains("is-hover") ? "1.6" : "1");
    });

    window.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-active");
    });

    if (!rafId) {
      rafId = window.requestAnimationFrame(render);
    }
  };
})();
