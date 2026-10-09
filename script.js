if(typeof IMG==='undefined'){document.body.insertAdjacentHTML('afterbegin','<p style="padding:20px;color:#c00;font:16px sans-serif">images.js not found. Keep index.html, style.css, script.js and images.js in the same folder.</p>')}
else (function(){
var PHOTOS=[
[IMG.p1,'Concrete after dark',IMG.f1],[IMG.p2,'Autumn pavement',IMG.f2],[IMG.p3,'Fog, stone and a jump',IMG.f3],
[IMG.p4,'Marble hall at night',IMG.f4],[IMG.p5,'Canyon walkway',IMG.f5],[IMG.p6,'Alley glow',IMG.f6],
[IMG.p7,'The Dream',IMG.f7],[IMG.p8,'River aarti, blue hour',IMG.f8],[IMG.p9,'Faded facade',IMG.f9],
[IMG.p10,'Sunrise through the trees',IMG.f10],[IMG.p11,'Aarti in lights',IMG.f11]];
var N=PHOTOS.length,W=140,STEP=360/N,R=Math.round((W/2)/Math.tan(Math.PI/N))+12;
var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
function g(id){return document.getElementById(id)}
var hero=g('hero'),scene=g('scene3d'),bg=g('bg'),ti=g('title'),tg=g('tag');bg.src=IMG.hero;
var ring=g('ring'),stage=g('stage'),wrap=g('ringwrap'),cap=g('cap'),sec=g('ringsec'),panels=[];

PHOTOS.forEach(function(p,i){
  var d=document.createElement('div'),m=document.createElement('img');
  d.className='panel';m.src=p[0];m.alt='';m.draggable=false;
  d.setAttribute('role','button');d.tabIndex=0;d.setAttribute('aria-label','Open photo: '+p[1]);
  d.addEventListener('click',function(){if(!moved)openLb(i,d)});
  d.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openLb(i,d)}});
  d.appendChild(m);
  d.style.transform='rotateY('+(i*STEP)+'deg) translateZ('+R+'px)';
  ring.appendChild(d);panels.push(d);
});
function fit(){wrap.style.setProperty('--s',Math.min(1,innerWidth/(R*1.6+W)).toFixed(3))}
fit();addEventListener('resize',fit);

var a=0,v=.25,drag=false,lx=0,lastY=scrollY,front=-1;
stage.addEventListener('pointerdown',function(e){drag=true;moved=false;sx=lx=e.clientX});
stage.addEventListener('pointermove',function(e){if(!drag)return;if(!moved&&Math.abs(e.clientX-sx)>6){moved=true;stage.setPointerCapture(e.pointerId)}v=(e.clientX-lx)*.5;a+=v;lx=e.clientX});
function up(){drag=false;v=Math.max(-5,Math.min(5,v))}
stage.addEventListener('pointerup',up);stage.addEventListener('pointercancel',up);
addEventListener('scroll',function(){var y=scrollY;if(!still)a+=(y-lastY)*.25;lastY=y},{passive:true});

var px=0,py=0,ax=0,ay=0,has=false;
hero.addEventListener('pointermove',function(e){var r=hero.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;has=true});
hero.addEventListener('pointerleave',function(){has=false});

document.querySelectorAll('.card').forEach(function(c){
  c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.setProperty('--ry',(x*20)+'deg');c.style.setProperty('--rx',(-y*20)+'deg')});
  function rs(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')}
  c.addEventListener('pointerleave',rs);c.addEventListener('pointerup',rs);c.addEventListener('pointercancel',rs);
});

var lb=g('lb'),lbi=g('lbimg'),lbc=g('lbcap'),lbx=g('lbx'),lbp=g('lbp'),lbn=g('lbn'),cur=0,opener=null,moved=false,sx=0,sx2=0;
function show(i){cur=(i+N)%N;lbi.src=PHOTOS[cur][2];lbi.alt=PHOTOS[cur][1];lbc.textContent=PHOTOS[cur][1]}
function openLb(i,el){opener=el;show(i);lb.hidden=false;document.body.style.overflow='hidden';lbx.focus()}
function closeLb(){lb.hidden=true;document.body.style.overflow='';lbi.removeAttribute('src');if(opener)opener.focus({preventScroll:true})}
lbx.addEventListener('click',closeLb);
lbp.addEventListener('click',function(){show(cur-1)});
lbn.addEventListener('click',function(){show(cur+1)});
lb.addEventListener('click',function(e){if(e.target===lb)closeLb()});
lb.addEventListener('pointerdown',function(e){sx2=e.clientX});
lb.addEventListener('pointerup',function(e){var d=e.clientX-sx2;if(Math.abs(d)>60)show(cur+(d<0?1:-1))});
document.addEventListener('keydown',function(e){
  if(lb.hidden)return;
  if(e.key==='Escape')closeLb();
  else if(e.key==='ArrowLeft')show(cur-1);
  else if(e.key==='ArrowRight')show(cur+1);
  else if(e.key==='Tab'){var b=[lbx,lbp,lbn],k=b.indexOf(document.activeElement);e.preventDefault();b[(k+(e.shiftKey?-1:1)+3)%3].focus()}
});

function loop(t){
  var sy=Math.min(scrollY,innerHeight*1.2);
  if(!still){
    var s=t/1000,tx=has?px:Math.sin(s*.6)*.35,ty=has?py:Math.cos(s*.5)*.2;
    ax+=(tx-ax)*.08;ay+=(ty-ay)*.08;
    if(!drag){a+=v;v+=(.25-v)*.04}
  }
  if(scrollY<innerHeight*1.3){
    scene.style.transform='rotateY('+(ax*10)+'deg) rotateX('+(-ay*8+sy*.008)+'deg)';
    bg.style.setProperty('--bx',(-ax*26)+'px');bg.style.setProperty('--by',(-ay*18+sy*.28)+'px');
    ti.style.setProperty('--tx',(ax*24)+'px');ti.style.setProperty('--ty',(ay*10-sy*.12)+'px');
    tg.style.setProperty('--gx',(ax*44)+'px');tg.style.setProperty('--gy',(-sy*.2)+'px');
  }
  var r=sec.getBoundingClientRect();
  if(r.bottom>0&&r.top<innerHeight){
    var p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
    ring.style.transform='translateZ(-'+R+'px) rotateX('+(-26+p*32)+'deg) rotateY('+a+'deg)';
    var best=0,bc=-2;
    panels.forEach(function(d,i){
      var c=Math.cos((i*STEP+a)*Math.PI/180);
      d.style.opacity=(.35+.65*Math.max(0,c)).toFixed(2);
      if(c>bc){bc=c;best=i}
    });
    if(best!==front){front=best;cap.textContent=PHOTOS[best][1]}
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
})();
