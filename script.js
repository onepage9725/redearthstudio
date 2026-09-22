const revealItems = document.querySelectorAll('.reveal');

const animateScrollTo = (targetY, duration = 650) => {
  const startY = window.scrollY;
  const diff = targetY - startY;
  const startTime = performance.now();

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const tick = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
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
  let touchStartY = 0;
  let lastViewportWidth = window.innerWidth;

  const getVisibleCount = () => {
    if (window.innerWidth <= 760) return 1;
    if (window.innerWidth <= 1180) return 2;
    return 3;
  };

  const updateTrackPosition = (withAnimation = true) => {
    galleryTrack.style.transition = withAnimation ? 'transform 0.8s ease' : 'none';
    galleryTrack.style.transform = `translateX(-${currentIndex * slideStep}%)`;
  };

  const getLogicalIndex = () =>
    ((currentIndex - cloneCount) % galleryImages.length + galleryImages.length) % galleryImages.length;

  const buildCarousel = (preservePosition = true) => {
    const activeLogicalIndex = preservePosition ? getLogicalIndex() : 0;

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

    currentIndex = cloneCount + activeLogicalIndex;
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
      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  galleryViewport.addEventListener('touchend', (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    const deltaY = event.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (Math.abs(deltaX) < 45) return;

    if (deltaX < 0) {
      goNext();
    } else {
      goPrev();
    }
    restartAutoplay();
  });

  window.addEventListener('resize', () => {
    const widthDelta = Math.abs(window.innerWidth - lastViewportWidth);
    if (widthDelta < 2) return;

    lastViewportWidth = window.innerWidth;

    if (visibleCount !== getVisibleCount()) {
      buildCarousel(true);
      return;
    }

    updateTrackPosition(false);
  });

  buildCarousel();
  restartAutoplay();
}

const lightbox = document.querySelector('#image-lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxClose = document.querySelector('#lightbox-close');

const WHATSAPP_NUMBER = '60187639956';

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

if (contactForm && contactStatus) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    const name = String(formData.get('name') || '').trim();
    const contact = String(formData.get('contact') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const remark = String(formData.get('remark') || '').trim();

    const message = [
      'Hi Red Earth Studio,',
      'I am interested to join Red Earth Studio.',
      '',
      `Name: ${name}`,
      `Phone: ${contact}`,
      `Email: ${email}`,
      `Message: ${remark || '-'}`
    ].join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Opening WhatsApp...';
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    contactStatus.textContent = 'WhatsApp opened with your message. Please send it to complete your enquiry.';

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }, 600);
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
