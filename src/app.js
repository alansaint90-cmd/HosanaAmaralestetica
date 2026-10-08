import {initTreatmentCoverflow} from './treatment-coverflow.js';
const $=(s,scope=document)=>scope.querySelector(s);
const $$=(s,scope=document)=>[...scope.querySelectorAll(s)];
const header=$('.header');
const updateHeader=()=>header?.classList.toggle('scrolled',scrollY>35);
addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const menu=$('.mobile-menu');
$('.menu-toggle')?.addEventListener('click',()=>menu.showModal());
$('.close-menu')?.addEventListener('click',()=>menu.close());
$$('a',menu).forEach(a=>a.addEventListener('click',()=>menu.close()));
const motion=matchMedia('(prefers-reduced-motion: reduce)');
initTreatmentCoverflow($('.treatment-grid'));
for(const dialog of [menu])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

// Animate once on entry; final content remains available without JavaScript.
if(!motion.matches&&'IntersectionObserver' in window){
 const selector='.hero-copy > *, .manifesto-copy > *, .section-top > div > *, .testimonials-heading, .testimonial-content, .faq-intro > *, .footer-info > div';
 const elements=$$(selector);
 elements.forEach((el,i)=>{el.classList.add('text-enter');el.style.setProperty('--entry-delay',`${i%3*70}ms`);});
 const entrance=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('text-entered');entrance.unobserve(entry.target);}
 }),{threshold:.08});
 elements.forEach(el=>entrance.observe(el));
 const numbers=$$('.studio-stats dd').map(el=>{
  const final=el.textContent.trim(),target=Number(final.replace(/[^0-9]/g,''));
  const visual=document.createElement('span');visual.setAttribute('aria-hidden','true');
  const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=final;
  el.replaceChildren(visual,accessible);
  const format=value=>`${final.startsWith('+')?'+':''}${value.toLocaleString('pt-BR')}${final.endsWith('%')?'%':''}`;
  visual.textContent=format(0);
  return {visual,target,final,format};
 });
 let frame=0;
 function finishCounts(){cancelAnimationFrame(frame);numbers.forEach(n=>{n.visual.textContent=n.final;});}
 const stats=$('.studio-stats');
 const counter=new IntersectionObserver(entries=>{
  if(!entries.some(entry=>entry.isIntersecting))return;
  counter.disconnect();
  const start=performance.now();
  function tick(now){
   const progress=Math.min((now-start)/1100,1),eased=1-Math.pow(1-progress,3);
   numbers.forEach(n=>{n.visual.textContent=n.format(Math.round(n.target*eased));});
   if(progress<1)frame=requestAnimationFrame(tick);else finishCounts();
  }
  frame=requestAnimationFrame(tick);
 },{threshold:.3});
 if(stats)counter.observe(stats);
 motion.addEventListener('change',()=>{
  if(motion.matches){entrance.disconnect();counter.disconnect();elements.forEach(el=>el.classList.add('text-entered'));finishCounts();}
 });
}
