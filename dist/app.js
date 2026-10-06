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
const slides=$$('.hero-slide'),hero=$('.hero');
const motion=matchMedia('(prefers-reduced-motion: reduce)');

let index=0;
function show(next){index=(next+slides.length)%slides.length;slides.forEach((s,i)=>{s.classList.toggle('active',i===index);s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index));});$('#slide-status').textContent=`Slide ${index+1} de ${slides.length}: ${$('h1,h2',slides[index]).textContent}`;}
$('.prev').addEventListener('click',()=>show(index-1));
$('.next').addEventListener('click',()=>show(index+1));
hero.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1,true);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,true);}});
let touch;hero.addEventListener('touchstart',e=>{touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});hero.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1),true);touch=null;},{passive:true});

initTreatmentCoverflow($('.treatment-grid'));
const lightbox=$('.lightbox'),gallery=$$('.gallery-photo');let photoIndex=0;
function showPhoto(i){photoIndex=(i+gallery.length)%gallery.length;const image=$('img',gallery[photoIndex]);$('.lightbox-image').src=image.src;$('.lightbox-image').alt=image.alt;$('#gallery-caption').textContent=image.alt;$('.gallery-count').textContent=`${photoIndex+1} / ${gallery.length}`;}
gallery.forEach((b,i)=>b.addEventListener('click',()=>{showPhoto(i);lightbox.showModal();}));
$('.lightbox-close').addEventListener('click',()=>lightbox.close());$('.lightbox-next').addEventListener('click',()=>showPhoto(photoIndex+1));$('.lightbox-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
for(const dialog of [lightbox,menu])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
if(!motion.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.07});$$('.about-grid,.section-top,.gallery-heading,.faq-intro').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}
