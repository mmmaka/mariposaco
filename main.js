// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Scroll reveal animation
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));

// Contact form (Netlify Forms, submitted without leaving the page)
const form = document.querySelector('.contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const btn = form.querySelector('button[type="submit"]');

  const messages = {
    name: 'Please add your name.',
    email: 'Please add your email so I can reply.',
    emailFormat: 'That email looks incomplete. Check for a typo?',
    service: 'Pick what you need help with.',
    message: 'Tell me a little about your project.'
  };

  // one error line under each required field
  const fields = [...form.querySelectorAll('[required]')];
  fields.forEach((field) => {
    const err = document.createElement('span');
    err.className = 'field-error';
    err.id = field.name + '-error';
    err.hidden = true;
    field.insertAdjacentElement('afterend', err);
    field.setAttribute('aria-describedby', err.id);
    const clear = () => { if (field.classList.contains('is-invalid')) check(field); };
    field.addEventListener('input', clear);
    field.addEventListener('change', clear);
  });

  function check(field) {
    const err = document.getElementById(field.name + '-error');
    let msg = '';
    if (!field.value.trim()) msg = messages[field.name];
    else if (field.type === 'email' && !field.validity.valid) msg = messages.emailFormat;
    field.classList.toggle('is-invalid', !!msg);
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    err.textContent = msg;
    err.hidden = !msg;
    return !msg;
  }

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('', '');
    const invalid = fields.filter((f) => !check(f));
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    btn.disabled = true;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("Got it! I'll be in touch within 48 hours.", 'success');
      btn.disabled = false;
    } catch {
      setStatus("Something went wrong sending that. Email me at studio@themariposa.co and I'll get right back to you.", 'error');
      btn.disabled = false;
    }
  });
}