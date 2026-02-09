(function attachFaqModule() {
  const Ello = (window.Ello = window.Ello || {});

  function openFaqItem(item) {
    const button = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");
    if (!button || !answer) {
      return;
    }

    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
    answer.style.maxHeight = `${answer.scrollHeight}px`;
  }

  function closeFaqItem(item) {
    const button = item.querySelector(".faq__question");
    const answer = item.querySelector(".faq__answer");
    if (!button || !answer) {
      return;
    }

    item.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    answer.style.maxHeight = "0px";
  }

  Ello.initFaq = function initFaq() {
    const faqItems = Array.from(document.querySelectorAll("[data-faq-item]"));
    if (!faqItems.length) {
      return;
    }

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    faqItems.forEach((item) => {
      const button = item.querySelector(".faq__question");
      closeFaqItem(item);

      if (!button) {
        return;
      }

      if (canHover) {
        item.addEventListener("mouseenter", () => {
          openFaqItem(item);
        });

        item.addEventListener("mouseleave", () => {
          closeFaqItem(item);
        });

        button.addEventListener("focus", () => {
          openFaqItem(item);
        });

        button.addEventListener("blur", () => {
          closeFaqItem(item);
        });
        return;
      }

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        if (isOpen) {
          closeFaqItem(item);
          return;
        }

        faqItems.forEach((faqItem) => closeFaqItem(faqItem));
        openFaqItem(item);
      });
    });

    window.addEventListener("resize", () => {
      faqItems.forEach((item) => {
        if (!item.classList.contains("is-open")) {
          return;
        }

        const answer = item.querySelector(".faq__answer");
        if (!answer) {
          return;
        }

        answer.style.maxHeight = `${answer.scrollHeight}px`;
      });
    });
  };
})();
