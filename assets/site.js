/* Auditor website: menu, sticky header, pricing period, reveal-on-scroll, fan drawing, contact form. */
(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

  // header: border once scrolled; mobile menu
  const top=$('#top');
  const onScroll=()=>top.classList.toggle('scrolled',scrollY>8);
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  const mb=$('.menu-btn');
  mb.addEventListener('click',()=>{ const open=top.classList.toggle('open'); mb.setAttribute('aria-expanded',open); });
  $$('.nav a').forEach(a=>a.addEventListener('click',()=>{ top.classList.remove('open'); mb.setAttribute('aria-expanded','false'); }));

  // pricing: monthly / yearly
  $$('.toggle button').forEach(b=>b.addEventListener('click',()=>{
    const p=b.dataset.period;
    $$('.toggle button').forEach(x=>x.classList.toggle('on',x===b));
    $$('.price[data-mo]').forEach(el=>{ el.querySelector('.amt').textContent=el.dataset[p]; el.querySelector('.per').textContent=p==='mo'?'/mo':'/yr'; });
    $$('.alt[data-mo]').forEach(el=>{ el.textContent=el.dataset[p]; });
  }));

  // pricing: Auditor (desktop + Site Capture) or Site Capture only
  $$('.tabs button').forEach(b=>b.addEventListener('click',()=>{
    $$('.tabs button').forEach(x=>{ const on=x===b; x.classList.toggle('on',on); x.setAttribute('aria-selected',on); });
    $$('.tier-panel').forEach(p=>{ p.hidden=p.dataset.panel!==b.dataset.product; });
  }));
  // a link to #pricing-sc opens the Site Capture tab
  if(location.hash==='#pricing-sc'){ const t=$('.tabs button[data-product=sc]'); if(t){ t.click(); $('#pricing').scrollIntoView(); } }

  // Site Capture screens: the arrows scroll the strip by most of its width
  const shots=$('#shots');
  $$('.shots-nav button').forEach(b=>b.addEventListener('click',()=>{
    shots.scrollBy({left:Number(b.dataset.dir)*shots.clientWidth*0.8,behavior:'smooth'});
  }));

  // the orange fan in "How it works": lines from one point out to a vertical spread
  const fan=$('#fan');
  if(fan){
    const n=17, x0=16, y0=150, x1=420, h=290, ns='http://www.w3.org/2000/svg';
    for(let i=0;i<n;i++){
      const y=5+i*(h/(n-1)), p=document.createElementNS(ns,'path');
      p.setAttribute('d',`M${x0} ${y0} C ${x0+170} ${y0}, ${x1-180} ${y}, ${x1} ${y}`);
      p.style.opacity=(0.35+0.65*(1-Math.abs(i-(n-1)/2)/((n-1)/2))).toFixed(2);
      fan.appendChild(p);
    }
  }

  // reveal on scroll
  const els=$$('.reveal');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px'});
    els.forEach(el=>io.observe(el));
  } else els.forEach(el=>el.classList.add('in'));

  // contact form: until a form service is connected, open the visitor's email app with the
  // message already written, addressed to us.
  const form=$('#contact-form'), note=$('#form-note');
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form));
    if(!d.name||!d.email||!d.message||!/^\S+@\S+\.\S+$/.test(d.email)){
      note.textContent='Please add your name, a valid email and a message.'; note.style.color='#C2410C'; return;
    }
    const body=[d.message,'',`Name: ${d.name}`,`Email: ${d.email}`,d.phone&&`Phone: ${d.phone}`,d.location&&`Location: ${d.location}`,
      d.company&&`Company: ${d.company}`,d.size&&`Company size: ${d.size}`].filter(Boolean).join('\n');
    location.href='mailto:info@theauditorapp.com?subject='+encodeURIComponent('Website enquiry from '+d.name)+'&body='+encodeURIComponent(body);
    note.textContent='Your email app should open with the message ready to send.'; note.style.color='';
  });

  const yr=$('#yr'); if(yr) yr.textContent=new Date().getFullYear();
})();
