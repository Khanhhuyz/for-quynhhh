(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const content=window.CARD_CONTENT, song=content.music, timing=window.LetterTiming;
  const autoAdvance=content.autoAdvance!==false;
  const audio=$('background-music'), reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const start=song.startSeconds||0, offset=song.sourceOffsetSeconds||0;
  let end=song.durationSeconds, opened=false, started=false, finished=false;
  let loading=false, failed=false, frame, lastIndex=-2, manualFloor=-1;
  let previousAutomatic=-1, instantSentence=false;
  let typedCharacters=[], typedCount=0, typingStart=0, typingDuration=1;
  let sentenceEntrance, outgoingSentence;
  const entries=[{text:content.greeting,at:content.greetingAt},...content.letterLines,{text:content.signoff,at:content.signoffAt},{text:content.signature,at:content.signatureAt}];
  let cues=timing.createCues(entries,start,end);
  let stickerScene=-1, stickerIndex=-2, stickerFade;
  let storyStartedAt=0, storyActors=[];
  let bicycleArrival=null;
  let storyStroll=null;
  const storyScenes=content.stickerScenes||[];
  const activeStickers=content.stickers.filter(sticker=>sticker.enabled!==false);
  function showSticker(index){
    const layer=$('sticker-layer');
    if(index<0||finished||!activeStickers.length){
      stickerFade?.cancel();layer.hidden=true;stickerIndex=-2;$('story-caption').textContent='';return;
    }
    if(index===stickerIndex)return;
    const first=layer.hidden;
    stickerIndex=index;layer.hidden=false;stickerFade?.cancel();
    const nextScene=storyScenes.findLast(scene=>index>=scene.fromLine);
    if(nextScene?.preserveExisting){renderSticker(index);return;}
    if(first||reducedMotion.matches){renderSticker(index);return;}
    // Fade the whole image once per sentence; it never follows the typing effect.
    stickerFade=layer.animate([{opacity:1},{opacity:0}],{duration:180,easing:'ease-in',fill:'forwards'});
    stickerFade.onfinish=()=>{
      renderSticker(index);stickerFade.cancel();
      stickerFade=layer.animate([{opacity:0},{opacity:1}],{duration:260,easing:'ease-out'});
    };
  }
  function renderSticker(index){
    const layer=$('sticker-layer');
    const scene=storyScenes.length?Math.max(0,storyScenes.findLastIndex(scene=>index>=scene.fromLine)):Math.floor(index/2);
    if(scene===stickerScene)return;
    stickerScene=scene;
    storyActors=[];bicycleArrival=null;storyStroll=null;storyStartedAt=audio.currentTime||start;
    if(storyScenes.length){
      layer.dataset.story='true';delete layer.dataset.side;
      layer.dataset.stroll=String(!!storyScenes[scene].stroll);
      const actors=storyScenes[scene].actors.map((actor,i)=>{
        const existing=Array.from(layer.children).find(child=>child.dataset.source===actor.src);
        const wrap=existing||createSticker(actor);wrap.classList.add('story-actor');
        wrap.dataset.source=actor.src;
        wrap.style.setProperty('--actor-scale',actor.scale||1);
        wrap.style.setProperty('--tilt',i%2?'5deg':'-5deg');
        if(actor.flip)wrap.classList.add('story-flipped');
        if(!existing&&actor.doodles)addStickerDoodles(wrap,actor.doodles);
        if(actor.speech&&!wrap.querySelector('.actor-speech')){
          const bubble=document.createElement('p');bubble.className='actor-speech';bubble.textContent=actor.speech;
          wrap.append(bubble);
        }
        if(!existing&&storyScenes[scene].preserveExisting&&!reducedMotion.matches){
          wrap.animate([{opacity:0},{opacity:1}],{duration:320,easing:'ease-out'});
        }
        storyActors.push({element:wrap,from:actor.x,to:actor.toX??actor.x,beside:actor.beside,gap:actor.gap??4});
        return wrap;
      });
      layer.replaceChildren(...actors);
      if(storyScenes[scene].bicycle)createBicycleArrival(layer,storyScenes[scene].bicycle);
      $('story-caption').textContent=storyScenes[scene].actors.map(actor=>actor.speech||'').filter(Boolean).join(' ');
      if(storyScenes[scene].stroll){createStroll(layer);$('story-caption').textContent='Mình nắm tay nhau, tung tăng đi chơi.';}
      updateStickerMotion();return;
    }
    const sticker=activeStickers[scene%activeStickers.length];
    layer.dataset.side=scene%2?'right':'left';
    const wrap=createSticker(sticker);
    const hearts=document.createElement('span');hearts.className='sticker-hearts';hearts.textContent='♡  ♡';
    layer.replaceChildren(wrap,hearts);
  }
  function updateStickerMotion(){
    if(!storyActors.length)return;
    const duration=storyScenes[stickerScene]?.duration||1;
    const progress=reducedMotion.matches?1:Math.max(0,Math.min(1,(audio.currentTime-storyStartedAt)/duration));
    const eased=progress*progress*(3-2*progress);
    storyActors.forEach(actor=>{
      const partner=storyActors[actor.beside];
      if(partner){
        const spacing=(actor.element.offsetWidth+partner.element.offsetWidth)/2+actor.gap;
        actor.element.style.left=`calc(${partner.from}% - ${spacing}px)`;
      }else actor.element.style.left=`${actor.from+(actor.to-actor.from)*eased}%`;
    });
    updateBicycleArrival();
    updateStroll();
  }
  function createStroll(layer){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.classList.add('stroll-doodles');svg.setAttribute('aria-hidden','true');svg.setAttribute('preserveAspectRatio','none');
    svg.innerHTML='<g class="stroll-arms"><path class="arm-outline arm-left"/><path class="arm-outline arm-right"/><path class="arm-skin arm-left"/><path class="arm-skin arm-right"/><circle class="cuff cuff-left" r="5" fill="#b5c795"/><circle class="cuff cuff-right" r="5" fill="#555050"/><g class="holding-hands"><path d="M-8 -3Q-12 3 -6 7L1 9Q8 9 10 3Q12 -3 6 -5L0 -2Q-5 -7 -8 -3Z" fill="#f4c9b4" stroke="#fffaf5" stroke-width="2.5"/><path d="M-3 0 2 4M1 -2 5 2" stroke="#cc927f" stroke-width="1.2" fill="none" stroke-linecap="round"/></g></g><g class="stroll-hearts">'+Array.from({length:7},()=>'<path d="M0 3C-8 -6 -15 1 -11 8L0 18L11 8C15 1 8 -6 0 3Z"/>').join('')+'</g>';
    layer.append(svg);
    storyStroll={svg,hand:svg.querySelector('.holding-hands'),hearts:Array.from(svg.querySelectorAll('.stroll-hearts path'))};
  }
  function updateStroll(){
    if(!storyStroll||storyActors.length!==2)return;
    const {svg,hand,hearts}=storyStroll, layer=$('sticker-layer');
    const width=layer.clientWidth, time=reducedMotion.matches?0:Math.max(0,audio.currentTime-storyStartedAt);
    const [girl,boy]=storyActors, gw=girl.element.offsetWidth, bw=boy.element.offsetWidth;
    const separation=(gw+bw)/2+22;
    const drift=reducedMotion.matches?0:Math.sin(time*.55)*Math.min(36,width*.055);
    const center=width/2+drift;
    const centers=[center-separation/2,center+separation/2];
    const bobs=storyActors.map((actor,i)=>reducedMotion.matches?0:-Math.abs(Math.sin(time*3.5+i*.6))*5);
    storyActors.forEach((actor,i)=>{
      actor.element.style.left=`${centers[i]}px`;
      actor.element.style.translate=`0 ${bobs[i]}px`;
      actor.element.style.setProperty('--tilt',`${(i?4:-4)+(reducedMotion.matches?0:Math.sin(time*3.5+i)*1.6)}deg`);
    });
    svg.setAttribute('viewBox',`0 0 ${width} 260`);
    const gh=girl.element.querySelector('.sticker-crop').offsetHeight, bh=boy.element.querySelector('.sticker-crop').offsetHeight;
    const startLeft={x:centers[0]+gw*.34,y:gh*.68+bobs[0]};
    const startRight={x:centers[1]-bw*.34,y:bh*.68+bobs[1]};
    const hx=(startLeft.x+startRight.x)/2, hy=Math.max(startLeft.y,startRight.y)+12;
    const paths={left:`M${startLeft.x} ${startLeft.y} Q${startLeft.x+8} ${hy+6} ${hx} ${hy}`,right:`M${startRight.x} ${startRight.y} Q${startRight.x-8} ${hy+6} ${hx} ${hy}`};
    for(const side of ['left','right'])svg.querySelectorAll(`.arm-${side}`).forEach(path=>path.setAttribute('d',paths[side]));
    for(const [side,point] of [['left',startLeft],['right',startRight]]){
      const cuff=svg.querySelector(`.cuff-${side}`);cuff.setAttribute('cx',point.x);cuff.setAttribute('cy',point.y);
    }
    hand.setAttribute('transform',`translate(${hx} ${hy}) rotate(${reducedMotion.matches?0:Math.sin(time*3.5)*6})`);
    const spread=Math.max(gw,bw);
    hearts.forEach((heart,i)=>{
      const anchors=[[-1.25,20],[1.2,22],[-1.3,105],[1.3,112],[-.5,4],[.45,0],[0,145]];
      const [x,y]=anchors[i], float=reducedMotion.matches?0:Math.sin(time*1.8+i)*4;
      heart.setAttribute('transform',`translate(${center+x*spread} ${y*(spread/100)+float}) rotate(${i%2?13:-12}) scale(${i%3===0?.45:.32})`);
      heart.style.opacity=String(.55+(reducedMotion.matches?0:(Math.sin(time*1.8+i)+1)*.18));
    });
  }
  function createBicycleArrival(layer,config){
    const root=document.createElement('div');root.className='bicycle-arrival';root.dataset.phase='waiting';
    const images={};
    for(const [key,src] of Object.entries({rider:config.rider,parked:config.parked,bouquet:config.bouquet,pout:config.pout}).filter(([,src])=>src)){
      const img=document.createElement('img');img.src=src;img.alt='';img.draggable=false;img.className=`bicycle-${key}`;root.append(img);images[key]=img;
    }
    const wheels=document.createElementNS('http://www.w3.org/2000/svg','svg');
    wheels.classList.add('bicycle-wheels');wheels.setAttribute('viewBox','0 0 1448 1086');wheels.setAttribute('aria-hidden','true');
    const spokes=Array.from({length:6},(_,i)=>`<path d="M-137 0 H137" transform="rotate(${i*30})"/>`).join('');
    wheels.innerHTML=[398,1054].map(x=>`<g transform="translate(${x} 915)"><g class="wheel-spin"><circle r="140" stroke="transparent"/>${spokes}</g></g>`).join('');root.append(wheels);
    layer.append(root);bicycleArrival={root,images,wheels,config};
  }
  function updateBicycleArrival(){
    if(!bicycleArrival)return;
    const {root,images,wheels,config}=bicycleArrival;
    const elapsed=Math.max(0,audio.currentTime-storyStartedAt);
    const ride=Math.max(0,Math.min(1,(elapsed-config.delay)/config.rideSeconds));
    const dismount=reducedMotion.matches?1:Math.max(0,Math.min(1,(elapsed-config.delay-config.rideSeconds)/config.dismountSeconds));
    const waiting=!reducedMotion.matches&&elapsed<config.delay;
    const girl=storyActors[0], width=root.offsetWidth;
    const girlCenter=$('sticker-layer').clientWidth*girl.from/100;
    const finish=Math.max(0,girlCenter-girl.element.offsetWidth/2-width*.85);
    const eased=1-Math.pow(1-ride,3);
    root.style.left=`${waiting||reducedMotion.matches?finish:-width+(finish+width)*eased}px`;
    const poutProgress=waiting&&elapsed>=config.poutAt?Math.min(1,(elapsed-config.poutAt)/.22,(config.delay-elapsed)/.25):0;
    root.style.opacity=waiting?String(Math.max(0,poutProgress)):'1';
    root.style.setProperty('--bouquet-left',`${girlCenter-girl.element.offsetWidth/2-width*.44-6-finish}px`);
    root.style.setProperty('--parked-top',`${width*(.75-.8*2/3)}px`);
    const gettingOff=Math.min(1,dismount/.55);
    images.rider.style.opacity=waiting?'0':String(1-gettingOff);
    wheels.style.opacity=images.rider.style.opacity;
    images.parked.style.opacity=String(gettingOff);
    const flowers=Math.max(0,Math.min(1,(dismount-.55)/.45));
    images.bouquet.style.opacity=String(flowers);
    if(images.pout){
      images.pout.style.opacity=waiting?'1':'0';
      images.pout.style.left=`${girlCenter-girl.element.offsetWidth/2-width*.44-12-finish}px`;
    }
    images.bouquet.style.translate=`${(1-flowers)*-8}px ${(1-flowers)*5}px`;
    const bob=ride<1&&!waiting?Math.sin(elapsed*9)*1.3:0;
    images.rider.style.translate=`0 ${bob}px`;wheels.style.translate=`0 ${bob}px`;
    wheels.querySelectorAll('.wheel-spin').forEach(wheel=>{wheel.style.rotate=`${ride*1440}deg`;});
    const phase=waiting?(poutProgress>0?'pout':'waiting'):dismount>=1?'flowers':ride>=1?'dismount':'riding';
    if(root.dataset.phase!==phase){
      root.dataset.phase=phase;
      $('story-caption').textContent=phase==='flowers'?'Anh xuống xe, cầm bó hoa đứng cạnh em.':phase==='riding'?'Anh đạp xe đến gặp em, chưa cầm hoa.':'';
    }
  }
  function createSticker(sticker){
    const wrap=document.createElement('div');wrap.className='sentence-sticker';
    const crop=document.createElement('div');crop.className='sticker-crop';
    if(sticker.crop){
      const [x,y,w,h,sw,sh]=sticker.crop;
      const ns='http://www.w3.org/2000/svg';
      const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);svg.setAttribute('width',w);svg.setAttribute('height',h);
      const image=document.createElementNS(ns,'image');image.setAttribute('href',sticker.src);image.setAttribute('width',sw);image.setAttribute('height',sh);
      svg.append(image);crop.append(svg);
    }else{
      const img=document.createElement('img');img.src=sticker.src+(sticker.version?`?v=${sticker.version}`:'');img.alt='';img.decoding='async';img.draggable=false;
      img.addEventListener('load',updateStickerMotion);crop.append(img);
    }
    wrap.append(crop);
    return wrap;
  }
  function addStickerDoodles(wrap,type){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.classList.add('actor-doodles');svg.setAttribute('viewBox','0 0 160 180');
    svg.setAttribute('aria-hidden','true');
    const heart='M0 5 C-10 -6 -20 3 -15 12 L0 25 L15 12 C20 3 10 -6 0 5Z';
    if(type==='hearts'){
      svg.innerHTML=[[20,42,.55],[134,28,.65],[145,96,.42],[15,126,.4],[77,10,.38]].map(([x,y,s],i)=>
        `<g class="doodle-float" style="--doodle-delay:${i*-.55}s"><path transform="translate(${x} ${y}) scale(${s})" d="${heart}" fill="${i%2?'#edb8c5':'#f9dce2'}"/></g>`).join('');
    }else{
      svg.innerHTML='<g class="doodle-float"><path d="M23 24 L17 13 M33 20 L32 7 M44 24 L50 13"/><path d="M131 30 Q136 15 141 29 L136 48 M134 56 L134 58"/></g><g class="doodle-float" style="--doodle-delay:-1.2s"><path d="M142 78 Q140 89 131 91 Q142 91 144 103 Q145 91 155 89 Q144 88 142 78Z" fill="#f9dce2"/><path d="M17 75 Q16 83 9 85 Q17 84 20 93 Q20 84 28 82 Q19 82 17 75Z" fill="#f8dfb2"/><path transform="translate(28 117) scale(.45)" d="'+heart+'" fill="#edb8c5"/></g>';
    }
    wrap.append(svg);
  }
  $('song-title').textContent=song.title;
  $('song-artist').textContent=song.artist;
  audio.src=song.src; audio.volume=.75;
  function status(message,error=false){$('player-status').textContent=message;$('song-panel').classList.toggle('has-error',error);}
  function controls(message,error=false){
    const playing=!audio.paused&&!audio.ended&&!failed;
    $('play-letter').textContent=playing?'Ⅱ':finished?'↺':'▷';
    $('play-letter').setAttribute('aria-label',playing?'Tạm dừng nhạc và tâm thư':finished?'Nghe và đọc lại từ đầu':'Phát nhạc và tâm thư');
    $('play-letter').setAttribute('aria-pressed',String(playing));
    $('song-panel').classList.toggle('loading',loading);
    $('restart-letter').disabled=audio.readyState<1;
    if(message)status(message,error);
  }
  function setQuestion(show){
    $('question').hidden=!show;$('line-stage').hidden=show;
    $('chapter-badge').textContent=show?'MỘT CÂU HỎI':'LỜI THƯƠNG';
  }
  function transitionSentence(index){
    const sentence=$('current-sentence');
    sentenceEntrance?.cancel();
    outgoingSentence?.remove();outgoingSentence=null;
    if(reducedMotion.matches||index<0||finished)return;
    if(lastIndex>=0&&typedCount>0){
      const outgoing=sentence.cloneNode(true);
      outgoing.removeAttribute('id');outgoing.removeAttribute('aria-live');outgoing.removeAttribute('aria-atomic');
      outgoing.setAttribute('aria-hidden','true');outgoing.classList.add('sentence-outgoing');
      sentence.after(outgoing);outgoingSentence=outgoing;
      const departure=outgoing.animate([
        {opacity:1,translate:'0 0',filter:'blur(0)'},
        {opacity:0,translate:'0 -18px',filter:'blur(3px)'}
      ],{duration:380,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
      departure.onfinish=()=>{outgoing.remove();if(outgoingSentence===outgoing)outgoingSentence=null;};
    }
    sentenceEntrance=sentence.animate([
      {opacity:0,translate:'0 15px',filter:'blur(2px)'},
      {opacity:1,translate:'0 0',filter:'blur(0)'}
    ],{duration:680,delay:lastIndex>=0?140:0,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
  }
  function paint(){
    const time=audio.currentTime||start;
    const state=timing.snapshot(cues,time,start,end);
    const automatic=state.visible-1;
    if(autoAdvance&&manualFloor>=0){
      if(manualFloor<previousAutomatic&&automatic>previousAutomatic){
        manualFloor=Math.min(entries.length-1,manualFloor+automatic-previousAutomatic);
      }
      if(manualFloor===automatic)manualFloor=-1;
    }
    previousAutomatic=automatic;
    const index=started?(autoAdvance?(manualFloor>=0?manualFloor:automatic):Math.max(0,manualFloor)):-1;
    if(index!==lastIndex){
      transitionSentence(index);
      lastIndex=index;
      const text=entries[index]?.text||'Một giai điệu, chỉ dành cho em.';
      const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=text;
      const copy=document.createElement('span');copy.setAttribute('aria-hidden','true');
      typedCharacters=Array.from(text,character=>{const span=document.createElement('span');span.className='typed-character';span.textContent=character;return span;});
      copy.append(...typedCharacters);$('current-sentence').replaceChildren(accessible,copy);
      typedCount=0;typingStart=time;
      instantSentence=audio.paused||audio.ended;
      const nextCue=cues.find(cue=>cue.time>time)?.time??end;
      typingDuration=Math.max(.15,Math.min(3.6,typedCharacters.length*.045,autoAdvance?(nextCue-time)*.72:Infinity));
    }
    const count=reducedMotion.matches||index<0||instantSentence?typedCharacters.length:Math.min(typedCharacters.length,Math.floor(Math.max(0,time-typingStart)/typingDuration*typedCharacters.length)+1);
    // Hidden characters keep their place so the sentence does not jump as it is typed.
    if(count<typedCount)typedCharacters.slice(count,typedCount).forEach(span=>span.classList.remove('is-visible'));
    if(count>typedCount)typedCharacters.slice(typedCount,count).forEach(span=>span.classList.add('is-visible'));
    typedCount=count;
    setQuestion(finished);
    showSticker(index);
    updateStickerMotion();
  }
  function animate(){paint();if(!audio.paused&&!audio.ended)frame=requestAnimationFrame(animate);}
  function open(){if(opened)return;opened=true;$('envelope').hidden=true;$('letter-paper').hidden=false;$('song-panel').hidden=false;}
  function reset(){finished=false;started=false;lastIndex=-2;manualFloor=-1;previousAutomatic=-1;audio.currentTime=start;paint();}
  function moveSentence(direction){
    if(!opened||(finished&&direction>0))return;
    const current=finished?entries.length:Math.max(0,lastIndex);
    const target=Math.max(0,Math.min(entries.length,current+direction));
    if(target===current)return;
    started=true;
    manualFloor=target;finished=target>=entries.length;
    previousAutomatic=timing.snapshot(cues,audio.currentTime||start,start,end).visible-1;
    paint();controls();
  }
  async function toggle(){
    open();
    if(!audio.paused){audio.pause();return;}
    if(finished)reset();
    if(failed)audio.load();failed=false;
    try{const play=audio.play();loading=true;controls();await play;loading=false;controls(autoAdvance?'Nhạc đang phát. Từng lời thương sẽ đến cùng giai điệu.':'Nhạc đang phát. Chạm trái/phải để chuyển câu.');}
    catch(error){loading=false;if(error.name==='AbortError'){controls();return;}failed=true;controls('Chưa phát được âm thanh. Em thử bấm phát lại nhé.',true);}
  }
  audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)&&audio.duration>start){end=audio.duration;cues=timing.createCues(entries,start,end);}controls();paint();});
  audio.addEventListener('playing',()=>{loading=false;failed=false;started=true;finished=manualFloor>=entries.length;cancelAnimationFrame(frame);controls(autoAdvance?'Nhạc đang phát.':'Nhạc đang phát. Chạm trái/phải để chuyển câu.');animate();});
  audio.addEventListener('pause',()=>{loading=false;cancelAnimationFrame(frame);paint();controls('Nhạc và tâm thư đang tạm dừng.');});
  audio.addEventListener('waiting',()=>{loading=true;controls('Đang đợi âm thanh…',true);});
  audio.addEventListener('timeupdate',paint);
  audio.addEventListener('seeked',paint);
  audio.addEventListener('ended',()=>{loading=false;if(autoAdvance)finished=true;cancelAnimationFrame(frame);paint();controls(autoAdvance?'Giai điệu đã khép lại. Còn một câu hỏi nhỏ dành cho em.':'Nhạc đã kết thúc. Em vẫn có thể chạm trái/phải để đọc tiếp.');});
  audio.addEventListener('error',()=>{loading=false;failed=true;cancelAnimationFrame(frame);controls('Chưa tải được bản nhạc. Em thử bấm phát lại nhé.',true);});
  $('unseal-letter').addEventListener('click',toggle);
  $('play-letter').addEventListener('click',toggle);
  $('restart-letter').addEventListener('click',()=>{audio.pause();reset();toggle();});
  $('main').addEventListener('click',event=>{
    if(event.target.closest('button,a,input,dialog'))return;
    moveSentence(event.detail!==0&&event.clientX<window.innerWidth/2?-1:1);
  });
  $('line-stage').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();moveSentence(1);}});
  document.addEventListener('keydown',event=>{
    if(!opened||event.altKey||event.ctrlKey||event.metaKey||$('letter-dialog').open||event.target.closest('input,textarea,select,[contenteditable=true]'))return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();moveSentence(event.key==='ArrowLeft'?-1:1);}
  });
  $('read-all').addEventListener('click',()=>{audio.pause();$('letter-dialog').showModal();});
  $('close-letter').addEventListener('click',()=>$('letter-dialog').close());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)paint();});
  window.addEventListener('resize',updateStickerMotion);
  window.addEventListener('pagehide',()=>{audio.pause();cancelAnimationFrame(frame);});
  paint();controls();
})();
