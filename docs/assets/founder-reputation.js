(() => {
  const page = document.querySelector('.founder-page');
  if (!page) return;

  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointerQuery = matchMedia('(hover: hover) and (pointer: fine)');
  document.documentElement.classList.add('motion-ready');

  const revealItems = [
    ...page.querySelectorAll('[data-reveal]'),
    ...page.querySelectorAll('[data-reveal-group]')
  ];
  let observer = null;

  const revealAll = () => {
    revealItems.forEach(item => item.classList.add('is-visible'));
    observer?.disconnect();
    observer = null;
  };

  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -11% 0px',
      threshold: .08
    });

    revealItems.forEach(item => observer.observe(item));
  }

  const spotlightCards = [...page.querySelectorAll('[data-spotlight]')];
  const hero = page.querySelector('.founder-hero');
  const portrait = page.querySelector('.founder-portrait-card');
  let interactiveBound = false;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let portraitFrame = 0;
  let spotlightFrame = 0;
  let pendingSpotlight = null;

  const canUseMotion = () => !motionQuery.matches && finePointerQuery.matches;

  const renderPortrait = () => {
    currentX += (targetX - currentX) * .08;
    currentY += (targetY - currentY) * .08;
    if (portrait) {
      portrait.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) translate3d(${currentX * .28}px, ${currentY * -.22}px, 0)`;
    }

    if (Math.abs(targetX - currentX) > .01 || Math.abs(targetY - currentY) > .01) {
      portraitFrame = requestAnimationFrame(renderPortrait);
    } else {
      portraitFrame = 0;
    }
  };

  const requestPortraitFrame = () => {
    if (!portraitFrame) portraitFrame = requestAnimationFrame(renderPortrait);
  };

  const onHeroMove = event => {
    if (!interactiveBound || !hero) return;
    const rect = hero.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - .5) * 5;
    targetY = ((event.clientY - rect.top) / rect.height - .5) * -4;
    requestPortraitFrame();
  };

  const onHeroLeave = () => {
    targetX = 0;
    targetY = 0;
    requestPortraitFrame();
  };

  const renderSpotlight = () => {
    if (pendingSpotlight) {
      const { card, x, y } = pendingSpotlight;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${x - rect.left}px`);
      card.style.setProperty('--pointer-y', `${y - rect.top}px`);
    }
    pendingSpotlight = null;
    spotlightFrame = 0;
  };

  const onSpotlightMove = event => {
    if (!interactiveBound) return;
    pendingSpotlight = { card: event.currentTarget, x: event.clientX, y: event.clientY };
    if (!spotlightFrame) spotlightFrame = requestAnimationFrame(renderSpotlight);
  };

  const onSpotlightLeave = event => {
    event.currentTarget.style.removeProperty('--pointer-x');
    event.currentTarget.style.removeProperty('--pointer-y');
  };

  const enableInteractiveMotion = () => {
    if (interactiveBound || !canUseMotion()) return;
    interactiveBound = true;
    spotlightCards.forEach(card => {
      card.addEventListener('pointermove', onSpotlightMove, { passive: true });
      card.addEventListener('pointerleave', onSpotlightLeave, { passive: true });
    });
    hero?.addEventListener('pointermove', onHeroMove, { passive: true });
    hero?.addEventListener('pointerleave', onHeroLeave, { passive: true });
  };

  const disableInteractiveMotion = () => {
    if (!interactiveBound) return;
    interactiveBound = false;
    spotlightCards.forEach(card => {
      card.removeEventListener('pointermove', onSpotlightMove);
      card.removeEventListener('pointerleave', onSpotlightLeave);
      card.style.removeProperty('--pointer-x');
      card.style.removeProperty('--pointer-y');
    });
    hero?.removeEventListener('pointermove', onHeroMove);
    hero?.removeEventListener('pointerleave', onHeroLeave);
    if (portraitFrame) cancelAnimationFrame(portraitFrame);
    if (spotlightFrame) cancelAnimationFrame(spotlightFrame);
    portraitFrame = 0;
    spotlightFrame = 0;
    pendingSpotlight = null;
    targetX = 0;
    targetY = 0;
    currentX = 0;
    currentY = 0;
    if (portrait) portrait.style.transform = '';
  };

  const syncMotionPreference = () => {
    if (motionQuery.matches) revealAll();
    if (canUseMotion()) enableInteractiveMotion();
    else disableInteractiveMotion();
  };

  motionQuery.addEventListener?.('change', syncMotionPreference);
  finePointerQuery.addEventListener?.('change', syncMotionPreference);
  syncMotionPreference();

  const contactForm = page.querySelector('[data-founder-contact-form]');
  if (contactForm) {
    const endpoint = 'https://truthx.co/api/subscribers';
    const field = name => contactForm.elements.namedItem(name);
    const interest = field('interest');
    const marketingConsent = field('marketingConsent');
    const submitButton = contactForm.querySelector('.founder-form-submit');
    const submitText = contactForm.querySelector('[data-submit-text]');
    const errorMessage = contactForm.querySelector('.founder-form-error');
    const successMessage = page.querySelector('[data-form-success]');
    const firstField = field('firstname');

    const syncMarketingConsent = () => {
      const required = interest?.value === 'proof-briefs';
      if (!marketingConsent) return;
      marketingConsent.required = required;
      marketingConsent.setAttribute('aria-required', String(required));
    };

    const attributionSource = language => {
      const trackedParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      const search = new URLSearchParams(window.location.search);
      const attribution = trackedParams
        .map(key => [key, search.get(key)])
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

      return [
        `rpo.openproof.net:${window.location.pathname || '/'}`,
        'form=founder-contact',
        `lang=${language}`,
        attribution
      ].filter(Boolean).join('|');
    };

    interest?.addEventListener('change', syncMarketingConsent);
    syncMarketingConsent();

    page.querySelectorAll('[data-contact-focus]').forEach(link => {
      link.addEventListener('click', () => {
        window.setTimeout(() => firstField?.focus({ preventScroll: true }), motionQuery.matches ? 0 : 550);
      });
    });

    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      syncMarketingConsent();
      if (!contactForm.reportValidity()) return;

      const language = contactForm.dataset.language === 'en' ? 'en' : 'fr';
      const formData = new FormData(contactForm);
      const firstName = String(formData.get('firstname') || '').trim();
      const lastName = String(formData.get('lastname') || '').trim();
      const email = String(formData.get('email') || '').trim().toLowerCase();
      const company = String(formData.get('company') || '').trim();
      const selectedInterest = String(formData.get('interest') || 'partnership');
      const processingConsent = formData.get('processingConsent') === 'on';
      const publicationsConsent = formData.get('marketingConsent') === 'on';
      const website = String(formData.get('website') || '').trim();

      submitButton.disabled = true;
      submitText.textContent = contactForm.dataset.sendingLabel || submitText.textContent;
      errorMessage.textContent = '';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            name: [firstName, lastName].filter(Boolean).join(' '),
            email,
            company,
            interest: selectedInterest,
            consent: processingConsent,
            processingConsent,
            marketingConsent: publicationsConsent,
            source: attributionSource(language),
            language,
            pageUri: window.location.href,
            pageName: contactForm.dataset.pageName || document.title,
            hubspotUtk: '',
            website
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message = response.status === 400 && result.error
            ? result.error
            : contactForm.dataset.errorLabel;
          throw new Error(message);
        }

        contactForm.hidden = true;
        if (successMessage) {
          successMessage.hidden = false;
          successMessage.focus({ preventScroll: true });
        }
      } catch (error) {
        errorMessage.textContent = error instanceof Error && error.message
          ? error.message
          : contactForm.dataset.errorLabel;
      } finally {
        submitButton.disabled = false;
        submitText.textContent = contactForm.dataset.submitLabel || submitText.textContent;
      }
    });
  }
})();
