// Local displacement of the photo pixels: no visible overlay or grid.
export function initHeroPressure(hero,slides,motion){
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 const ns='http://www.w3.org/2000/svg';
 const map=document.createElement('canvas');map.width=map.height=128;
 const ctx=map.getContext('2d');if(!ctx)return;
 const pixels=ctx.createImageData(128,128);
 for(let y=0;y<128;y++)for(let x=0;x<128;x++){
  const dx=(x-63.5)/63.5,dy=(y-63.5)/63.5,r=Math.hypot(dx,dy),fall=Math.pow(Math.max(0,1-r*r),2),i=(y*128+x)*4;
  pixels.data[i]=128+dx*fall*120;pixels.data[i+1]=128+dy*fall*120;pixels.data[i+2]=128;pixels.data[i+3]=255;
 }
 ctx.putImageData(pixels,0,0);
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('aria-hidden','true');svg.style.cssText='position:absolute;width:0;height:0;pointer-events:none';
 svg.innerHTML='<defs><filter id="hero-pressure" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB" primitiveUnits="userSpaceOnUse"><feFlood flood-color="rgb(128,128,128)" result="neutral"/><feImage width="440" height="440" result="pressure"/><feBlend in="pressure" in2="neutral" mode="normal" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
 document.body.append(svg);
 const spot=svg.querySelector('feImage'),warp=svg.querySelector('feDisplacementMap');spot.setAttribute('href',map.toDataURL());
 let frame=0,inside=false,amount=0,target=null,mouse=null,active=null;
 const images=slides.map(s=>s.querySelector('.hero-image'));
 function stop(){cancelAnimationFrame(frame);frame=0;inside=false;amount=0;mouse=null;target=null;active=null;images.forEach(i=>i.style.removeProperty('filter'));warp.setAttribute('scale','0');}
 function draw(){
  frame=0;if(motion.matches||!fine.matches||document.hidden){stop();return;}
  const next=hero.querySelector('.hero-slide.active .hero-image');
  if(next!==active){images.forEach(i=>i.style.removeProperty('filter'));active=next;active?.style.setProperty('filter','url(#hero-pressure)');}
  if(!mouse||!target){stop();return;}
  mouse.x+=(target.x-mouse.x)*.12;mouse.y+=(target.y-mouse.y)*.12;amount+=((inside?1:0)-amount)*.12;
  spot.setAttribute('x',String(mouse.x-220));spot.setAttribute('y',String(mouse.y-220));warp.setAttribute('scale',String(amount*48));
  if(!inside&&amount<.005){stop();return;}
  if(inside&&Math.abs(target.x-mouse.x)<.1&&Math.abs(target.y-mouse.y)<.1&&Math.abs(1-amount)<.002)return;
  frame=requestAnimationFrame(draw);
 }
 hero.addEventListener('pointermove',e=>{if(motion.matches||!fine.matches||e.pointerType==='touch')return;const r=hero.getBoundingClientRect();target={x:e.clientX-r.left,y:e.clientY-r.top};mouse??={...target};inside=true;if(!frame)frame=requestAnimationFrame(draw);},{passive:true});
 hero.addEventListener('pointerleave',()=>{inside=false;if(mouse&&!frame)frame=requestAnimationFrame(draw);});
 // Reset cleanly when changing slides, scrolling away, or disabling motion.
 new MutationObserver(()=>{if(active&&!active.parentElement.classList.contains('active'))stop();}).observe(hero,{subtree:true,attributes:true,attributeFilter:['class']});
 new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)stop();}).observe(hero);
 motion.addEventListener('change',stop);fine.addEventListener('change',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
}
