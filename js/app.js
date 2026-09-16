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
  initMethodologySteps();
  initCompareSlider();
  initFaqAccordion();
  initResultsFilters();
  initEventTabs();
  initAdmissionForm();
  initAssessmentModal();
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
      openAssessmentModalWithGoal(goalName);
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

    const name = document.getElementById('applicantName').value.trim();
    const phone = document.getElementById('applicantPhone').value.trim();
    
    // Get selected radio button for gender
    let gender = '';
    const genderRadios = document.getElementsByName('applicantGender');
    for (const radio of genderRadios) {
      if (radio.checked) {
        gender = radio.value;
        break;
      }
    }

    const goal = document.getElementById('applicantGoal').value;
    const place = document.getElementById('applicantPlace').value;
    const payment = document.getElementById('applicantPayment').value.trim();
    const notes = document.getElementById('applicantNotes').value.trim();

    // Create WhatsApp message URI with all data
    const message = `Assalamu Alaikum Active Soul Team,\nI have paid 5,000 BDT for Batch 8. Here are my registration details:\n\nName: ${name}\nGender: ${gender}\nWhatsApp: ${phone}\nGoal: ${goal}\nLocation: ${place}\nMedical Notes: ${notes || 'N/A'}\n\nbKash Payment (TrxID/Last Digits): ${payment}\n\nPlease verify my payment and add me to the respective group. Thank you!`;
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
   11. INTERACTIVE ONBOARDING ASSESSMENT MODAL
   ========================================================================== */
let currentModalStep = 1;
let selectedGoal = 'WEIGHT LOSS';
let selectedEnvironment = 'HOME WORKOUT';

function initAssessmentModal() {
  const modalOverlay = document.getElementById('assessmentModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerBtns = document.querySelectorAll('[data-trigger-assessment]');

  if (!modalOverlay || !closeBtn) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const presetGoal = btn.getAttribute('data-goal');
      if (presetGoal) {
        openAssessmentModalWithGoal(presetGoal);
      } else {
        openModal();
      }
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });

  // Modal Step 1 option clicks
  const step1Opts = document.querySelectorAll('#modalStep1 .modal-option-btn');
  step1Opts.forEach(btn => {
    btn.addEventListener('click', () => {
      step1Opts.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedGoal = btn.getAttribute('data-val');
      setTimeout(() => goToStep(2), 220);
    });
  });

  // Modal Step 2 option clicks
  const step2Opts = document.querySelectorAll('#modalStep2 .modal-option-btn');
  step2Opts.forEach(btn => {
    btn.addEventListener('click', () => {
      step2Opts.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEnvironment = btn.getAttribute('data-val');
      setTimeout(() => finalizeRecommendation(), 220);
    });
  });

  // Step 3 Reset
  const restartBtn = document.getElementById('modalRestartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      goToStep(1);
    });
  }
}

function openModal() {
  const modalOverlay = document.getElementById('assessmentModal');
  if (!modalOverlay) return;
  goToStep(1);
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modalOverlay = document.getElementById('assessmentModal');
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function openAssessmentModalWithGoal(goalName) {
  openModal();
  const targetOpt = document.querySelector(`#modalStep1 .modal-option-btn[data-val="${goalName}"]`);
  if (targetOpt) {
    const step1Opts = document.querySelectorAll('#modalStep1 .modal-option-btn');
    step1Opts.forEach(b => b.classList.remove('selected'));
    targetOpt.classList.add('selected');
    selectedGoal = goalName;
    setTimeout(() => goToStep(2), 250);
  }
}

function goToStep(stepNumber) {
  currentModalStep = stepNumber;

  const step1 = document.getElementById('modalStep1');
  const step2 = document.getElementById('modalStep2');
  const step3 = document.getElementById('modalStep3');
  const pills = document.querySelectorAll('.modal-step-indicator .step-pill');

  [step1, step2, step3].forEach(s => {
    if (s) s.style.display = 'none';
  });

  pills.forEach((p, idx) => {
    if (idx < stepNumber) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  if (stepNumber === 1 && step1) step1.style.display = 'block';
  if (stepNumber === 2 && step2) step2.style.display = 'block';
  if (stepNumber === 3 && step3) step3.style.display = 'block';
}

function finalizeRecommendation() {
  goToStep(3);

  const recGoal = document.getElementById('recGoal');
  const recProgram = document.getElementById('recProgram');
  const recDesc = document.getElementById('recDesc');

  if (!recGoal || !recProgram) return;

  recGoal.textContent = `${selectedGoal} (${selectedEnvironment})`;

  if (selectedGoal.includes('LOSS')) {
    recProgram.textContent = 'WEIGHT LOSS (FAT LOSS) TRACK';
    recDesc.textContent = `Optimized 90-day protocol for ${selectedEnvironment} focusing on sustainable caloric deficit, metabolic conditioning, and lean muscle preservation.`;
  } else if (selectedGoal.includes('GAIN')) {
    recProgram.textContent = 'WEIGHT GAIN & HYPERTROPHY TRACK';
    recDesc.textContent = `Structured 90-day protocol for ${selectedEnvironment} emphasizing progressive overload, clean surplus macros, and muscular density.`;
  } else {
    recProgram.textContent = 'BODY RECOMPOSITION TRACK';
    recDesc.textContent = `Calibrated 90-day protocol for ${selectedEnvironment} combining simultaneous fat loss, muscle tone development, and deshi nutrition.`;
  }
}

/* ==========================================================================
   12. MOBILE NAVIGATION DRAWER
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
