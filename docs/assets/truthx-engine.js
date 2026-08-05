(() => {
  const tabs = [...document.querySelectorAll('[data-tx-mode]')];
  const panels = [...document.querySelectorAll('[data-tx-panel]')];
  if (!tabs.length || !panels.length) return;

  const selectMode = mode => {
    tabs.forEach(tab => {
      const selected = tab.dataset.txMode === mode;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.txPanel !== mode;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectMode(tab.dataset.txMode));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      selectMode(tabs[next].dataset.txMode);
    });
  });

  const hash = new URLSearchParams(window.location.search).get('mode');
  if (hash && tabs.some(tab => tab.dataset.txMode === hash)) selectMode(hash);
})();
