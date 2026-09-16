/**
 * ACTIVE SOUL — BANGLADESH'S FIRST ISLAMIC FITNESS PLATFORM
 * Core Application Logic, Micro-Interactions & Batch 8 Handlers
 * Philosophy: LESS, BUT BETTER.
 */

let lenis;

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initNavbar();
  initCounters();
  initScrollReveals();
  initGoalPanels();
  initCtaSmoothScroll();
  initMethodologySteps();
  initCompareSlider();
  initFaqAccordion();
  initResultsFilters();
  initEventTabs();
  initAdmissionForm();
  initMobileDrawer();
});

/* ==========================================================================
   0. LENIS ULTRA-LUXURY SMOOTH SCROLL
   ========================================================================== */
function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync navbar scroll state with Lenis scroll
    lenis.on('scroll', (e) => {
      const navbar = document.querySelector('.navbar');
      if (navbar) {
        if (e.scroll > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });

    // Smooth scroll for internal navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -70, duration: 1.2 });
          }
        }
      });
    });
  }
}

/* ==========================================================================
   1. NAVBAR SCROLL & ACTIVE STATES
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* ==========================================================================
   2. TRUST METRIC COUNT-UP ANIMATIONS
   ========================================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = (target * easeProgress).toFixed(decimals);

      el.innerHTML = `${currentVal}<span class="stat-accent">${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.innerHTML = `${target.toFixed(decimals)}<span class="stat-accent">${suffix}</span>`;
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ==========================================================================
   3. SCROLL-TRIGGERED REVEALS (LESS BUT BETTER)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. GOAL SELECTION PANELS INTERACTION
   ========================================================================== */
function initGoalPanels() {
  const panels = document.querySelectorAll('.goal-panel');
  if (!panels.length) return;

  panels.forEach(panel => {
    panel.addEventListener('click', () => {
      const goalName = panel.getAttribute('data-goal');
      scrollToRegistrationForm(goalName);
    });
  });
}

/* ==========================================================================
   5. TRAINING SYSTEM (METHODOLOGY) STEP TRACKER & SCROLL-SPY
   ========================================================================== */
function initMethodologySteps() {
  const stepItems = document.querySelectorAll('.system-step-item');
  const systemSection = document.getElementById('system');
  if (!stepItems.length) return;

  function setActiveStep(targetIndex) {
    stepItems.forEach((step, idx) => {
      if (idx === targetIndex) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  // Click interaction
  stepItems.forEach((step, idx) => {
    step.addEventListener('click', () => {
      setActiveStep(idx);
    });
  });

  // Real-time Scroll-Spy calculation
  const updateScrollSpy = () => {
    const viewportHeight = window.innerHeight;
    const triggerY = viewportHeight * 0.45; // Focus center zone at 45% of viewport

    let activeIdx = 0;
    let minDistance = Infinity;

    stepItems.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const stepCenter = rect.top + rect.height / 2;
      const dist = Math.abs(stepCenter - triggerY);

      // If the step is in or near the trigger line
      if (rect.top <= viewportHeight * 0.7 && rect.bottom >= viewportHeight * 0.2) {
        if (dist < minDistance) {
          minDistance = dist;
          activeIdx = index;
        }
      }
    });

    if (systemSection) {
      const secRect = systemSection.getBoundingClientRect();
      if (secRect.top < viewportHeight && secRect.bottom > 0) {
        setActiveStep(activeIdx);
      }
    }
  };

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.on('scroll', updateScrollSpy);
  }
  updateScrollSpy();
}

/* ==========================================================================
   6. INTERACTIVE BEFORE / AFTER SLIDER
   ========================================================================== */
function initCompareSlider() {
  const rangeInput = document.getElementById('compareRange');
  const overlay = document.getElementById('compareOverlay');
  const handle = document.getElementById('compareHandle');

  if (!rangeInput || !overlay || !handle) return;

  const updatePosition = (val) => {
    overlay.style.width = `${val}%`;
    handle.style.left = `${val}%`;
  };

  rangeInput.addEventListener('input', (e) => {
    updatePosition(e.target.value);
  });

  rangeInput.addEventListener('change', (e) => {
    updatePosition(e.target.value);
  });
}

/* ==========================================================================
   7. FAQ ACCORDION INTERACTION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all items for smooth accordion UX
      faqItems.forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.faq-question-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   8. RESULTS BATCH & TRACK FILTERING
   ========================================================================== */
function initResultsFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.transform-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   9. EVENTS STATUS TABS FILTERING
   ========================================================================== */
function initEventTabs() {
  const eventTabs = document.querySelectorAll('.event-tab-btn');
  const eventCards = document.querySelectorAll('.event-card');

  if (!eventTabs.length || !eventCards.length) return;

  eventTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      eventTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const status = tab.getAttribute('data-event-tab');

      eventCards.forEach(card => {
        const cardStatus = card.getAttribute('data-event-status');
        if (status === 'all' || cardStatus === status) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   10. BATCH 8 ADMISSION & ENQUIRY FORM SUBMISSION
   ========================================================================== */
function initAdmissionForm() {
  const form = document.getElementById('batch8AdmissionForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('applicantName');
    const phoneEl = document.getElementById('applicantPhone');
    const ageEl = document.getElementById('applicantAge');
    const weightEl = document.getElementById('applicantWeight');
    const heightEl = document.getElementById('applicantHeight');
    const targetWeightEl = document.getElementById('applicantTargetWeight');
    const goalEl = document.getElementById('applicantGoal');
    const placeEl = document.getElementById('applicantPlace');
    const activityEl = document.getElementById('applicantActivity');
    const experienceEl = document.getElementById('applicantExperience');
    const dietEl = document.getElementById('applicantDiet');
    const paymentEl = document.getElementById('applicantPayment');
    const senderNumEl = document.getElementById('applicantSenderNumber');
    const notesEl = document.getElementById('applicantNotes');

    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const age = ageEl ? ageEl.value.trim() : 'N/A';
    const weight = weightEl ? weightEl.value.trim() : 'N/A';
    const height = heightEl ? heightEl.value.trim() : 'N/A';
    const targetWeight = targetWeightEl ? targetWeightEl.value.trim() : 'N/A';
    const goal = goalEl ? goalEl.value : '';
    const place = placeEl ? placeEl.value : '';
    const activity = activityEl ? activityEl.value : 'N/A';
    const experience = experienceEl ? experienceEl.value : 'N/A';
    const diet = dietEl ? dietEl.value : 'N/A';
    const payment = paymentEl ? paymentEl.value.trim() : 'N/A';
    const senderNum = senderNumEl ? senderNumEl.value.trim() : '';
    const notes = notesEl ? notesEl.value.trim() : '';

    // Get selected radio button for gender
    let gender = '';
    const genderRadios = document.getElementsByName('applicantGender');
    for (const radio of genderRadios) {
      if (radio.checked) {
        gender = radio.value;
        break;
      }
    }

    // Create structured WhatsApp message with full client assessment profile
    let message = '';
    if (paymentEl) {
      message = `Assalamu Alaikum Active Soul Team,\nI have paid 5,000 BDT for Batch 8. Here are my registration and assessment details:\n\n📋 PERSONAL PROFILE:\n• Name: ${name}\n• Gender: ${gender || 'Not specified'}\n• WhatsApp: ${phone}\n• Age: ${age}\n• Height: ${height}\n• Current Weight: ${weight} kg\n• Target Goal Weight: ${targetWeight} kg\n\n🎯 TRAINING & NUTRITION:\n• Primary Goal: ${goal}\n• Training Location: ${place}\n• Daily Activity: ${activity}\n• Experience: ${experience}\n• Dietary Preference: ${diet}\n\n🏥 MEDICAL & INJURIES:\n• Notes: ${notes || 'None'}\n\n💳 PAYMENT VERIFICATION:\n• bKash TrxID / Last 4 Digits: ${payment}\n${senderNum ? `• bKash Sender Account: ${senderNum}\n` : ''}\nPlease verify my payment and enroll me in Batch 8. Thank you!`;
    } else {
      message = `Assalamu Alaikum Active Soul Team,\nI would like to enquire / enroll into Active Soul:\n\nName: ${name}\nWhatsApp: ${phone}\nGoal: ${goal}\nLocation: ${place}\nNotes: ${notes || 'None'}\n\nLooking forward to hearing from you!`;
    }
    const encodedMsg = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/8801612091069?text=${encodedMsg}`;

    // Provide friendly confirmation
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `✓ PROCESSING... REDIRECTING TO WHATSAPP`;
    submitBtn.style.backgroundColor = '#15803d';
    submitBtn.style.color = '#FFFFFF';

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.style.backgroundColor = '';
      submitBtn.style.color = '';
    }, 1200);
  });
}

/* ==========================================================================
   10.1 BKASH NUMBER CLIPBOARD COPY HELPER
   ========================================================================== */
function copyBkashNumber(btn) {
  const number = '01821266257';
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(number).then(() => {
      showCopiedState(btn);
    }).catch(() => {
      fallbackCopyText(number, btn);
    });
  } else {
    fallbackCopyText(number, btn);
  }
}

function fallbackCopyText(text, btn) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showCopiedState(btn);
  } catch (err) {
    console.error('Fallback copy error:', err);
  }
  document.body.removeChild(textArea);
}

function showCopiedState(btn) {
  if (!btn) return;
  const textSpan = btn.querySelector('.copy-text') || btn;
  const originalText = textSpan.innerText;
  textSpan.innerText = 'COPIED!';
  btn.style.backgroundColor = '#22c55e';
  btn.style.color = '#FFFFFF';
  setTimeout(() => {
    textSpan.innerText = originalText;
    btn.style.backgroundColor = '';
    btn.style.color = '';
  }, 2000);
}

/* ==========================================================================
   10.2 ALL CTAS SMOOTH SCROLL & AUTO-SELECT FORM HANDLER
   ========================================================================== */
function initCtaSmoothScroll() {
  const formTriggers = document.querySelectorAll(
    'a[href="#batch8"], a[href="#enroll"], a[href="#contact"], a[href="#batch8AdmissionForm"], [data-scroll-form], [data-trigger-assessment]'
  );

  formTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const goal = btn.getAttribute('data-goal');
      scrollToRegistrationForm(goal);
    });
  });
}

function scrollToRegistrationForm(presetGoal = null) {
  const formSection = document.getElementById('batch8') || document.getElementById('enroll') || document.getElementById('batch8AdmissionForm');
  if (!formSection) return;

  // Close mobile drawer if open
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer && drawer.classList.contains('open')) {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Pre-select goal in dropdown if provided
  if (presetGoal) {
    const goalSelect = document.getElementById('applicantGoal');
    if (goalSelect) {
      for (let i = 0; i < goalSelect.options.length; i++) {
        const optVal = goalSelect.options[i].value.toLowerCase();
        const goalLower = presetGoal.toLowerCase();
        if (optVal.includes(goalLower) || goalLower.includes(optVal)) {
          goalSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Smooth scroll using Lenis or native smooth scroll
  const formEl = document.getElementById('batch8AdmissionForm') || formSection;
  if (typeof lenis !== 'undefined' && lenis) {
    lenis.scrollTo(formEl, { offset: -90, duration: 1.2 });
  } else {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Subtle luminous feedback border/glow on form
  if (formEl) {
    formEl.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
    formEl.style.borderColor = 'var(--accent-lime)';
    formEl.style.boxShadow = '0 0 35px rgba(182, 255, 0, 0.35)';
    setTimeout(() => {
      formEl.style.borderColor = '';
      formEl.style.boxShadow = '';
    }, 2000);
  }

  // Auto focus on name input field
  setTimeout(() => {
    const nameInput = document.getElementById('applicantName');
    if (nameInput) {
      nameInput.focus();
    }
  }, 700);
}

/* ==========================================================================
   11. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const drawerCtas = drawer ? drawer.querySelectorAll('[data-trigger-assessment]') : [];
  const drawerBrand = drawer ? drawer.querySelector('.drawer-brand') : null;

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  drawerCtas.forEach(btn => {
    btn.addEventListener('click', closeDrawer);
  });

  if (drawerBrand) {
    drawerBrand.addEventListener('click', closeDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}
