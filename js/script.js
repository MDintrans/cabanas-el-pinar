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
const testimonialCounter = document.querySelector('[data-testimonial-counter]');
let activeTestimonial = 0;

const updateTestimonial = (nextIndex) => {
  testimonials[activeTestimonial].classList.remove('active');
  activeTestimonial = (nextIndex + testimonials.length) % testimonials.length;
  testimonials[activeTestimonial].classList.add('active');
  testimonialCounter.textContent = `${String(activeTestimonial + 1).padStart(2, '0')} / ${String(testimonials.length).padStart(2, '0')}`;
};
document.querySelector('[data-testimonial-prev]').addEventListener('click', () => updateTestimonial(activeTestimonial - 1));
document.querySelector('[data-testimonial-next]').addEventListener('click', () => updateTestimonial(activeTestimonial + 1));

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
