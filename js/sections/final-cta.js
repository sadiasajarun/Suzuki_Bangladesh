/* ============================================================
   SECTION 12 — Final CTA newsletter form
   ============================================================
   Light-weight client-side handling:
     - Validate email format
     - Show inline feedback (no alert/redirect)
     - Reset on success
   No real backend call — this is the prototype. The form would
   POST to /api/newsletter on the live site.
   ============================================================ */

(() => {
  const form = document.querySelector('[data-testid="final-cta-form"]');
  if (!form) return;

  const input = form.querySelector('.fc-input');
  const feedback = document.querySelector('[data-testid="final-cta-feedback"]');
  if (!input || !feedback) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();

    if (!value) {
      feedback.textContent = 'Please enter your email.';
      feedback.dataset.state = 'error';
      input.focus();
      return;
    }
    if (!EMAIL_RE.test(value)) {
      feedback.textContent = 'That email looks off — try again.';
      feedback.dataset.state = 'error';
      input.focus();
      return;
    }

    // Mock success — on the live site this is where the API call happens
    feedback.textContent = "You're on the list. See you in the inbox.";
    feedback.dataset.state = 'success';
    input.value = '';
    input.blur();
  });

  // Clear any prior feedback as soon as the user types again
  input.addEventListener('input', () => {
    if (feedback.dataset.state) {
      feedback.textContent = '';
      delete feedback.dataset.state;
    }
  });
})();
