const revealItems = document.querySelectorAll('.reveal');

const animateScrollTo = (targetY, duration = 950) => {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + diff * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const header = document.querySelector('.site-header');
    const headerOffset = header ? header.offsetHeight + 14 : 14;
    const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    animateScrollTo(Math.max(0, targetY));
  });
});

const menuToggle = document.querySelector('#menu-toggle');
const mainNav = document.querySelector('#main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
  });
});

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 0.07, 0.35)}s`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const newsletter = document.querySelector('.newsletter');
if (newsletter) {
  newsletter.addEventListener('submit', (event) => {
    event.preventDefault();
    const button = newsletter.querySelector('button');
    if (!button) return;
    const originalText = button.textContent;
    button.textContent = 'Thanks!';
    setTimeout(() => {
      button.textContent = originalText;
      newsletter.reset();
    }, 1400);
  });
}

const aboutMainImage = document.querySelector('#about-main-image');
const aboutThumb1 = document.querySelector('#about-thumb-1');
const aboutThumb2 = document.querySelector('#about-thumb-2');
const aboutPrev = document.querySelector('#about-prev');
const aboutNext = document.querySelector('#about-next');

if (aboutMainImage && aboutThumb1 && aboutThumb2 && aboutPrev && aboutNext) {
  const aboutSliderImages = [
    'pottery images/pottery14.jpeg',
    'pottery images/pottery15.jpeg',
    'pottery images/pottery16.jpeg',
    'pottery images/pottery17.jpeg'
  ];

  let aboutCurrentIndex = 0;

  const renderAboutSlider = () => {
    const nextIndex = (aboutCurrentIndex + 1) % aboutSliderImages.length;
    const thirdIndex = (aboutCurrentIndex + 2) % aboutSliderImages.length;

    aboutMainImage.src = aboutSliderImages[aboutCurrentIndex];
    aboutThumb1.src = aboutSliderImages[nextIndex];
    aboutThumb2.src = aboutSliderImages[thirdIndex];
  };

  aboutPrev.addEventListener('click', () => {
    aboutCurrentIndex = (aboutCurrentIndex - 1 + aboutSliderImages.length) % aboutSliderImages.length;
    renderAboutSlider();
  });

  aboutNext.addEventListener('click', () => {
    aboutCurrentIndex = (aboutCurrentIndex + 1) % aboutSliderImages.length;
    renderAboutSlider();
  });

  renderAboutSlider();
}

const galleryTrack = document.querySelector('#gallery-track');
const galleryViewport = document.querySelector('#gallery-viewport');
const galleryPrev = document.querySelector('#gallery-prev');
const galleryNext = document.querySelector('#gallery-next');

if (galleryTrack && galleryViewport && galleryPrev && galleryNext) {
  const galleryImages = [
    'pottery images/perfriendly.jpg',
    'pottery images/pottery1.jpeg',
    'pottery images/pottery2.jpeg',
    'pottery images/pottery3.jpeg',
    'pottery images/pottery4.jpeg',
    'pottery images/pottery5.jpeg',
    'pottery images/pottery6.jpeg',
    'pottery images/pottery7.jpeg',
    'pottery images/pottery8.jpeg',
    'pottery images/pottery9.jpeg',
    'pottery images/pottery10.jpeg',
    'pottery images/pottery11.jpeg',
    'pottery images/pottery12.jpeg',
    'pottery images/pottery13.jpeg',
    'pottery images/pottery14.jpeg',
    'pottery images/pottery15.jpeg',
    'pottery images/pottery16.jpeg',
    'pottery images/pottery17.jpeg'
  ];

  let visibleCount = 3;
  let cloneCount = 3;
  let currentIndex = 3;
  let slideStep = 33.3333;
  let autoTimer;
  let touchStartX = 0;

  const getVisibleCount = () => {
    if (window.innerWidth <= 760) return 1;
    if (window.innerWidth <= 1180) return 2;
    return 3;
  };

  const updateTrackPosition = (withAnimation = true) => {
    galleryTrack.style.transition = withAnimation ? 'transform 0.8s ease' : 'none';
    galleryTrack.style.transform = `translateX(-${currentIndex * slideStep}%)`;
  };

  const buildCarousel = () => {
    visibleCount = getVisibleCount();
    cloneCount = visibleCount;
    slideStep = 100 / visibleCount;

    const prepended = galleryImages.slice(-cloneCount);
    const appended = galleryImages.slice(0, cloneCount);
    const fullList = [...prepended, ...galleryImages, ...appended];

    galleryTrack.innerHTML = fullList
      .map(
        (src, index) =>
          `<div class="carousel-slide" style="flex-basis:${slideStep}%"><img src="${src}" alt="Red Earth studio pottery gallery image ${index + 1}" draggable="false"></div>`
      )
      .join('');

    currentIndex = cloneCount;
    updateTrackPosition(false);
  };

  const goNext = () => {
    currentIndex += 1;
    updateTrackPosition(true);
  };

  const goPrev = () => {
    currentIndex -= 1;
    updateTrackPosition(true);
  };

  const restartAutoplay = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(goNext, 3000);
  };

  galleryTrack.addEventListener('transitionend', () => {
    if (currentIndex >= galleryImages.length + cloneCount) {
      currentIndex = cloneCount;
      updateTrackPosition(false);
    }

    if (currentIndex < cloneCount) {
      currentIndex = galleryImages.length + cloneCount - 1;
      updateTrackPosition(false);
    }
  });

  galleryNext.addEventListener('click', () => {
    goNext();
    restartAutoplay();
  });

  galleryPrev.addEventListener('click', () => {
    goPrev();
    restartAutoplay();
  });

  galleryViewport.addEventListener(
    'touchstart',
    (event) => {
      touchStartX = event.touches[0].clientX;
    },
    { passive: true }
  );

  galleryViewport.addEventListener('touchend', (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) < 45) return;

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
    restartAutoplay();
  });

  window.addEventListener('resize', () => {
    buildCarousel();
  });

  buildCarousel();
  restartAutoplay();
}

const lightbox = document.querySelector('#image-lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxClose = document.querySelector('#lightbox-close');

// Paste your deployed Google Apps Script Web App URL here.
const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxbEAXH6PiMhnIYpX-J0cLfpvI8lZdSdtLkHFa4RI-RPZ9uL-D9kg1Ti1Ry42c8Slzt/exec';

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';

    if (!GOOGLE_SHEET_WEB_APP_URL) {
      contactStatus.textContent = 'Form endpoint not configured yet.';
      return;
    }

    const formData = new FormData(contactForm);

    const payload = new URLSearchParams({
      name: String(formData.get('name') || ''),
      contact: String(formData.get('contact') || ''),
      email: String(formData.get('email') || ''),
      remark: String(formData.get('remark') || '')
    });

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      await fetch(GOOGLE_SHEET_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: payload.toString()
      });

      contactStatus.textContent = 'Thanks. Your message has been submitted.';
      contactForm.reset();
    } catch (error) {
      contactStatus.textContent = 'Unable to submit right now. Please try again.';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
}

if (lightbox && lightboxImage && lightboxClose) {
  const clickableImages = Array.from(document.querySelectorAll('img')).filter((img) => {
    if (img.closest('.brand')) return false;
    if (img.closest('.footer-brand')) return false;
    return true;
  });

  clickableImages.forEach((img) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || 'Expanded image preview';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}
