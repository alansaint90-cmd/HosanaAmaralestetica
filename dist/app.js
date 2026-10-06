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
const lightbox=$('.lightbox'),gallery=$$('.gallery-photo');let photoIndex=0;
function showPhoto(i){photoIndex=(i+gallery.length)%gallery.length;const image=$('img',gallery[photoIndex]);$('.lightbox-image').src=image.src;$('.lightbox-image').alt=image.alt;$('#gallery-caption').textContent=image.alt;$('.gallery-count').textContent=`${photoIndex+1} / ${gallery.length}`;}
gallery.forEach((b,i)=>b.addEventListener('click',()=>{showPhoto(i);lightbox.showModal();}));
$('.lightbox-close').addEventListener('click',()=>lightbox.close());$('.lightbox-next').addEventListener('click',()=>showPhoto(photoIndex+1));$('.lightbox-prev').addEventListener('click',()=>showPhoto(photoIndex-1));
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1);}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1);}});
for(const dialog of [lightbox,menu])dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
if(!motion.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target);}}),{threshold:.07});$$('.about-grid,.section-top,.gallery-heading,.faq-intro').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}

const testimonials=$$('.testimonial-slide');let testimonialIndex=0;
function showTestimonial(delta){testimonialIndex=(testimonialIndex+delta+testimonials.length)%testimonials.length;testimonials.forEach((slide,i)=>{slide.hidden=i!==testimonialIndex;});$('.testimonial-count').textContent=`${testimonialIndex+1} / ${testimonials.length}`;}
$('.testimonial-prev')?.addEventListener('click',()=>showTestimonial(-1));
$('.testimonial-next')?.addEventListener('click',()=>showTestimonial(1));
$('.testimonial-balloon')?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();showTestimonial(e.key==='ArrowRight'?1:-1);}});
