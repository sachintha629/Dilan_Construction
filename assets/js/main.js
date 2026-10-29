/**
 * Dilan Construction & Enterprises - Official Promo Website JavaScript
 * Comprehensive interactive script handling bilingual toggles, cost calculator,
 * portfolio filtering, image lightbox, stats animation, and inquiry routing.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  let currentLang = localStorage.getItem('dilan_lang') || 'si'; // Default to Sinhala
  let currentTheme = localStorage.getItem('dilan_theme') || 'light';

  // DOM Elements Cache
  const langBtns = document.querySelectorAll('.lang-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const scrollProgress = document.getElementById('scroll-progress');
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backToTopBtn = document.querySelector('.back-to-top');

  // Modal Elements
  const imageModal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const modalCaption = document.getElementById('modal-caption');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  // Calculator Elements
  const calcType = document.getElementById('calc-type');
  const calcSqftRange = document.getElementById('calc-sqft-range');
  const calcSqftInput = document.getElementById('calc-sqft-input');
  const calcFloors = document.getElementById('calc-floors');
  const calcPackage = document.getElementById('calc-package');
  const calcAddons = document.querySelectorAll('.calc-addon-check');
  const summarySqft = document.getElementById('summary-sqft');
  const summaryFloors = document.getElementById('summary-floors');
  const summaryPkg = document.getElementById('summary-pkg');
  const summaryTotal = document.getElementById('summary-total');
  const btnWhatsappCalc = document.getElementById('calc-whatsapp-btn');

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  const btnDirectWhatsapp = document.getElementById('btn-direct-whatsapp');

  /* ==========================================================================
     1. Internationalization (Bilingual Switcher - Sinhala & English)
     ========================================================================== */
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('dilan_lang', lang);
    document.documentElement.lang = lang;

    // Update active class on buttons
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Translate all elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        if (el.tagName === 'OPTION') {
          el.text = translations[lang][key];
          el.label = translations[lang][key];
          el.innerText = translations[lang][key];
        } else {
          el.innerHTML = translations[lang][key];
        }
      }
    });

    // Translate input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });

    // Re-calculate estimate to update localized currency labels
    calculateEstimate();
  }

  // Bind Language Buttons
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;
      applyLanguage(selectedLang);
      showToast(selectedLang === 'si' ? 'භාෂාව සිංහලට මාරු කරන ලදී' : 'Language switched to English');
    });
  });

  /* ==========================================================================
     2. Dark & Light Theme Management
     ========================================================================== */
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('dilan_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = theme === 'dark' 
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(newTheme === 'dark' ? 'Dark Mode Activated' : 'Light Mode Activated');
    });
  }

  /* ==========================================================================
     3. Scroll Progress & Sticky Navbar & Back to Top
     ========================================================================== */
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;

    // Sticky Navbar
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     4. Mobile Navigation Drawer
     ========================================================================== */
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close when clicking nav link
    navMenu.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });

    // Auto-close on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991 && navMenu.classList.contains('open')) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      }
    });
  }

  /* ==========================================================================
     5. Interactive Construction Cost Calculator & WhatsApp Quote Linker
     ========================================================================== */
  function calculateEstimate() {
    if (!calcSqftRange || !calcFloors || !calcPackage || !summaryTotal) return;

    const sqft = parseInt(calcSqftRange.value, 10) || 1200;
    const floors = parseInt(calcFloors.value, 10) || 1;
    const pkgRate = parseInt(calcPackage.value, 10) || 8200; // Rs. per sqft

    // Base structural cost
    let baseCost = sqft * pkgRate;

    // Floor multiplier adjustments (upper floors require staging/concrete lift)
    if (floors > 1) {
      baseCost += (floors - 1) * (sqft * 0.15 * pkgRate);
    }

    // Addons
    let addonsCost = 0;
    let selectedAddonNames = [];
    calcAddons.forEach(addon => {
      if (addon.checked) {
        const val = parseInt(addon.value, 10);
        addonsCost += val;
        const addonLabel = currentLang === 'si'
          ? (addon.dataset.nameSi || addon.dataset.name || 'අමතර සේවාව')
          : (addon.dataset.nameEn || addon.dataset.name || 'Upgrade');
        selectedAddonNames.push(addonLabel);
      }
    });

    const totalEstimated = baseCost + addonsCost;

    // Update labels in summary
    const sqftDisplay = document.getElementById('sqft-display');
    if (sqftDisplay) sqftDisplay.textContent = sqft.toLocaleString();
    if (summarySqft) summarySqft.textContent = `${sqft.toLocaleString()} sq.ft`;
    
    if (summaryFloors) {
      if (currentLang === 'si') {
        summaryFloors.textContent = floors === 1 ? 'තනි මහල (1)' : (floors === 2 ? 'දෙමහල් (2)' : `මහල් ${floors}`);
      } else {
        summaryFloors.textContent = floors === 1 ? '1 Floor' : `${floors} Floors`;
      }
    }
    
    // Package name label
    const pkgLabel = calcPackage.options[calcPackage.selectedIndex].text.split('(')[0].trim();
    if (summaryPkg) summaryPkg.textContent = pkgLabel;

    // Formatted Currency
    const currencyPrefix = currentLang === 'si' ? 'රු. ' : 'LKR ';
    summaryTotal.textContent = `${currencyPrefix}${totalEstimated.toLocaleString()}`;

    // Update WhatsApp Button Link with full and proper URL encoding
    if (btnWhatsappCalc) {
      const typeText = calcType && calcType.selectedIndex >= 0 ? calcType.options[calcType.selectedIndex].text : 'Building';
      let fullMsg = '';
      if (currentLang === 'si') {
        const addonText = selectedAddonNames.length ? selectedAddonNames.join(', ') : 'නැත';
        fullMsg = `*Dilan Construction & Enterprises - මිල ඇස්තමේන්තු විමසීමක්*\n` +
          `----------------------------------------\n` +
          `🏗️ *ගොඩනැගිලි වර්ගය:* ${typeText}\n` +
          `📐 *වර්ග ප්‍රමාණය:* ${sqft} sq.ft (වර්ග අඩි)\n` +
          `🏢 *මහල් ගණන:* ${floors}\n` +
          `⭐ *පැකේජ ප්‍රමිතිය:* ${pkgLabel}\n` +
          `✨ *අමතර සේවාවන්:* ${addonText}\n` +
          `💰 *ආසන්න ඇස්තමේන්තුව:* ${currencyPrefix}${totalEstimated.toLocaleString()}\n` +
          `----------------------------------------\n` +
          `ආයුබෝවන් Dilan Construction, මම ඔබගේ නිල වෙබ් අඩවියෙන් මෙම මූලික ඇස්තමේන්තුව ගණනය කරගත්තා. නොමිලේ ක්ෂේත්‍ර පරීක්ෂාවක් (Site Inspection) සහ නිවැරදි BOQ වාර්තාවක් ලබාගැනීමට කරුණාකර මා සම්බන්ධ කරගන්න.`;
      } else {
        const addonText = selectedAddonNames.length ? selectedAddonNames.join(', ') : 'None';
        fullMsg = `*Dilan Construction & Enterprises - Estimate Inquiry*\n` +
          `----------------------------------------\n` +
          `🏗️ *Project Type:* ${typeText}\n` +
          `📐 *Floor Area:* ${sqft} sq.ft\n` +
          `🏢 *Floors:* ${floors}\n` +
          `⭐ *Package:* ${pkgLabel}\n` +
          `✨ *Add-ons:* ${addonText}\n` +
          `💰 *Calculated Estimate:* ${currencyPrefix}${totalEstimated.toLocaleString()}\n` +
          `----------------------------------------\n` +
          `Hello Dilan Construction, I calculated this preliminary estimate on your official website. Could we arrange a free site inspection and official BOQ?`;
      }
      btnWhatsappCalc.href = `https://wa.me/94769758173?text=${encodeURIComponent(fullMsg)}`;
    }
  }

  // Bind Calculator inputs
  if (calcSqftRange && calcSqftInput) {
    calcSqftRange.addEventListener('input', (e) => {
      calcSqftInput.value = e.target.value;
      calculateEstimate();
    });

    calcSqftInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) val = 500;
      if (val > 10000) val = 10000;
      calcSqftRange.value = val;
      calculateEstimate();
    });
  }

  if (calcType) calcType.addEventListener('change', calculateEstimate);
  if (calcFloors) calcFloors.addEventListener('change', calculateEstimate);
  if (calcPackage) calcPackage.addEventListener('change', calculateEstimate);
  calcAddons.forEach(cb => cb.addEventListener('change', calculateEstimate));

  /* ==========================================================================
     6. Services Filter Tabs
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     7. Image Lightbox Modal (For Flyer & Portfolio)
     ========================================================================== */
  function openLightbox(src, caption) {
    if (modalImg && imageModal) {
      modalImg.src = src;
      if (modalCaption) modalCaption.textContent = caption || '';
      imageModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (imageModal) {
      imageModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeLightbox);
  }

  if (imageModal) {
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal && imageModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach Lightbox to Flyer Images
  document.querySelectorAll('.open-flyer-modal').forEach(el => {
    el.addEventListener('click', () => {
      openLightbox('assets/images/flyer.jpg', 'Dilan Construction & Enterprises - Official Promotional Flyer');
    });
  });

  // Attach Lightbox to Portfolio cards
  document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.portfolio-img');
      const title = card.querySelector('.portfolio-title');
      if (img) {
        openLightbox(img.src, title ? title.textContent : 'Dilan Construction Completed Project');
      }
    });
  });

  /* ==========================================================================
     8. FAQ Accordion
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(otherItem => otherItem.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* ==========================================================================
     9. Stats Animated Counter on Scroll (Smooth Eased Animation)
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedStats) {
        animatedStats = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
          const suffix = stat.getAttribute('data-suffix') || '';
          const duration = 1800; // ms
          let startTimestamp = null;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // Smooth easeOutCubic: 1 - (1 - progress)^3
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);
            stat.textContent = current + suffix;

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              stat.textContent = target + suffix;
            }
          };

          window.requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statsObserver.observe(statsBar);

  /* ==========================================================================
     10. Contact Form Submission (WhatsApp & Direct Routing)
     ========================================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
      const location = document.getElementById('contact-location').value.trim();
      const serviceSelect = document.getElementById('contact-service');
      const serviceText = serviceSelect && serviceSelect.selectedIndex >= 0
        ? serviceSelect.options[serviceSelect.selectedIndex].text
        : (serviceSelect ? serviceSelect.value : 'General Construction');
      const message = document.getElementById('contact-msg').value.trim();

      if (!name || !phone) {
        showToast(currentLang === 'si' ? 'කරුණාකර ඔබගේ නම සහ දුරකථන අංකය ඇතුළත් කරන්න' : 'Please provide your name and phone number');
        return;
      }

      // Format WhatsApp dispatch with all relevant user details
      let fullMsg = '';
      if (currentLang === 'si') {
        fullMsg = `*Dilan Construction & Enterprises - නව පාරිභෝගික විමසීමක්*\n` +
          `----------------------------------------\n` +
          `👤 *නම:* ${name}\n` +
          `📞 *දුරකථන අංකය:* ${phone}\n` +
          `📍 *ප්‍රදේශය / නගරය:* ${location || 'සඳහන් කර නැත'}\n` +
          `🏗️ *අවශ්‍ය සේවාව:* ${serviceText}\n` +
          `💬 *පණිවිඩය:* ${message || 'නොමිලේ උපදෙස් සහ මිල ගණන් ලබාගැනීමට කැමැත්තෙමි.'}\n` +
          `----------------------------------------\n` +
          `🌐 Dilan Construction නිල වෙබ් අඩවිය හරහා යොමු කරන ලදී.`;
      } else {
        fullMsg = `*Dilan Construction & Enterprises - New Customer Inquiry*\n` +
          `----------------------------------------\n` +
          `👤 *Name:* ${name}\n` +
          `📞 *Phone:* ${phone}\n` +
          `📍 *Location / City:* ${location || 'Not Specified'}\n` +
          `🏗️ *Service Requested:* ${serviceText}\n` +
          `💬 *Message:* ${message || 'Requesting free consultation and pricing details.'}\n` +
          `----------------------------------------\n` +
          `🌐 Submitted via Dilan Construction Official Website.`;
      }

      const waUrl = `https://wa.me/94769758173?text=${encodeURIComponent(fullMsg)}`;

      showToast(currentLang === 'si' ? 'WhatsApp වෙත යොමු කරමින් පවතී...' : 'Opening WhatsApp...');

      // Open directly without setTimeout to bypass browser popup blockers
      const waWin = window.open(waUrl, '_blank');
      if (!waWin || waWin.closed || typeof waWin.closed === 'undefined') {
        window.location.href = waUrl;
      }

      contactForm.reset();
    });
  }

  // Direct WhatsApp Button from Contact Area
  if (btnDirectWhatsapp) {
    btnDirectWhatsapp.addEventListener('click', () => {
      const defaultMsg = currentLang === 'si'
        ? "ආයුබෝවන් Dilan Construction & Enterprises, මම ඔබගේ ඉදිකිරීම් සහ සැලසුම් නිර්මාණ සේවාවන් පිළිබඳව විමසීමට කැමැත්තෙමි."
        : "Hello Dilan Construction & Enterprises, I would like to inquire about your construction and design services.";
      const waUrl = `https://wa.me/94769758173?text=${encodeURIComponent(defaultMsg)}`;
      const waWin = window.open(waUrl, '_blank');
      if (!waWin || waWin.closed || typeof waWin.closed === 'undefined') {
        window.location.href = waUrl;
      }
    });
  }

  // Service Cards action links: Dynamic WhatsApp inquiry in current language with specific service title
  document.querySelectorAll('.service-action-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const card = link.closest('.service-card');
      const serviceTitle = card ? card.querySelector('.service-title').textContent.trim() : 'Construction';
      let msg = '';
      if (currentLang === 'si') {
        msg = `ආයුබෝවන් Dilan Construction, මම ඔබගේ '${serviceTitle}' සේවාව පිළිබඳව විස්තර සහ මිල ගණන් දැනගැනීමට කැමැත්තෙමි.`;
      } else {
        msg = `Hello Dilan Construction, I would like to inquire about your '${serviceTitle}' service and pricing details.`;
      }
      const waUrl = `https://wa.me/94769758173?text=${encodeURIComponent(msg)}`;
      const waWin = window.open(waUrl, '_blank');
      if (!waWin || waWin.closed || typeof waWin.closed === 'undefined') {
        window.location.href = waUrl;
      }
    });
  });

  /* ==========================================================================
     11. Toast Notification Utility
     ========================================================================== */
  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Pre-load default state
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  applyLanguage(currentLang);
  applyTheme(currentTheme);
  calculateEstimate();
});
