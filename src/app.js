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
// Transparent kinetic grid, adapted to the existing photo carousel.
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const kineticLayers=slides.map(slide=>{
 const canvas=document.createElement('canvas');canvas.className='hero-kinetic';canvas.setAttribute('aria-hidden','true');
 slide.querySelector('.hero-image').after(canvas);return canvas;
});
let kineticFrame=0,kineticInside=false,kineticVisible=true,kineticMouse=null,kineticTarget=null,kineticRipples=[];
function clearKinetic(){cancelAnimationFrame(kineticFrame);kineticFrame=0;kineticInside=false;kineticMouse=null;kineticTarget=null;kineticRipples=[];kineticLayers.forEach(c=>{c.classList.remove('visible');c.getContext('2d')?.clearRect(0,0,c.width,c.height);});}
function drawKinetic(now){
 kineticFrame=0;if(!kineticInside||!kineticVisible||motion.matches||!finePointer.matches||document.hidden)return;
 const canvas=kineticLayers.find(c=>c.parentElement.classList.contains('active'));if(!canvas)return;
 kineticLayers.forEach(c=>c.classList.toggle('visible',c===canvas));
 const w=hero.clientWidth,h=hero.clientHeight,dpr=Math.min(devicePixelRatio||1,2),ctx=canvas.getContext('2d');if(!ctx)return;
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 kineticMouse.x+=(kineticTarget.x-kineticMouse.x)*.08;kineticMouse.y+=(kineticTarget.y-kineticMouse.y)*.08;
 kineticRipples=kineticRipples.filter(r=>now-r.born<850);
 const cols=Math.ceil(w/55)+1,rows=Math.ceil(h/55)+1,points=[];
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const x=col*w/(cols-1),y=row*h/(rows-1),dx=x-kineticMouse.x,dy=y-kineticMouse.y,dist=Math.hypot(dx,dy);
  const pin=Math.pow(Math.min(col/1.5,(cols-1-col)/1.5,1)*Math.min(row/1.5,(rows-1-row)/1.5,1),2);
  const proximity=Math.max(0,1-dist/260)*pin,warp=Math.pow(Math.max(0,1-dist/260),2)*Math.min(1,dist/60)*24*pin;
  let px=x-(dx/(dist||1))*warp,py=y-(dy/(dist||1))*warp;
  for(const r of kineticRipples){const age=(now-r.born)/1000,rdx=x-r.x,rdy=y-r.y,rd=Math.hypot(rdx,rdy),diff=rd-age*400;
   if(Math.abs(diff)<55){const strength=(1-Math.abs(diff)/55)*Math.max(0,1-age*1.2)*18*pin*(diff<0?1:-1);px+=rdx/(rd||1)*strength;py+=rdy/(rd||1)*strength;}}
  points.push({x:px,y:py,p:proximity});
 }
 const segment=(a,b)=>{const t=(a.p+b.p)/2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(225,201,172,${.045+t*.6})`;ctx.lineWidth=.65+t*.8;ctx.stroke();};
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){const p=points[row*cols+col];if(col+1<cols)segment(p,points[row*cols+col+1]);if(row+1<rows)segment(p,points[(row+1)*cols+col]);if(p.p>.1){ctx.beginPath();ctx.arc(p.x,p.y,1+p.p*2,0,Math.PI*2);ctx.fillStyle=`rgba(247,231,210,${p.p*.8})`;ctx.fill();}}
 for(const r of kineticRipples){const age=(now-r.born)/1000;ctx.beginPath();ctx.arc(r.x,r.y,Math.max(0,age*400),0,Math.PI*2);ctx.strokeStyle=`rgba(225,201,172,${Math.max(0,1-age*1.2)*.3})`;ctx.lineWidth=1;ctx.stroke();}
 kineticFrame=requestAnimationFrame(drawKinetic);
}
hero.addEventListener('pointermove',e=>{if(motion.matches||!finePointer.matches||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();kineticTarget={x:e.clientX-r.left,y:e.clientY-r.top};kineticMouse??={...kineticTarget};kineticInside=true;if(!kineticFrame)kineticFrame=requestAnimationFrame(drawKinetic);},{passive:true});
hero.addEventListener('pointerleave',clearKinetic);
hero.addEventListener('click',e=>{if(!kineticInside||e.target.closest('a,button'))return;const r=hero.getBoundingClientRect();kineticRipples.push({x:e.clientX-r.left,y:e.clientY-r.top,born:performance.now()});kineticRipples=kineticRipples.slice(-5);});
motion.addEventListener('change',clearKinetic);finePointer.addEventListener('change',clearKinetic);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearKinetic();});
new IntersectionObserver(entries=>{kineticVisible=entries[0].isIntersecting;if(!kineticVisible)clearKinetic();}).observe(hero);
let index=0;
function show(next){index=(next+slides.length)%slides.length;slides.forEach((s,i)=>{s.classList.toggle('active',i===index);s.inert=i!==index;s.setAttribute('aria-hidden',String(i!==index));});$('#slide-status').textContent=`Slide ${index+1} de ${slides.length}: ${$('h1,h2',slides[index]).textContent}`;}
$('.prev').addEventListener('click',()=>show(index-1));
$('.next').addEventListener('click',()=>show(index+1));
hero.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1,true);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1,true);}});
let touch;hero.addEventListener('touchstart',e=>{touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});hero.addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(index+(dx<0?1:-1),true);touch=null;},{passive:true});

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
