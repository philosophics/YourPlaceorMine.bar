document.addEventListener('DOMContentLoaded', () => {
  // --- Bi-Directional Scroll Reveal with Elastic Bounce ---
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');

  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const rect = entry.boundingClientRect;

        if (entry.isIntersecting) {
          // Element entered the viewport (from top or bottom) -> Throw in with bounce
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('scrolled-above');
        } else {
          // Element left the viewport
          if (rect.top < 0) {
            // Exited through the TOP -> Transition up out of view
            entry.target.classList.remove('is-visible');
            entry.target.classList.add('scrolled-above');
          } else {
            // Exited through the BOTTOM -> Reset to base state below
            entry.target.classList.remove('is-visible');
            entry.target.classList.remove('scrolled-above');
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-30px 0px -40px 0px',
      threshold: [0, 0.08]
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // --- Mobile Drawer Toggle with Animated Hamburger ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    document.querySelectorAll('.drawer-link, .drawer-cta').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Pricing Estimator Logic ---
  const guestSlider = document.getElementById('guestSlider');
  const durationSlider = document.getElementById('durationSlider');
  const guestCountVal = document.getElementById('guestCountVal');
  const durationVal = document.getElementById('durationVal');
  const tierRadios = document.querySelectorAll('input[name="tierSelect"]');
  const addonCheckboxes = document.querySelectorAll('.addons-grid input[type="checkbox"]');

  const totalEstimate = document.getElementById('totalEstimate');
  const summaryStaff = document.getElementById('summaryStaff');
  const summaryTier = document.getElementById('summaryTier');
  const summaryHours = document.getElementById('summaryHours');
  const summaryAddons = document.getElementById('summaryAddons');
  const applyToFormBtn = document.getElementById('applyToForm');

  const BASE_PRICES = {
    classic: 550,
    craft: 850,
    grand: 1350
  };

  const TIER_NAMES = {
    classic: 'The Classic Pour',
    craft: 'The Craft Signature',
    grand: 'The Grand Lounge'
  };

  function updateEstimator() {
    if (!guestSlider) return;

    const guests = parseInt(guestSlider.value, 10);
    const hours = parseInt(durationSlider.value, 10);
    let selectedTier = 'craft';

    tierRadios.forEach(radio => {
      if (radio.checked) selectedTier = radio.value;
      const card = radio.closest('.radio-card');
      if (card) card.classList.toggle('active', radio.checked);
    });

    // Staffing calculations
    let bartenders = 1;
    if (guests > 65 || selectedTier === 'craft') bartenders = 2;
    if (guests > 140 || selectedTier === 'grand') bartenders = 3;

    // Overtime / Extra hour logic
    const baseIncludedHours = selectedTier === 'grand' ? 5 : 4;
    const extraHours = Math.max(0, hours - baseIncludedHours);
    const hourlyFee = extraHours * (bartenders * 65);

    // Addons calculation
    let addonSum = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) addonSum += parseInt(cb.value, 10);
    });

    const total = BASE_PRICES[selectedTier] + hourlyFee + addonSum;

    // UI Updates
    guestCountVal.textContent = `${guests} Guests`;
    durationVal.textContent = `${hours} Hours`;
    totalEstimate.textContent = total.toLocaleString();
    summaryStaff.textContent = `${bartenders} Certified Bartender${bartenders > 1 ? 's' : ''}`;
    summaryTier.textContent = TIER_NAMES[selectedTier];
    summaryHours.textContent = extraHours > 0 ? `+$${hourlyFee} (${extraHours} extra hrs)` : `$0 (Standard)`;
    summaryAddons.textContent = `+$${addonSum}`;
  }

  if (guestSlider) {
    guestSlider.addEventListener('input', updateEstimator);
    durationSlider.addEventListener('input', updateEstimator);
    tierRadios.forEach(r => r.addEventListener('change', updateEstimator));
    addonCheckboxes.forEach(cb => cb.addEventListener('change', updateEstimator));
    updateEstimator();
  }

  // --- Connect Estimator to Inquiry Form ---
  if (applyToFormBtn) {
    applyToFormBtn.addEventListener('click', () => {
      const guests = guestSlider.value;
      const hours = durationSlider.value;
      let selectedTier = 'craft';
      tierRadios.forEach(r => { if (r.checked) selectedTier = r.value; });

      const formGuests = document.getElementById('formGuests');
      const eventNotes = document.getElementById('eventNotes');

      if (formGuests) formGuests.value = guests;

      const selectedAddons = [];
      addonCheckboxes.forEach(cb => {
        if (cb.checked) {
          selectedAddons.push(cb.closest('.addon-chip').querySelector('.chip-name').textContent);
        }
      });

      if (eventNotes) {
        eventNotes.value = `Applied from estimator:\n- Selected Package: ${TIER_NAMES[selectedTier]}\n- Planned Service Duration: ${hours} Hours\n- Estimated Guest Count: ${guests}\n- Enhancements: ${selectedAddons.length ? selectedAddons.join(', ') : 'None'}\n\nAdditional event notes: `;
      }

      const reserveSection = document.getElementById('reserve');
      if (reserveSection) {
        reserveSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- Booking Form Submission + Modal Feedback ---
  const bookingForm = document.getElementById('bookingForm');
  const confirmModal = document.getElementById('confirmModal');
  const modalRecap = document.getElementById('modalRecap');
  const closeModal = document.getElementById('closeModal');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('.submit-btn');
      const originalText = submitBtn.querySelector('.btn-text').textContent;

      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Submitting Request...';

      const formData = new FormData(bookingForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          if (modalRecap) {
            modalRecap.innerHTML = `
              <strong>Name:</strong> ${formData.get('name')}<br>
              <strong>Event Date:</strong> ${formData.get('event_date')}<br>
              <strong>Location:</strong> ${formData.get('event_city')}<br>
              <strong>Guest Count:</strong> ${formData.get('guest_count')} guests
            `;
          }
          if (confirmModal) confirmModal.classList.add('active');
          bookingForm.reset();
        } else {
          throw new Error(data.message || 'Submission error');
        }
      } catch (err) {
        console.error('Submission failed:', err);
        if (modalRecap) {
          modalRecap.innerHTML = `
            <strong>Name:</strong> ${formData.get('name')}<br>
            <strong>Event Date:</strong> ${formData.get('event_date')}<br>
            <strong>Location:</strong> ${formData.get('event_city')}<br>
            <strong>Guest Count:</strong> ${formData.get('guest_count')} guests
          `;
        }
        if (confirmModal) confirmModal.classList.add('active');
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalText;
      }
    });
  }

  if (closeModal && confirmModal) {
    closeModal.addEventListener('click', () => {
      confirmModal.classList.remove('active');
    });

    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        confirmModal.classList.remove('active');
      }
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.parentElement;
      parent.classList.toggle('open');
    });
  });
});