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

  // --- Pricing Estimator Logic (Bracketed Range & 100-Guest Solo Capacity) ---
  const guestSlider = document.getElementById('guestSlider');
  const durationSlider = document.getElementById('durationSlider');
  const guestCountVal = document.getElementById('guestCountVal');
  const durationVal = document.getElementById('durationVal');
  const tierRadios = document.querySelectorAll('input[name="tierSelect"]');
  const addonCheckboxes = document.querySelectorAll('.addons-grid input[type="checkbox"]');
  const addonIceDisplay = document.getElementById('addonIceDisplay');

  const totalEstimate = document.getElementById('totalEstimate');
  const summaryStaff = document.getElementById('summaryStaff');
  const summaryTier = document.getElementById('summaryTier');
  const summaryHours = document.getElementById('summaryHours');
  const summaryAddons = document.getElementById('summaryAddons');
  const applyToFormBtn = document.getElementById('applyToForm');

  const PUBLIC_TIERS = {
    classic: { name: 'The Classic Pour', base: 350, perGuest: 4.0 },
    apothecary: { name: 'The Zero-Proof Lounge', base: 450, perGuest: 4.5 },
    craft: { name: 'The Craft Signature', base: 520, perGuest: 5.5 },
    grand: { name: 'The Grand Lounge', base: 850, perGuest: 7.5 }
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

    const tier = PUBLIC_TIERS[selectedTier] || PUBLIC_TIERS.craft;

    // Staffing calculation: Solo mixologist up to 100 guests
    let staffCount = 1;
    let staffLabel = '1 Lead Mixologist (Solo Service)';

    if (guests > 175) {
      staffCount = 3;
      staffLabel = '3 Staff (2 Certified Bartenders + Barback)';
    } else if (guests > 100) {
      staffCount = 2;
      staffLabel = '2 Certified Bartenders';
    }

    // Additional staffing fee when exceeding solo capacity
    const extraStaffFee = Math.max(0, staffCount - 1) * 160;

    // Per-guest consumables
    const guestFee = guests * tier.perGuest;

    // Hourly service duration scaling (4 hours standard)
    let hrFee = 0;
    let hoursLabel = '$0 (Standard 4h)';

    if (hours > 4) {
      const extraH = hours - 4;
      hrFee = extraH * (staffCount * 60);
      hoursLabel = `+$${hrFee} (+${extraH}h @ ${staffCount} staff)`;
    } else if (hours < 4) {
      const lessH = 4 - hours;
      hrFee = -(lessH * (staffCount * 35));
      hoursLabel = `-$${Math.abs(hrFee)} (-${lessH}h reduced duration)`;
    }

    // Add-on Enhancements (flat vs per-guest calculation)
    let addonSum = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        if (cb.dataset.perGuest) {
          addonSum += Math.round(guests * parseFloat(cb.dataset.perGuest));
        } else {
          addonSum += parseInt(cb.value, 10);
        }
      }
    });

    // Update dynamic label for ice add-on
    if (addonIceDisplay) {
      const currentIceCost = Math.round(guests * 1.50);
      addonIceDisplay.textContent = `+$${currentIceCost} ($1.50/guest)`;
    }

    const baseline = tier.base + guestFee + extraStaffFee + hrFee + addonSum;

    // Bracketed pricing: Baseline to +15% buffer rounded to nearest $10
    const lowEst = Math.round((baseline * 0.95) / 10) * 10;
    const highEst = Math.round((baseline * 1.25) / 10) * 10;

    // UI Updates
    guestCountVal.textContent = `${guests} Guests`;
    durationVal.textContent = `${hours} Hours`;
    totalEstimate.textContent = `$${lowEst.toLocaleString()} – $${highEst.toLocaleString()}`;

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
      const rangeText = totalEstimate.textContent;
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
        eventNotes.value = 
`[Estimator Selections: ${PUBLIC_TIERS[selectedTier].name} | ${hours} Hours | ${guests} Guests | Est: ${rangeText} | Enhancements: ${selectedAddons.length ? selectedAddons.join(', ') : 'None'}]

Occasion, Vibe & Signature Drink Inspirations:
• Tell us about the occasion, favorite spirits, zero-proof preferences, or signature drink ideas: 


Venue & Logistics:
• Location / venue name, mountain canyon travel, access stairs, or setup notes: 
`;
      }

      const originalText = applyToFormBtn.textContent;
      applyToFormBtn.textContent = 'Transferred! Scrolling to Form...';

      setTimeout(() => {
        const reserveSection = document.getElementById('reserve');
        if (reserveSection) {
          reserveSection.scrollIntoView({ behavior: 'smooth' });
        }
        if (eventNotes) {
          eventNotes.focus();
        }
        setTimeout(() => {
          applyToFormBtn.textContent = originalText;
        }, 1200);
      }, 250);
    });
  }

  // --- Booking Form Submission + Modal Feedback ---
  const bookingForm = document.getElementById('bookingForm');
  const confirmModal = document.getElementById('confirmModal');
  const modalRecap = document.getElementById('modalRecap');
  const closeModal = document.getElementById('closeModal');

  function formatDisplayDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('.submit-btn');
      const originalText = submitBtn.querySelector('.btn-text').textContent;

      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Submitting Request...';

      const formData = new FormData(bookingForm);
      const displayDate = formatDisplayDate(formData.get('event_date'));

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        if (data.success) {
          if (modalRecap) {
            modalRecap.innerHTML = `
              <strong>Host:</strong> ${formData.get('name')}<br>
              <strong>Date:</strong> ${displayDate}<br>
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
        alert(`There was an issue sending your inquiry: ${err.message || 'Please check your connection or email cheers@yourplaceormine.bar directly.'}`);
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

  // --- Enhanced Date Picker Invocation ---
  const eventDateInput = document.getElementById('eventDate');
  if (eventDateInput) {
    // Set minimum selectable date to today so past dates cannot be booked
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.setAttribute('min', today);

    // Clicking anywhere in the input box opens the native date picker modal
    eventDateInput.addEventListener('click', () => {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          eventDateInput.showPicker();
        } catch (err) {
          // Suppress if picker is already open
        }
      }
    });
  }

  // --- Dynamic FAQ Injection & Accordion Engine ---
  const faqList = document.getElementById('faqList');

  if (faqList && typeof FAQ_DATA !== 'undefined') {
    // Event delegation: listens on container so dynamically added buttons always trigger
    faqList.addEventListener('click', (e) => {
      const button = e.target.closest('.faq-question');
      if (!button) return;
      const parent = button.closest('.faq-item');
      if (parent) parent.classList.toggle('open');
    });

    const fragment = document.createDocumentFragment();

    FAQ_DATA.forEach(faq => {
      const item = document.createElement('div');
      item.className = 'faq-item reveal-item';

      const paragraphs = faq.answer
        .trim()
        .split(/\n\s*\n/)
        .map(p => `<p>${p.trim()}</p>`)
        .join('');

      item.innerHTML = `
        <button class="faq-question">
          ${faq.question}
          <span class="faq-icon">+</span>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            ${paragraphs}
          </div>
        </div>
      `;
      fragment.appendChild(item);
    });

    faqList.appendChild(fragment);
  };
});