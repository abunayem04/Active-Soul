/**
 * ACTIVE SOUL — HUMAN PERFORMANCE SYSTEM
 * Core Application Logic & Micro-Interactions
 * Philosophy: LESS, BUT BETTER.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initScrollReveals();
  initGoalPanels();
  initMethodologySteps();
  initCompareSlider();
  initTechDashboard();
  initTestimonialSlider();
  initPricingToggle();
  initAssessmentModal();
  initMobileDrawer();
});

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
   5. TRAINING SYSTEM (METHODOLOGY) STEP TRACKER
   ========================================================================== */
function initMethodologySteps() {
  const stepItems = document.querySelectorAll('.system-step-item');
  if (!stepItems.length) return;

  stepItems.forEach((step, index) => {
    step.addEventListener('click', () => {
      stepItems.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    });
  });
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

  // Touch and mouse smooth movement
  rangeInput.addEventListener('change', (e) => {
    updatePosition(e.target.value);
  });
}

/* ==========================================================================
   7. TECHNOLOGY & TELEMETRY HUD DASHBOARD
   ========================================================================== */
const techData = {
  strain: {
    title: 'DAY STRAIN ACCUMULATION',
    val: '16.8',
    unit: '/ 21',
    chartPath: 'M0,110 C50,105 90,85 140,75 C190,65 240,80 300,50 C360,20 420,35 480,15 L500,10',
    stat1Label: 'PEAK METABOLIC RATE',
    stat1Val: '782 CAL',
    stat1Badge: 'ZONE 4 DOMINANT',
    stat2Label: 'RECOVERY DEMAND',
    stat2Val: 'HIGH',
    stat2Badge: '8.4 HRS SLEEP ADVICE'
  },
  recovery: {
    title: 'PHYSIOLOGICAL RECOVERY SCORE',
    val: '94%',
    unit: 'OPTIMAL',
    chartPath: 'M0,90 C60,80 120,50 180,40 C240,30 320,25 400,18 C450,15 480,12 500,10',
    stat1Label: 'RESTING HEART RATE',
    stat1Val: '46 BPM',
    stat1Badge: '-4 BPM FROM BASELINE',
    stat2Label: 'HRV (R-R INTERVAL)',
    stat2Val: '118 MS',
    stat2Badge: '+14% PARASYMPATHETIC'
  },
  zones: {
    title: 'TIME IN ANAEROBIC THRESHOLD',
    val: '42:15',
    unit: 'MINS',
    chartPath: 'M0,120 C70,115 130,95 200,60 C260,30 330,45 400,20 C450,10 480,15 500,8',
    stat1Label: 'LACTATE TURNING POINT',
    stat1Val: '172 BPM',
    stat1Badge: 'SUSTAINED 22 MINS',
    stat2Label: 'VO2 PEAK ESTIMATE',
    stat2Val: '58.4',
    stat2Badge: 'TOP 2% ELITE'
  },
  biomechanics: {
    title: 'CADENCE & GROUND REACTION',
    val: '182',
    unit: 'SPM',
    chartPath: 'M0,70 C60,68 120,65 180,62 C250,55 320,50 390,45 C440,40 480,38 500,35',
    stat1Label: 'GROUND CONTACT TIME',
    stat1Val: '208 MS',
    stat1Badge: 'SYMMETRIC 50.1 / 49.9',
    stat2Label: 'VERTICAL OSCILLATION',
    stat2Val: '6.4 CM',
    stat2Badge: 'EXCELLENT EFFICIENCY'
  }
};

function initTechDashboard() {
  const tabs = document.querySelectorAll('.tech-tab-btn');
  const titleEl = document.getElementById('telemetryTitle');
  const valEl = document.getElementById('telemetryVal');
  const chartLine = document.getElementById('telemetryChartLine');
  const mini1Label = document.getElementById('techMini1Label');
  const mini1Val = document.getElementById('techMini1Val');
  const mini1Badge = document.getElementById('techMini1Badge');
  const mini2Label = document.getElementById('techMini2Label');
  const mini2Val = document.getElementById('techMini2Val');
  const mini2Badge = document.getElementById('techMini2Badge');

  if (!tabs.length || !chartLine) return;

  // Chart scroll observer for draw-in
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        chartLine.classList.add('animated');
      }
    });
  }, { threshold: 0.3 });

  chartObserver.observe(chartLine);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.getAttribute('data-tech');
      const data = techData[mode];
      if (!data) return;

      // Animate line reload
      chartLine.classList.remove('animated');
      chartLine.setAttribute('d', data.chartPath);
      setTimeout(() => chartLine.classList.add('animated'), 50);

      titleEl.textContent = data.title;
      valEl.innerHTML = `${data.val} <span class="val-unit">${data.unit}</span>`;
      
      mini1Label.textContent = data.stat1Label;
      mini1Val.textContent = data.stat1Val;
      mini1Badge.textContent = data.stat1Badge;

      mini2Label.textContent = data.stat2Label;
      mini2Val.textContent = data.stat2Val;
      mini2Badge.textContent = data.stat2Badge;
    });
  });
}

/* ==========================================================================
   8. MINIMAL TESTIMONIAL SLIDER
   ========================================================================== */
const testimonials = [
  {
    quote: "“I DIDN'T JUST GET STRONGER. I BECAME MORE DISCIPLINED.”",
    author: "MARCUS VANCE",
    role: "HYBRID PERFORMANCE MEMBER // 18 MONTHS"
  },
  {
    quote: "“THE PROGRAMMING REMOVED ALL GUESSWORK. IT FEELS LIKE TRAINING FOR AN OLYMPIC CYCLE WITH EVERYDAY CLARITY.”",
    author: "ELENA ROSTOVA",
    role: "ENDURANCE & MARATHON TRACK // 2 YEARS"
  },
  {
    quote: "“PRECISION AT ITS HIGHEST LEVEL. MY MOBILITY HAS SURPASSED WHERE I WAS A DECADE AGO.”",
    author: "DAVID CHEN",
    role: "STRENGTH & LONGEVITY TRACK // 14 MONTHS"
  }
];

function initTestimonialSlider() {
  let currentIndex = 0;
  const quoteEl = document.getElementById('testQuote');
  const authorEl = document.getElementById('testAuthor');
  const roleEl = document.getElementById('testRole');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  if (!quoteEl || !prevBtn || !nextBtn) return;

  function renderQuote(index) {
    quoteEl.style.opacity = '0';
    quoteEl.style.transform = 'translateY(10px)';

    setTimeout(() => {
      const item = testimonials[index];
      quoteEl.textContent = item.quote;
      authorEl.textContent = item.author;
      roleEl.textContent = item.role;

      quoteEl.style.transition = 'opacity 0.4s var(--ease-cinematic), transform 0.4s var(--ease-cinematic)';
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateY(0)';
    }, 200);
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    renderQuote(currentIndex);
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderQuote(currentIndex);
  });
}

/* ==========================================================================
   9. PRICING BILLING CYCLE TOGGLE
   ========================================================================== */
function initPricingToggle() {
  const toggleWrapper = document.getElementById('billingToggle');
  const starterPrice = document.getElementById('priceStarter');
  const perfPrice = document.getElementById('pricePerformance');
  const elitePrice = document.getElementById('priceElite');

  if (!toggleWrapper || !starterPrice) return;

  const buttons = toggleWrapper.querySelectorAll('.toggle-opt');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const isAnnual = btn.getAttribute('data-cycle') === 'annual';
      if (isAnnual) {
        starterPrice.textContent = '64';
        perfPrice.textContent = '119';
        elitePrice.textContent = '229';
      } else {
        starterPrice.textContent = '79';
        perfPrice.textContent = '149';
        elitePrice.textContent = '289';
      }
    });
  });
}

/* ==========================================================================
   10. INTERACTIVE ONBOARDING ASSESSMENT MODAL
   ========================================================================== */
let currentModalStep = 1;
let selectedGoal = 'STRENGTH & POWER';
let selectedFrequency = '4 - 5 DAYS / WEEK';

function initAssessmentModal() {
  const modalOverlay = document.getElementById('assessmentModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerBtns = document.querySelectorAll('[data-trigger-assessment]');

  if (!modalOverlay || !closeBtn) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
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
      selectedFrequency = btn.getAttribute('data-val');
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

  recGoal.textContent = selectedGoal;

  if (selectedGoal.includes('RUN') || selectedGoal.includes('ENDURANCE')) {
    recProgram.textContent = 'RUNNING & AEROBIC CAPACITY TRACK';
    recDesc.textContent = `Optimized for ${selectedFrequency} with progressive threshold running, cadence efficiency, and VO2-max development.`;
  } else if (selectedGoal.includes('MUSCLE') || selectedGoal.includes('STRONGER')) {
    recProgram.textContent = 'STRENGTH & HYPERTROPHY TRACK';
    recDesc.textContent = `Programmed for ${selectedFrequency} with mechanical tension, periodized load progression, and biometric recovery windows.`;
  } else if (selectedGoal.includes('MOBILITY') || selectedGoal.includes('MOVE')) {
    recProgram.textContent = 'MOBILITY & KINETIC LONGEVITY TRACK';
    recDesc.textContent = `Calibrated for ${selectedFrequency} focusing on thoracic expansion, joint articulation, and nervous system regeneration.`;
  } else {
    recProgram.textContent = 'HYBRID ATHLETIC PERFORMANCE TRACK';
    recDesc.textContent = `High-output protocol programmed for ${selectedFrequency} combining maximum strength, aerobic power, and athletic longevity.`;
  }
}

/* ==========================================================================
   11. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  backdrop.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}
