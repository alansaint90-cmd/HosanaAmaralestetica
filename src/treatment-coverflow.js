export function initTreatmentCoverflow(stage){
 const cards=[...stage.querySelectorAll('.treatment')];
 const section=stage.closest('section');
 let visible=cards,active=0,drag=null,suppressClick=false,step=220;
 stage.classList.add('coverflow');stage.tabIndex=0;
 stage.setAttribute('role','region');stage.setAttribute('aria-roledescription','carrossel');stage.setAttribute('aria-label','Tratamentos — role, arraste ou use as setas do teclado para navegar');
 const controls=document.createElement('div');controls.className='coverflow-controls';
 controls.innerHTML='<span class="coverflow-count" aria-live="polite" aria-atomic="true"></span>';
 stage.after(controls);
 const status=controls.querySelector('span');
 const mobile=matchMedia('(max-width:600px)');
 function offset(i){let d=i-active;const n=visible.length;if(d>n/2)d-=n;if(d< -n/2)d+=n;return d;}
 function render(travel=0){
  visible.forEach((card,i)=>{
   const base=offset(i),d=base+travel,a=Math.abs(d),side=Math.sign(d),near=Math.abs(base)<=3;
   const mix=values=>{const t=Math.min(a,3),lo=Math.floor(t),hi=Math.min(lo+1,3);return values[lo]+(values[hi]-values[lo])*(t-lo);};
   const scale=mix([1,.82,.65,.5]),angle=mix([0,20,32,40])*(mobile.matches?.6:1),z=mix([100,0,-80,-150]);
   card.style.transform=`translateX(calc(-50% + ${d*step}px)) translateZ(${z}px) rotateY(${-side*angle}deg) scale(${scale})`;
   card.style.opacity=near?String(mix([1,.9,.65,.35])):'0';card.style.zIndex=String(10-Math.round(a));card.style.pointerEvents=near?'auto':'none';
   card.classList.toggle('is-active',d===0);card.setAttribute('aria-hidden',String(!near));card.inert=!near;
   card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');card.setAttribute('aria-label',`${i+1} de ${visible.length}: ${card.querySelector('h3').textContent}`);
   const image=card.querySelector('img');image.draggable=false;if(a<=2)image.loading='eager';else image.loading='lazy';
  });
  status.textContent=visible.length?`${active+1} / ${visible.length}`:'0 / 0';
 }
 function go(delta){if(!visible.length)return;active=(active+delta+visible.length)%visible.length;render();}
 function measure(){const width=stage.clientWidth;step=mobile.matches?Math.min(width*.59,245):Math.min(width*.205,255);render();}
 function refresh(){const previous=visible[active];visible=cards.filter(c=>!c.hidden);active=Math.max(0,visible.indexOf(previous));render();}
 let wheelTotal=0,lastWheel=0;
 stage.addEventListener('wheel',e=>{
  if(e.ctrlKey||visible.length<2)return;
  const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;
  if(!delta)return;
  e.preventDefault();
  const now=performance.now();
  if(now-lastWheel<600)return;
  wheelTotal+=delta*(e.deltaMode===1?16:e.deltaMode===2?stage.clientWidth:1);
  if(Math.abs(wheelTotal)>=45){go(wheelTotal>0?1:-1);wheelTotal=0;lastWheel=now;}
 },{passive:false});
 section.addEventListener('keydown',e=>{if(e.target.closest('.filters'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();go(e.key==='ArrowRight'?1:-1);}});
 stage.addEventListener('click',e=>{if(suppressClick){suppressClick=false;return;}const card=e.target.closest('.treatment'),i=visible.indexOf(card);if(i>=0){active=i;render();}});
 stage.addEventListener('pointerdown',e=>{if(e.button!==0||visible.length<2)return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,horizontal:false};suppressClick=false;});
 stage.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;drag.dx=e.clientX-drag.x;const dy=e.clientY-drag.y;if(!drag.horizontal&&Math.abs(dy)>Math.abs(drag.dx)&&Math.abs(dy)>12){drag=null;return;}if(Math.abs(drag.dx)>8){drag.horizontal=true;stage.setPointerCapture(e.pointerId);stage.classList.add('is-dragging');render(Math.max(-.9,Math.min(.9,drag.dx/step)));}});
 function finish(e){if(!drag||drag.id!==e.pointerId)return;const current=drag;drag=null;stage.classList.remove('is-dragging');if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId);if(current.horizontal){suppressClick=true;if(e.type!=='pointercancel'&&Math.abs(current.dx)>35)go(current.dx<0?1:-1);else render();}}
 stage.addEventListener('pointerup',finish);stage.addEventListener('pointercancel',finish);
 stage.addEventListener('dragstart',e=>e.preventDefault());
 new ResizeObserver(measure).observe(stage);mobile.addEventListener('change',measure);measure();
 return {refresh};
}
