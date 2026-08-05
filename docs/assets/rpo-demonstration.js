(() => {
  const page = document.querySelector('[data-rpo-demo-page]');
  if (!page) return;

  const isFrench = document.documentElement.lang.toLowerCase().startsWith('fr');
  const source = page.dataset.demoSrc;
  const copy = isFrench
    ? {
        unavailable: 'La démonstration publique est momentanément indisponible.',
        copied: 'COPIÉ',
        copy: 'COPIER LE JSON',
        readable: 'LISIBLE',
        invalid: 'JSON INVALIDE',
        complete: 'STRUCTURE DE BASE PRÉSENTE',
        incomplete: 'STRUCTURE INCOMPLÈTE',
        unchanged: 'COPIE IDENTIQUE À LA RÉFÉRENCE',
        changed: 'MODIFICATION DÉTECTÉE',
        ready: 'DÉMONSTRATION PRÊTE',
        error: 'VÉRIFICATION IMPOSSIBLE',
        simulated: 'Une phrase de démonstration a été modifiée.',
        evidence: count => `${count} RÉFÉRENCES`,
        restored: 'La copie publique d’origine a été restaurée.'
      }
    : {
        unavailable: 'The public demonstration is temporarily unavailable.',
        copied: 'COPIED',
        copy: 'COPY JSON',
        readable: 'READABLE',
        invalid: 'INVALID JSON',
        complete: 'BASIC STRUCTURE PRESENT',
        incomplete: 'STRUCTURE INCOMPLETE',
        unchanged: 'IDENTICAL TO REFERENCE COPY',
        changed: 'CHANGE DETECTED',
        ready: 'DEMONSTRATION READY',
        error: 'VERIFICATION FAILED',
        simulated: 'One demonstration sentence has been changed.',
        evidence: count => `${count} REFERENCES`,
        restored: 'The original public copy has been restored.'
      };

  const stable = value => {
    if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
    if (value && typeof value === 'object') {
      return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stable(value[key])).join(',') + '}';
    }
    return JSON.stringify(value);
  };

  const digest = async text => {
    const bytes = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return {
      bytes: bytes.byteLength,
      hex: [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('')
    };
  };

  const required = ['rpo_version', 'type', 'bundle_id', 'created_at', 'issuer', 'subject', 'evidence', 'narrative'];

  let originalText = '';
  let originalObject = null;
  let referenceHash = '';

  const fillExampleView = object => {
    const raw = document.querySelector('#demoJson');
    if (raw) raw.textContent = JSON.stringify(object, null, 2);

    const fields = {
      version: object.rpo_version || '—',
      bundle: object.bundle_id || '—',
      subject: object.subject?.name || '—',
      evidence: copy.evidence(Array.isArray(object.evidence) ? object.evidence.length : 0)
    };

    Object.entries(fields).forEach(([name, value]) => {
      document.querySelectorAll(`[data-demo-field="${name}"]`).forEach(element => {
        element.textContent = value;
      });
    });
  };

  const setState = (kind, label) => {
    const state = document.querySelector('#verificationState');
    if (!state) return;
    state.className = `verify-state ${kind || ''}`.trim();
    const text = state.querySelector('span');
    if (text) text.textContent = label;
  };

  const basicStructure = object => {
    const missing = required.filter(field => !(field in object));
    if (object.rpo_version !== '0.1') missing.push('rpo_version=0.1');
    if (object.type !== 'evidence_bundle') missing.push('type=evidence_bundle');
    if (!Array.isArray(object.evidence)) missing.push('evidence[]');
    return [...new Set(missing)];
  };

  const verifyText = async text => {
    const syntaxResult = document.querySelector('#syntaxResult');
    const structureResult = document.querySelector('#structureResult');
    const matchResult = document.querySelector('#matchResult');
    const hashResult = document.querySelector('#hashResult');
    const bytesResult = document.querySelector('#bytesResult');

    try {
      const object = JSON.parse(text);
      if (syntaxResult) syntaxResult.textContent = copy.readable;

      const missing = basicStructure(object);
      if (structureResult) {
        structureResult.textContent = missing.length
          ? `${copy.incomplete} · ${missing.join(', ')}`
          : copy.complete;
      }

      const result = await digest(stable(object));
      if (hashResult) hashResult.textContent = result.hex;
      if (bytesResult) bytesResult.textContent = result.bytes.toLocaleString(isFrench ? 'fr-FR' : 'en-GB');

      const matches = Boolean(referenceHash) && result.hex === referenceHash;
      if (matchResult) matchResult.textContent = matches ? copy.unchanged : copy.changed;

      if (missing.length) setState('warning', copy.incomplete);
      else if (matches) setState('success', copy.unchanged);
      else setState('warning', copy.changed);

      return object;
    } catch (error) {
      if (syntaxResult) syntaxResult.textContent = copy.invalid;
      if (structureResult) structureResult.textContent = '—';
      if (matchResult) matchResult.textContent = '—';
      if (hashResult) hashResult.textContent = '—';
      if (bytesResult) bytesResult.textContent = '—';
      setState('failure', copy.error);
      return null;
    }
  };

  const setEditor = text => {
    const editor = document.querySelector('#rpoEditor');
    if (editor) editor.value = text;
  };

  const runEditor = () => {
    const editor = document.querySelector('#rpoEditor');
    if (editor) verifyText(editor.value);
  };

  const load = async () => {
    if (!source) return;
    try {
      const response = await fetch(source, { cache: 'no-store' });
      if (!response.ok) throw new Error('demo fetch failed');
      originalText = await response.text();
      originalObject = JSON.parse(originalText);
      referenceHash = (await digest(stable(originalObject))).hex;

      fillExampleView(originalObject);
      setEditor(JSON.stringify(originalObject, null, 2));

      const reference = document.querySelector('#referenceHash');
      if (reference) reference.textContent = referenceHash;

      if (document.querySelector('#verificationState')) {
        await verifyText(JSON.stringify(originalObject, null, 2));
      }
    } catch (error) {
      const raw = document.querySelector('#demoJson');
      if (raw) raw.textContent = copy.unavailable;
      setState('failure', copy.error);
    }
  };

  document.querySelector('#copyDemoJson')?.addEventListener('click', async event => {
    if (!originalText) return;
    await navigator.clipboard.writeText(originalText);
    event.currentTarget.textContent = copy.copied;
    window.setTimeout(() => {
      event.currentTarget.textContent = copy.copy;
    }, 1200);
  });

  document.querySelectorAll('[data-action="check-original"]').forEach(button => {
    button.addEventListener('click', async () => {
      if (!originalObject) return;
      const text = JSON.stringify(originalObject, null, 2);
      setEditor(text);
      await verifyText(text);
    });
  });

  document.querySelectorAll('[data-action="mutate"]').forEach(button => {
    button.addEventListener('click', async () => {
      if (!originalObject) return;
      const changed = JSON.parse(JSON.stringify(originalObject));
      changed.narrative.summary = isFrench
        ? `${changed.narrative.summary} [DÉTAIL MODIFIÉ]`
        : `${changed.narrative.summary} [DETAIL CHANGED]`;
      const text = JSON.stringify(changed, null, 2);
      setEditor(text);
      await verifyText(text);

      const advanced = document.querySelector('.verify-advanced');
      if (advanced && !advanced.open) advanced.open = true;
      const note = document.querySelector('#simulationNote');
      if (note) note.textContent = copy.simulated;
    });
  });

  document.querySelectorAll('[data-action="restore"]').forEach(button => {
    button.addEventListener('click', async () => {
      if (!originalObject) return;
      const text = JSON.stringify(originalObject, null, 2);
      setEditor(text);
      await verifyText(text);
      const note = document.querySelector('#simulationNote');
      if (note) note.textContent = copy.restored;
    });
  });

  document.querySelector('#runVerification')?.addEventListener('click', runEditor);

  load();
})();
