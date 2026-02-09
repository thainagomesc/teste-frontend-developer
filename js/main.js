(function attachMainModule() {
  const Ello = (window.Ello = window.Ello || {});

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 13;
  }

  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const submitMode = form.dataset.submitMode || "frontend";
    const status = form.querySelector("[data-form-status]");
    const submitButton = form.querySelector(".contact__submit");
    const fields = Array.from(form.querySelectorAll(".contact__input"));

    const setStatus = (message, type = "") => {
      if (!status) {
        return;
      }

      status.textContent = message;
      status.classList.remove("is-error", "is-success");

      if (type) {
        status.classList.add(type);
      }
    };

    const markInvalid = (field, isInvalid) => {
      field.classList.toggle("is-invalid", isInvalid);
    };

    const resetSubmitButton = () => {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar mensagem";
      }
    };

    const lockSubmitButton = () => {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
      }
    };

    const fallbackToLocalStorage = (payload) => {
      try {
        const storageKey = "lead_form_queue";
        const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const next = Array.isArray(existing) ? existing : [];

        next.push({
          ...payload,
          savedAt: new Date().toISOString()
        });

        localStorage.setItem(storageKey, JSON.stringify(next));
        console.warn("Backend indisponível. Lead salvo em localStorage (fallback).");
      } catch (error) {
        console.error("Falha ao salvar fallback local:", error);
      }
    };

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        markInvalid(field, false);
        if (status && status.textContent) {
          setStatus("");
        }
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const nameField = form.elements.namedItem("name");
      const emailField = form.elements.namedItem("email");
      const phoneField = form.elements.namedItem("phone");
      const messageField = form.elements.namedItem("message");

      if (
        !(nameField instanceof HTMLInputElement) ||
        !(emailField instanceof HTMLInputElement) ||
        !(phoneField instanceof HTMLInputElement) ||
        !(messageField instanceof HTMLTextAreaElement)
      ) {
        setStatus("Falha ao validar o formulário. Verifique os campos.", "is-error");
        return;
      }

      const name = nameField.value.trim();
      const email = emailField.value.trim();
      const phone = phoneField.value.trim();
      const message = messageField.value.trim();

      const checks = [
        { field: nameField, valid: name.length >= 3 },
        { field: emailField, valid: validateEmail(email) },
        { field: phoneField, valid: validatePhone(phone) },
        { field: messageField, valid: message.length >= 12 }
      ];

      checks.forEach(({ field, valid }) => {
        markInvalid(field, !valid);
      });

      const hasInvalid = checks.some(({ valid }) => !valid);
      if (hasInvalid) {
        setStatus("Preencha os campos corretamente para enviar.", "is-error");
        return;
      }

      lockSubmitButton();

      if (submitMode === "backend") {
        const payload = { name, email, phone, message };

        try {
          const response = await fetch("server/save_lead.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(payload)
          });

          const responseJson = await response.json().catch(() => null);

          if (!response.ok || !responseJson || responseJson.ok !== true) {
            throw new Error(responseJson && responseJson.error ? responseJson.error : "Falha ao enviar para o servidor.");
          }

          form.reset();
          fields.forEach((field) => markInvalid(field, false));
          setStatus("Mensagem enviada com sucesso. Em breve entraremos em contato.", "is-success");
          return;
        } catch (error) {
          console.error("Erro ao enviar lead para backend:", error);
          fallbackToLocalStorage(payload);
          setStatus("Não foi possível conectar ao servidor. Salvamos seus dados localmente e tentaremos novamente.", "is-error");
          return;
        } finally {
          resetSubmitButton();
        }
      }

      window.setTimeout(() => {
        form.reset();
        fields.forEach((field) => markInvalid(field, false));
        setStatus("Mensagem enviada com sucesso. Em breve entraremos em contato.", "is-success");
        resetSubmitButton();
      }, 800);
    });
  }

  Ello.initMain = function initMain() {
    if (typeof Ello.initHeaderScroll === "function") {
      Ello.initHeaderScroll();
    }

    if (typeof Ello.initScrollAnimations === "function") {
      Ello.initScrollAnimations();
    }

    if (typeof Ello.initHeroAnimation === "function") {
      Ello.initHeroAnimation();
    }

    if (typeof Ello.initCursor === "function") {
      Ello.initCursor();
    }

    if (typeof Ello.initFaq === "function") {
      Ello.initFaq();
    }

    if (typeof Ello.initTime === "function") {
      Ello.initTime();
    }

    initContactForm();

    window.requestAnimationFrame(() => {
      document.body.classList.add("is-loaded");
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    Ello.initMain();
  });
})();
