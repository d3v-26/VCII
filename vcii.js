const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const siteHead = document.querySelector('.site-head');

const syncNavDepth = () => siteHead?.classList.toggle('scrolled', window.scrollY > 24);
syncNavDepth();
window.addEventListener('scroll', syncNavDepth, { passive: true });

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

const interestLinks = document.querySelectorAll('[data-interest]');
const interestSelect = document.querySelector('#interest');
interestLinks.forEach((link) => link.addEventListener('click', () => {
  if (interestSelect) interestSelect.value = link.dataset.interest;
}));

const inquiryForm = document.querySelector('#inquiry-form');
if (inquiryForm) {
  inquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const f = new FormData(inquiryForm);
    const interestLabel = inquiryForm.querySelector('#interest')?.selectedOptions[0]?.textContent || f.get('interest');
    const subject = `VCII inquiry: ${interestLabel} from ${f.get('name')}`;
    const body = [
      `Name: ${f.get('name')}`,
      `Email: ${f.get('email')}`,
      `Institution or affiliation: ${f.get('affiliation') || '-'}`,
      `Area of interest: ${interestLabel}`,
      '',
      f.get('message'),
    ].join('\n');
    window.location.href = `mailto:${inquiryForm.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const success = inquiryForm.querySelector('.form-success');
    success?.classList.add('show');
    success?.focus();
  });
}

// Dropdowns: hover opens on desktop; click/tap toggles everywhere; Escape and outside click close.
const navTops = document.querySelectorAll('.nav-top');
const closeAll = (except) => navTops.forEach((b) => { if (b !== except) { b.closest('.has-sub').classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
navTops.forEach((btn) => btn.addEventListener('click', (event) => {
  event.stopPropagation();
  closeAll(btn);
  const open = btn.closest('.has-sub').classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
}));
document.addEventListener('click', () => closeAll());
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

