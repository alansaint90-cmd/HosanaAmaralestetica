const $=(s,scope=document)=>scope.querySelector(s);
const $$=(s,scope=document)=>[...scope.querySelectorAll(s)];
const header=$('.header');
const updateHeader=()=>header?.classList.toggle('scrolled',scrollY>35);
addEventListener('scroll',updateHeader,{passive:true});updateHeader();
const menu=$('.mobile-menu');
$('.menu-toggle')?.addEventListener('click',()=>menu.showModal());
$('.close-menu')?.addEventListener('click',()=>menu.close());
$$('a',menu).forEach(a=>a.addEventListener('click',()=>menu.close()));
const slides=$$('.hero-slide'),dots=$$('.slide-dot'),hero=$('.hero'),play=$('.play');
const motion=matchMedia('(prefers-reduced-motion: reduce)');
let index=0,playing=!motion.matches,timer;
function updatePlay(){play.textContent=playing?'Ⅱ':'▷';play.setAttribute('aria-label',playing?'Pausar apresentação':'Iniciar apresentação');}
function stop(){playing=false;clearTimeout(timer);updatePlay();}
function schedule(){clearTimeout(timer);if(playing&&!document.hidden&&!hero.matches(':hover')&&!hero.contains(document.activeElement))timer=setTimeout(()=>{show(index+1);schedule();},7500);}
function show(next,manual=false){index=(next+slides.length)%slides.length;slides.forEach((s,i)=>{s.classList.toggle('active',i===index);s.inert=i!==index;s.setAttribute('aria-hidden',i===index?'false':'true');});dots.forEach((d,i)=>{d.classList.toggle('active',i===index);d.setAttribute('aria-pressed',String(i===index));});$('.slide-count').textContent=`0${index+1} / 04`;if(manual){stop();$('#slide-status').textContent=`Slide ${index+1} de 4: ${$('h1,h2',slides[index]).textContent}`;}}
$('.prev').addEventListener('click',()=>show(index-1,true));$('.next').addEventListener('click',()=>show(index+1,true));dots.forEach((d,i)=>d.addEventListener('click',()=>show(i,true)));
play.addEventListener('click',()=>{playing=!playing;updatePlay();schedule();});
hero.addEventListener('mouseenter',()=>clearTimeout(timer));hero.addEventListener('mouseleave',schedule);hero.addEventListener('focusin',()=>clearTimeout(timer));hero.addEventListener('focusout',()=>setTimeout(schedule,0));document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',()=>{if(motion.matches)stop();});
hero.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1,true);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,true);}});
let touch;hero.addEventListener('touchstart',e=>{touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});hero.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1),true);touch=null;},{passive:true});
updatePlay();schedule();
const filters=$$('[data-filter]'),cards=$$('.treatment');
function filterTreatments(value){filters.forEach(f=>{f.setAttribute('aria-pressed',String(f.dataset.filter===value));f.classList.toggle('selected',f.dataset.filter===value);});cards.forEach(c=>{c.hidden=value!=='Todos'&&c.dataset.category!==value;});$('#filter-status').textContent=`${cards.filter(c=>!c.hidden).length} tratamentos na categoria ${value}.`;}
filters.forEach(f=>f.addEventListener('click',()=>filterTreatments(f.dataset.filter)));
$$('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>filterTreatments(a.dataset.filterLink)));
const lightbox=$('.lightbox'),gallery=$$('.gallery-photo');let photoIndex=0;
function showPhoto(i){photoIndex=(i+gallery.length)%gallery.length;const image=$('img',gallery[photoIndex]);$('.lightbox-image').src=image.src;$('.lightbox-image').alt=image.alt;$('#gallery-caption').textContent=image.alt;$('.gallery-count').textContent=`${photoIndex+1} / ${gallery.length}`;}
gallery.forEach((b,i)=>b.addEventListener('click',()=>{showPhoto(i);lightbox.showModal();}));
$('.lightbox-close').addEventListener('click',()=>lightbox.close());$('.lightbox-next').addEventListener('click',()=>showPhoto(photoIndex+1));$('.lightbox-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
for(const dialog of [lightbox,menu])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
if(!motion.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.07});$$('.about-grid,.section-top,.gallery-heading,.faq-intro').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
