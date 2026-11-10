const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 35);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  mainNav.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuToggle.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  mainNav.classList.toggle('open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});

mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mainNav.classList.contains('open')) closeMenu();
});

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const gallery = document.querySelector('[data-gallery]');
const galleryMore = document.querySelector('[data-gallery-more]');
galleryMore.addEventListener('click', () => {
  const expanded = gallery.classList.toggle('expanded');
  galleryMore.setAttribute('aria-expanded', String(expanded));
  galleryMore.innerHTML = expanded
    ? 'Ver menos fotografías <span aria-hidden="true">↑</span>'
    : 'Ver más fotografías <span aria-hidden="true">↓</span>';
});

const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const galleryItems = [...document.querySelectorAll('.gallery-item')];
let activeImage = 0;

const showImage = (index) => {
  activeImage = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeImage];
  const source = item.dataset.full;
  const caption = item.dataset.caption || item.querySelector('img').alt;
  lightboxImage.src = source;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
};

galleryItems.forEach((item, index) => item.addEventListener('click', () => {
  showImage(index);
  lightbox.showModal();
  document.body.classList.add('lightbox-open');
}));

const closeLightbox = () => {
  lightbox.close();
  document.body.classList.remove('lightbox-open');
};
document.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
document.querySelector('[data-lightbox-prev]').addEventListener('click', () => showImage(activeImage - 1));
document.querySelector('[data-lightbox-next]').addEventListener('click', () => showImage(activeImage + 1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
lightbox.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showImage(activeImage - 1);
  if (event.key === 'ArrowRight') showImage(activeImage + 1);
});

const testimonials = [...document.querySelectorAll('.testimonial')];
const testimonialsTrack = document.querySelector('[data-testimonials]');
const testimonialsSection = testimonialsTrack.closest('.testimonials-section');
const testimonialCounter = document.querySelector('[data-testimonial-counter]');
const testimonialPrev = document.querySelector('[data-testimonial-prev]');
const testimonialNext = document.querySelector('[data-testimonial-next]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const TESTIMONIAL_DELAY = 6000;
const TESTIMONIAL_TRANSITION = 700;
let activeTestimonial = 0;
let testimonialTimer;
let testimonialAnimating = false;
let testimonialsInView = false;
let testimonialsHovered = false;
let testimonialsFocused = false;
let swipeStartX = null;
let swipeStartY = null;

testimonials.forEach((testimonial, index) => {
  testimonial.setAttribute('role', 'group');
  testimonial.setAttribute('aria-label', `${index + 1} de ${testimonials.length}`);
  testimonial.setAttribute('aria-hidden', String(index !== activeTestimonial));
});

const updateTestimonial = (nextIndex, direction = 'next') => {
  const normalizedIndex = (nextIndex + testimonials.length) % testimonials.length;
  if (testimonialAnimating || normalizedIndex === activeTestimonial) return false;

  const currentTestimonial = testimonials[activeTestimonial];
  const nextTestimonial = testimonials[normalizedIndex];
  const incomingClass = direction === 'prev' ? 'from-left' : 'from-right';
  const outgoingClass = direction === 'prev' ? 'slide-out-right' : 'slide-out-left';

  testimonialAnimating = true;
  nextTestimonial.classList.add(incomingClass);
  nextTestimonial.getBoundingClientRect();
  currentTestimonial.classList.add(outgoingClass);
  nextTestimonial.classList.add('active');
  nextTestimonial.classList.remove(incomingClass);

  currentTestimonial.setAttribute('aria-hidden', 'true');
  nextTestimonial.setAttribute('aria-hidden', 'false');
  activeTestimonial = normalizedIndex;
  testimonialCounter.textContent = `${String(activeTestimonial + 1).padStart(2, '0')} / ${String(testimonials.length).padStart(2, '0')}`;

  window.setTimeout(() => {
    currentTestimonial.classList.remove('active', outgoingClass);
    testimonialAnimating = false;
  }, reducedMotion.matches ? 20 : TESTIMONIAL_TRANSITION);

  return true;
};

const stopTestimonialAutoplay = () => {
  window.clearInterval(testimonialTimer);
  testimonialTimer = undefined;
};

const canAutoplayTestimonials = () => (
  testimonials.length > 1 &&
  testimonialsInView &&
  !testimonialsHovered &&
  !testimonialsFocused &&
  !document.hidden &&
  !reducedMotion.matches
);

const startTestimonialAutoplay = () => {
  stopTestimonialAutoplay();
  if (!canAutoplayTestimonials()) return;
  testimonialTimer = window.setInterval(() => {
    updateTestimonial(activeTestimonial + 1, 'next');
  }, TESTIMONIAL_DELAY);
};

const moveTestimonial = (step) => {
  const moved = updateTestimonial(activeTestimonial + step, step < 0 ? 'prev' : 'next');
  if (moved) startTestimonialAutoplay();
};

testimonialPrev.addEventListener('click', () => moveTestimonial(-1));
testimonialNext.addEventListener('click', () => moveTestimonial(1));

testimonialsSection.addEventListener('mouseenter', () => {
  testimonialsHovered = true;
  stopTestimonialAutoplay();
});
testimonialsSection.addEventListener('mouseleave', () => {
  testimonialsHovered = false;
  startTestimonialAutoplay();
});
testimonialsSection.addEventListener('focusin', () => {
  testimonialsFocused = true;
  stopTestimonialAutoplay();
});
testimonialsSection.addEventListener('focusout', () => {
  window.requestAnimationFrame(() => {
    testimonialsFocused = testimonialsSection.contains(document.activeElement);
    startTestimonialAutoplay();
  });
});

testimonialsTrack.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'touch') return;
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
});
testimonialsTrack.addEventListener('pointerup', (event) => {
  if (swipeStartX === null || swipeStartY === null) return;
  const distanceX = event.clientX - swipeStartX;
  const distanceY = event.clientY - swipeStartY;
  swipeStartX = null;
  swipeStartY = null;
  if (Math.abs(distanceX) > 45 && Math.abs(distanceX) > Math.abs(distanceY)) {
    moveTestimonial(distanceX < 0 ? 1 : -1);
  }
});
testimonialsTrack.addEventListener('pointercancel', () => {
  swipeStartX = null;
  swipeStartY = null;
});

const testimonialObserver = new IntersectionObserver(([entry]) => {
  testimonialsInView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
  if (testimonialsInView) startTestimonialAutoplay();
  else stopTestimonialAutoplay();
}, { threshold: [0, 0.35] });
testimonialObserver.observe(testimonialsSection);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopTestimonialAutoplay();
  else startTestimonialAutoplay();
});

const checkin = document.querySelector('#checkin');
const checkout = document.querySelector('#checkout');
const today = new Date();
const timezoneOffset = today.getTimezoneOffset() * 60000;
const todayLocal = new Date(today.getTime() - timezoneOffset).toISOString().split('T')[0];
checkin.min = todayLocal;
checkout.min = todayLocal;

checkin.addEventListener('change', () => {
  checkout.min = checkin.value || todayLocal;
  if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${dateString}T00:00:00Z`));
};

document.querySelector('[data-booking-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const lines = [
    'Hola Cabañas El Pinar, quisiera consultar disponibilidad:',
    '',
    `Nombre: ${data.get('name')}`,
    `Teléfono: ${data.get('phone')}`,
    data.get('email') ? `Correo: ${data.get('email')}` : null,
    `Llegada: ${formatDate(data.get('checkin'))}`,
    `Salida: ${formatDate(data.get('checkout'))}`,
    `Huéspedes: ${data.get('guests')}`,
    `Mascotas: ${data.get('pets')}`,
    data.get('message') ? `Mensaje: ${data.get('message')}` : null,
    '',
    '¿Me pueden confirmar tarifa y disponibilidad?'
  ].filter(Boolean);

  document.querySelector('[data-form-note]').textContent = 'Abriendo WhatsApp con tu solicitud…';
  window.open(`https://wa.me/56986226060?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
