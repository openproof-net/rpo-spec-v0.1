(()=>{
  const menu=document.querySelector('.menu');
  const links=document.querySelector('.links');

  if(menu&&links){
    menu.onclick=()=>{
      links.classList.toggle('open');
      menu.setAttribute('aria-expanded',links.classList.contains('open'));
    };
  }

  const stages=[...document.querySelectorAll('.stage')];
  const tabs=[...document.querySelectorAll('.rail button')];
  const prev=document.querySelector('[data-prev]');
  const next=document.querySelector('[data-next]');
  if(!stages.length||!prev||!next)return;
  let at=0;
  window.opShow=(n)=>{
    at=Math.max(0,Math.min(stages.length-1,n));
    stages.forEach((stage,index)=>stage.classList.toggle('active',index===at));
    tabs.forEach((tab,index)=>tab.classList.toggle('active',index===at));
    prev.disabled=at===0;
    const isFrench=document.documentElement.lang==='fr';
    next.textContent=at===stages.length-1?(isFrench?'Retour à la vue d’ensemble ↺':'Return to overview ↺'):(isFrench?'Continuer →':'Continue →');
    if(innerWidth<880)document.querySelector('.mainGrid')?.scrollIntoView({behavior:'smooth'});
  };
  tabs.forEach((tab,index)=>tab.onclick=()=>opShow(index));
  prev.onclick=()=>opShow(at-1);
  next.onclick=()=>opShow(at===stages.length-1?0:at+1);
  document.querySelectorAll('.pill').forEach(pill=>pill.onclick=()=>pill.classList.toggle('selected'));
  opShow(0);
})();

(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('canvas.stars').forEach(canvas=>{
    const host=canvas.parentElement;
    const ctx=canvas.getContext('2d',{alpha:true});
    let w=0,h=0,dpr=Math.min(devicePixelRatio||1,2),stars=[];
    const make=()=>({x:Math.random()*w,y:Math.random()*h,r:.3+Math.random()*1.25,a:.18+Math.random()*.62,vx:(Math.random()-.5)*.055,vy:(Math.random()-.5)*.055,t:Math.random()});
    function resize(){
      const rect=host.getBoundingClientRect();
      w=rect.width;h=rect.height;
      canvas.width=Math.max(1,Math.floor(w*dpr));
      canvas.height=Math.max(1,Math.floor(h*dpr));
      canvas.style.width=w+'px';
      canvas.style.height=h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      stars=Array.from({length:Math.min(260,Math.max(90,Math.floor(w*h/8500)))},make);
    }
    function draw(){
      ctx.clearRect(0,0,w,h);
      for(const star of stars){
        if(!reduce){star.x+=star.vx;star.y+=star.vy;}
        if(star.x<0)star.x=w;if(star.x>w)star.x=0;
        if(star.y<0)star.y=h;if(star.y>h)star.y=0;
        const color=star.t<.22?'209,170,92':star.t<.38?'225,193,123':'238,233,220';
        ctx.beginPath();
        ctx.fillStyle='rgba('+color+','+star.a+')';
        ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
        ctx.fill();
      }
      if(!reduce)requestAnimationFrame(draw);
    }
    new ResizeObserver(resize).observe(host);
    resize();
    draw();
  });
})();

(() => {
  const links = document.querySelector('.links');
  if (!links) return;

  const isFrench = document.documentElement.lang === 'fr';
  const base = isFrench ? '/fr/truthx-engine/' : '/truthx-engine/';
  const items = isFrench
    ? [
        ['Vue d’ensemble', '#overview'],
        ['Deux modes d’intervention', '#modes'],
        ['Contrôles d’intégrité', '#controls'],
        ['Applications', '#applications'],
        ['Paysage de recherche', '#landscape']
      ]
    : [
        ['Overview', '#overview'],
        ['Two operating modes', '#modes'],
        ['Integrity controls', '#controls'],
        ['Applications', '#applications'],
        ['Research landscape', '#landscape']
      ];

  let nav = links.querySelector('[data-truthx-nav]');
  if (!nav) {
    nav = document.createElement('div');
    nav.className = 'truthx-nav';
    nav.dataset.truthxNav = '';
    nav.innerHTML = `
      <a class="truthx-nav-main" href="${base}">TruthX Engine</a>
      <button class="truthx-nav-toggle" type="button" aria-expanded="false" aria-label="${isFrench ? 'Ouvrir les sections TruthX Engine' : 'Open TruthX Engine sections'}">⌄</button>
      <div class="truthx-nav-menu">
        ${items.map(([label, hash]) => `<a href="${base}${hash}">${label}</a>`).join('')}
      </div>`;
    const founder = [...links.children].find(element =>
      element.tagName === 'A' && element.getAttribute('href')?.includes('gersende-de-parcey')
    );
    links.insertBefore(nav, founder || links.lastElementChild);
  }

  if (location.pathname.includes('/truthx-engine/')) {
    nav.querySelector('.truthx-nav-main')?.setAttribute('aria-current', 'page');
  }

  if (!document.getElementById('truthx-nav-styles')) {
    const style = document.createElement('style');
    style.id = 'truthx-nav-styles';
    style.textContent = `
      .truthx-nav{position:relative;display:flex;align-items:center;gap:3px}
      .truthx-nav-main{white-space:nowrap}
      .truthx-nav-toggle{border:0;background:transparent;color:var(--muted);padding:5px 3px;cursor:pointer;font:600 .74rem Montserrat,sans-serif}
      .truthx-nav:hover .truthx-nav-toggle,.truthx-nav:focus-within .truthx-nav-toggle,.truthx-nav.is-open .truthx-nav-toggle{color:var(--pale)}
      .truthx-nav-menu{position:absolute;left:-14px;top:calc(100% + 14px);z-index:30;display:none;min-width:238px;padding:10px;border:1px solid var(--line);border-radius:14px;background:rgba(5,8,14,.98);box-shadow:0 22px 60px rgba(0,0,0,.48);backdrop-filter:blur(18px)}
      .truthx-nav-menu::before{content:"";position:absolute;left:0;right:0;top:-16px;height:16px}
      .truthx-nav-menu a{display:block;padding:9px 10px;border-radius:9px;white-space:nowrap;text-transform:none!important;letter-spacing:.02em!important;font-size:.76rem!important}
      .truthx-nav-menu a:hover,.truthx-nav-menu a:focus{background:rgba(212,175,55,.09);color:var(--pale)}
      .truthx-nav.is-open .truthx-nav-menu{display:grid}
      @media(min-width:881px){.truthx-nav:hover .truthx-nav-menu,.truthx-nav:focus-within .truthx-nav-menu{display:grid}}
      @media(max-width:880px){
        .truthx-nav{width:100%;display:grid;grid-template-columns:1fr auto;gap:0}
        .truthx-nav-main{padding:6px 0}
        .truthx-nav-toggle{padding:7px 10px}
        .truthx-nav-menu{position:static;grid-column:1/-1;min-width:0;width:100%;margin-top:4px;padding:7px;box-shadow:none;background:rgba(255,255,255,.025)}
        .truthx-nav-menu::before{display:none}
        .truthx-nav-menu a{padding:8px 10px}
      }`;
    document.head.append(style);
  }

  const toggle = nav.querySelector('.truthx-nav-toggle');
  const setOpen = open => {
    nav.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  toggle?.addEventListener('click', event => {
    event.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  });

  nav.querySelectorAll('.truthx-nav-menu a').forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setOpen(false);
      toggle?.focus();
    }
  });
})();

(() => {
  const page = document.querySelector('.founder-page');
  if (!page) return;

  const root = document.documentElement;
  const isFrench = root.lang.toLowerCase().startsWith('fr');

  // The site already provides authoritative FR and EN pages. Prevent browser
  // auto-translation from mixing the two versions after a manual language switch.
  root.setAttribute('translate', 'no');
  root.classList.add('notranslate');
  document.body?.setAttribute('translate', 'no');
  document.body?.classList.add('notranslate');
  let noTranslateMeta = document.querySelector('meta[name="google"]');
  if (!noTranslateMeta) {
    noTranslateMeta = document.createElement('meta');
    noTranslateMeta.name = 'google';
    document.head.append(noTranslateMeta);
  }
  noTranslateMeta.content = 'notranslate';

  // Keep the manual language routes explicit and the active state unambiguous.
  const frLink = document.querySelector('.language a[lang="fr"]');
  const enLink = document.querySelector('.language a[lang="en"]');
  if (frLink) {
    frLink.href = '/fr/gersende-de-parcey.html';
    frLink.toggleAttribute('aria-current', isFrench);
  }
  if (enLink) {
    enLink.href = '/gersende-de-parcey.html';
    enLink.toggleAttribute('aria-current', !isFrench);
  }

  // Preserve the English discipline name; use a shorter, accurate French form.
  const methodTitle = document.getElementById('method-title');
  if (methodTitle) {
    methodTitle.textContent = isFrench
      ? 'INGÉNIERIE DU RÉEL ORGANISATIONNEL.'
      : 'ORGANIZATIONAL REALITY ENGINEERING.';
  }

  if (!document.getElementById('founder-method-layout-fix')) {
    const style = document.createElement('style');
    style.id = 'founder-method-layout-fix';
    style.textContent = `
      .founder-page .founder-method-grid{
        grid-template-columns:minmax(0,.9fr) minmax(560px,1.1fr);
        gap:72px;
      }
      .founder-page .founder-method .founder-section-title{
        max-width:540px;
        font-size:clamp(2.05rem,2.45vw,3rem);
        line-height:1.08;
        letter-spacing:-.03em;
      }
      @media(max-width:1180px){
        .founder-page .founder-method-grid{grid-template-columns:1fr;gap:42px}
        .founder-page .founder-method .founder-section-title{
          max-width:760px;
          font-size:clamp(2.1rem,5vw,3.55rem);
        }
      }
      @media(max-width:760px){
        .founder-page .founder-method .founder-section-title{
          font-size:clamp(2rem,10.5vw,3.2rem);
        }
      }`;
    document.head.append(style);
  }
})();