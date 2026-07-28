(()=>{
  const menu=document.querySelector('.menu');
  const links=document.querySelector('.links');
  const isRpoHome=document.body.classList.contains('rpo-home');

  if(links&&!isRpoHome){
    const path=location.pathname==='/'?'/':location.pathname;
    const nav=[
      ['/','Overview'],
      ['/spec.html','Specification'],
      ['/examples.html','Example'],
      ['/tests.html','Verify']
    ];
    links.innerHTML=nav.map(([href,label])=>'<a '+(path===href?'aria-current="page" ':'')+'href="'+href+'">'+label+'</a>').join('')+
      '<a href="https://openproof.net">OpenProof ↗</a>';
  }

  if(menu&&links){
    menu.onclick=()=>{
      links.classList.toggle('open');
      menu.setAttribute('aria-expanded',links.classList.contains('open'));
    };
  }

  const languageButtons=[...document.querySelectorAll('[data-lang]')];
  const copyBlocks=[...document.querySelectorAll('[data-copy]')];
  if(languageButtons.length&&copyBlocks.length){
    const setLanguage=(language)=>{
      const lang=language==='en'?'en':'fr';
      document.documentElement.lang=lang;
      copyBlocks.forEach(block=>{block.hidden=block.dataset.copy!==lang;});
      languageButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
      try{localStorage.setItem('openproof-language',lang);}catch(_){}
    };
    languageButtons.forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
    let stored='fr';
    try{stored=localStorage.getItem('openproof-language')||'fr';}catch(_){}
    setLanguage(stored);
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
    next.textContent=at===stages.length-1?'Return to overview ↺':'Continue →';
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
        const color=star.t<.16?'212,175,55':star.t<.25?'56,224,162':star.t<.34?'93,115,255':'255,255,255';
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
