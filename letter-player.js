(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const content=window.CARD_CONTENT, song=content.music, timing=window.LetterTiming;
  const audio=$('background-music'), reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const start=song.startSeconds||0, offset=song.sourceOffsetSeconds||0;
  let end=song.durationSeconds, opened=false, started=false, finished=false;
  let loading=false, failed=false, frame, lastIndex=-2, manualFloor=-1;
  let typedCharacters=[], typedCount=0, typingStart=0, typingDuration=1;
  let sentenceEntrance, outgoingSentence;
  const entries=[{text:content.greeting,at:content.greetingAt},...content.letterLines,{text:content.signoff,at:content.signoffAt},{text:content.signature,at:content.signatureAt}];
  let cues=timing.createCues(entries,start,end);
  let stickerScene=-1, stickerIndex=-2, stickerFade;
  let storyStartedAt=0, storyActors=[];
  const storyScenes=content.stickerScenes||[];
  const activeStickers=content.stickers.filter(sticker=>sticker.enabled!==false);
  function showSticker(index){
    const layer=$('sticker-layer');
    if(index<0||finished||!activeStickers.length){
      stickerFade?.cancel();layer.hidden=true;stickerIndex=-2;return;
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
    storyActors=[];storyStartedAt=audio.currentTime||start;
    if(storyScenes.length){
      layer.dataset.story='true';delete layer.dataset.side;
      const actors=storyScenes[scene].actors.map((actor,i)=>{
        const existing=Array.from(layer.children).find(child=>child.dataset.source===actor.src);
        const wrap=existing||createSticker(actor);wrap.classList.add('story-actor');
        wrap.dataset.source=actor.src;
        wrap.style.setProperty('--actor-scale',actor.scale||1);
        wrap.style.setProperty('--tilt',i%2?'5deg':'-5deg');
        if(actor.flip)wrap.classList.add('story-flipped');
        if(!existing&&actor.doodles)addStickerDoodles(wrap,actor.doodles);
        if(!existing&&storyScenes[scene].preserveExisting&&!reducedMotion.matches){
          wrap.animate([{opacity:0},{opacity:1}],{duration:320,easing:'ease-out'});
        }
        storyActors.push({element:wrap,from:actor.x,to:actor.toX??actor.x});
        return wrap;
      });
      layer.replaceChildren(...actors);updateStickerMotion();return;
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
    storyActors.forEach(actor=>{actor.element.style.left=`${actor.from+(actor.to-actor.from)*eased}%`;});
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
      const img=document.createElement('img');img.src=sticker.src;img.alt='';img.decoding='async';img.draggable=false;crop.append(img);
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
    const index=started?Math.max(state.visible-1,manualFloor):-1;
    if(index!==lastIndex){
      transitionSentence(index);
      lastIndex=index;
      const text=entries[index]?.text||'Một giai điệu, chỉ dành cho em.';
      const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=text;
      const copy=document.createElement('span');copy.setAttribute('aria-hidden','true');
      typedCharacters=Array.from(text,character=>{const span=document.createElement('span');span.className='typed-character';span.textContent=character;return span;});
      copy.append(...typedCharacters);$('current-sentence').replaceChildren(accessible,copy);
      typedCount=0;typingStart=time;
      const nextCue=cues.find(cue=>cue.time>time)?.time??end;
      typingDuration=Math.max(.15,Math.min(3.6,typedCharacters.length*.045,(nextCue-time)*.72));
    }
    const count=reducedMotion.matches||index<0?typedCharacters.length:Math.min(typedCharacters.length,Math.floor(Math.max(0,time-typingStart)/typingDuration*typedCharacters.length)+1);
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
  function reset(){finished=false;started=false;lastIndex=-2;manualFloor=-1;audio.currentTime=start;paint();}
  function nextSentence(){
    if(!opened||finished)return;
    started=true;
    manualFloor=Math.max(lastIndex,manualFloor)+1;
    if(manualFloor>=entries.length)finished=true;
    paint();controls();
  }
  async function toggle(){
    open();
    if(!audio.paused){audio.pause();return;}
    if(finished)reset();
    if(failed)audio.load();failed=false;
    try{const play=audio.play();loading=true;controls();await play;loading=false;controls('Nhạc đang phát. Từng lời thương sẽ đến cùng giai điệu.');}
    catch(error){loading=false;if(error.name==='AbortError'){controls();return;}failed=true;controls('Chưa phát được âm thanh. Em thử bấm phát lại nhé.',true);}
  }
  audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)&&audio.duration>start){end=audio.duration;cues=timing.createCues(entries,start,end);}controls();paint();});
  audio.addEventListener('playing',()=>{loading=false;failed=false;started=true;finished=manualFloor>=entries.length;cancelAnimationFrame(frame);controls('Nhạc đang phát.');animate();});
  audio.addEventListener('pause',()=>{loading=false;cancelAnimationFrame(frame);paint();controls('Nhạc và tâm thư đang tạm dừng.');});
  audio.addEventListener('waiting',()=>{loading=true;controls('Đang đợi âm thanh…',true);});
  audio.addEventListener('timeupdate',paint);
  audio.addEventListener('seeked',paint);
  audio.addEventListener('ended',()=>{loading=false;finished=true;cancelAnimationFrame(frame);paint();controls('Giai điệu đã khép lại. Còn một câu hỏi nhỏ dành cho em.');});
  audio.addEventListener('error',()=>{loading=false;failed=true;cancelAnimationFrame(frame);controls('Chưa tải được bản nhạc. Em thử bấm phát lại nhé.',true);});
  $('unseal-letter').addEventListener('click',toggle);
  $('play-letter').addEventListener('click',toggle);
  $('restart-letter').addEventListener('click',()=>{audio.pause();reset();toggle();});
  $('main').addEventListener('click',event=>{if(!event.target.closest('button,a,input,dialog'))nextSentence();});
  $('line-stage').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();nextSentence();}});
  $('read-all').addEventListener('click',()=>{audio.pause();$('letter-dialog').showModal();});
  $('close-letter').addEventListener('click',()=>$('letter-dialog').close());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)paint();});
  window.addEventListener('pagehide',()=>{audio.pause();cancelAnimationFrame(frame);});
  paint();controls();
})();
