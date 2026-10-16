document.addEventListener('DOMContentLoaded', () => {
  // --- Bi-Directional Scroll Reveal with Elastic Bounce ---
  const reveals = document.querySelectorAll('.reveal, .reveal-stagger');

  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const rect = entry.boundingClientRect;

        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.classList.remove('scrolled-above');
        } else {
          if (rect.top < 0) {
            entry.target.classList.remove('is-visible');
            entry.target.classList.add('scrolled-above');
          } else {
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

  // Realistic Dry-Hire Package & Consumable Rates
  // Calibrated so 50 guests @ 4 hours = $550 (Classic), $850 (Craft), $1,350 (Grand)
  const TIER_CONFIG = {
    classic: {
      name: 'The Classic Pour',
      baseFee: 350,
      perGuest: 4,      // Mixers, highball garnishes, ice, cups, napkins
      baseStaff: 1
    },
    craft: {
      name: 'The Craft Signature',
      baseFee: 550,
      perGuest: 6,      // Craft syrups, fresh citrus cordials, aromatics, craft ice
      baseStaff: 2
    },
    grand: {
      name: 'The Grand Lounge',
      baseFee: 950,
      perGuest: 8,      // 3 signature syrups, mocktail infusions, spa waters, custom menus
      baseStaff: 3      // 2 bartenders + 1 barback
    }
  };

  function updateEstimator() {
    if (!guestSlider || !durationSlider || !totalEstimate) return;

    const guests = parseInt(guestSlider.value, 10);
    const hours = parseInt(durationSlider.value, 10);
    let selectedTier = 'craft';

    tierRadios.forEach(radio => {
      if (radio.checked) selectedTier = radio.value;
      const card = radio.closest('.radio-card');
      if (card) card.classList.toggle('active', radio.checked);
    });

    const tier = TIER_CONFIG[selectedTier];

    // 1. Staffing allocation based on tier and guest count
    let bartenders = tier.baseStaff;
    let staffLabel = `${bartenders} Certified Bartender${bartenders > 1 ? 's' : ''}`;

    if (selectedTier === 'classic') {
      if (guests <= 65) {
        bartenders = 1;
        staffLabel = '1 Certified Bartender';
      } else if (guests <= 130) {
        bartenders = 2;
        staffLabel = '2 Certified Bartenders';
      } else {
        bartenders = 3;
        staffLabel = '3 Staff (2 Bartenders + Barback)';
      }
    } else if (selectedTier === 'craft') {
      if (guests <= 110) {
        bartenders = 2;
        staffLabel = '2 Certified Bartenders';
      } else if (guests <= 180) {
        bartenders = 3;
        staffLabel = '3 Staff (2 Bartenders + Barback)';
      } else {
        bartenders = 4;
        staffLabel = '4 Staff (3 Bartenders + Barback)';
      }
    } else { // grand
      if (guests <= 130) {
        bartenders = 3;
        staffLabel = '3 Staff (2 Bartenders + Barback)';
      } else {
        bartenders = 4;
        staffLabel = '4 Staff (3 Bartenders + Barback)';
      }
    }

    // Additional staffing fee if guest count exceeds base package staff coverage
    const extraStaffCount = Math.max(0, bartenders - tier.baseStaff);
    const extraStaffFee = extraStaffCount * 180;

    // 2. Per-Guest Consumables / Ingredients Fee
    const guestFee = guests * tier.perGuest;

    // 3. Hourly Service Duration Adjustment (4 hours standard)
    let hourlyAdjustment = 0;
    let hoursLabel = '$0 (Standard 4h)';

    if (hours === 4) {
      hourlyAdjustment = 0;
      hoursLabel = '$0 (Standard 4h)';
    } else if (hours > 4) {
      const extraH = hours - 4;
      hourlyAdjustment = extraH * (bartenders * 65);
      hoursLabel = `+$${hourlyAdjustment} (+${extraH}h @ ${bartenders} staff)`;
    } else {
      const lessH = 4 - hours;
      hourlyAdjustment = -(lessH * (bartenders * 40));
      hoursLabel = `-$${Math.abs(hourlyAdjustment)} (-${lessH}h reduced duration)`;
    }

    // 4. Add-on Enhancements
    let addonSum = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) addonSum += parseInt(cb.value, 10);
    });

    // 5. Total Investment Calculation
    const total = tier.baseFee + guestFee + extraStaffFee + hourlyAdjustment + addonSum;

    // UI Updates
    guestCountVal.textContent = `${guests} Guests`;
    durationVal.textContent = `${hours} Hours`;
    totalEstimate.textContent = total.toLocaleString();
    if (summaryStaff) summaryStaff.textContent = staffLabel;
    if (summaryTier) summaryTier.textContent = tier.name;
    if (summaryHours) summaryHours.textContent = hoursLabel;
    if (summaryAddons) summaryAddons.textContent = `+$${addonSum}`;
  }

  if (guestSlider) {
    guestSlider.addEventListener('input', updateEstimator);
    durationSlider.addEventListener('input', updateEstimator);
    tierRadios.forEach(r => r.addEventListener('change', updateEstimator));
    addonCheckboxes.forEach(cb => cb.addEventListener('change', updateEstimator));
    updateEstimator();
  }

  // --- Connect Estimator Selections to Inquiry Form ---
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
        eventNotes.value = `Applied from estimator:\n- Selected Package: ${TIER_CONFIG[selectedTier].name}\n- Planned Service Duration: ${hours} Hours\n- Estimated Guest Count: ${guests}\n- Enhancements: ${selectedAddons.length ? selectedAddons.join(', ') : 'None'}\n\nAdditional event notes: `;
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