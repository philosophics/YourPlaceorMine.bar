document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Drawer Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });

    document.querySelectorAll('.drawer-link, .drawer-cta').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // --- Pricing Estimator Logic ---
  const guestSlider = document.getElementById('guestSlider');
  const durationSlider = document.getElementById('durationSlider');
  const guestCountVal = document.getElementById('guestCountVal');
  const durationVal = document.getElementById('durationVal');
  const tierRadios = document.querySelectorAll('input[name="tierSelect"]');
  const addonCheckboxes = document.querySelectorAll('.checkbox-list input[type="checkbox"]');
  
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
    classic: 'Classic Pour',
    craft: 'Craft Signature',
    grand: 'Grand Lounge'
  };

  function calculateQuote() {
    if (!guestSlider) return;

    const guests = parseInt(guestSlider.value, 10);
    const hours = parseInt(durationSlider.value, 10);
    let selectedTier = 'craft';

    tierRadios.forEach(radio => {
      if (radio.checked) selectedTier = radio.value;
      radio.closest('.radio-card').classList.toggle('active', radio.checked);
    });

    // Staffing requirements
    let bartenders = 1;
    if (guests > 65 || selectedTier === 'craft') bartenders = 2;
    if (guests > 140 || selectedTier === 'grand') bartenders = 3;

    // Hourly extension calculations (base tiers include 4h; grand includes 5h)
    const baseIncludedHours = selectedTier === 'grand' ? 5 : 4;
    const extraHours = Math.max(0, hours - baseIncludedHours);
    const hourlyStaffRate = bartenders * 65;
    const hourlyFee = extraHours * hourlyStaffRate;

    // Add-on totals
    let addonSum = 0;
    addonCheckboxes.forEach(cb => {
      if (cb.checked) addonSum += parseInt(cb.value, 10);
    });

    const total = BASE_PRICES[selectedTier] + hourlyFee + addonSum;

    // UI Updates
    guestCountVal.textContent = `${guests} Guests`;
    durationVal.textContent = `${hours} Hours`;
    totalEstimate.textContent = `$${total.toLocaleString()}`;
    summaryStaff.textContent = `${bartenders} Certified Bartender${bartenders > 1 ? 's' : ''}`;
    summaryTier.textContent = TIER_NAMES[selectedTier];
    summaryHours.textContent = extraHours > 0 ? `+$${hourlyFee} (${extraHours} extra hrs)` : `$0 (Standard)`;
    summaryAddons.textContent = `+$${addonSum}`;
  }

  if (guestSlider) {
    guestSlider.addEventListener('input', calculateQuote);
    durationSlider.addEventListener('input', calculateQuote);
    tierRadios.forEach(r => r.addEventListener('change', calculateQuote));
    addonCheckboxes.forEach(cb => cb.addEventListener('change', calculateQuote));
    calculateQuote();
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
      if (eventNotes) {
        eventNotes.value = `Applied from estimator:\n- Selected Tier: ${TIER_NAMES[selectedTier]}\n- Planned Duration: ${hours} Hours\n- Estimated Guest Count: ${guests}\n\nAdditional notes: `;
      }

      const reserveSection = document.getElementById('reserve');
      if (reserveSection) {
        reserveSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // --- Booking Form Submission ---
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for inquiring with Your Place or Mine. We will review your event details and respond within 24 hours.');
      bookingForm.reset();
    });
  }

  // --- Accordion FAQ ---
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const parent = button.parentElement;
      parent.classList.toggle('open');
    });
  });
});