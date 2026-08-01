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
})();
