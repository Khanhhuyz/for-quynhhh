(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const content=window.CARD_CONTENT, song=content.music, timing=window.LetterTiming;
  const audio=$('background-music'), reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const start=song.startSeconds||0, offset=song.sourceOffsetSeconds||0;
  let end=song.durationSeconds, opened=false, started=false, finished=false;
  let loading=false, failed=false, frame, lastIndex=-2, manualFloor=-1;
  let typedCharacters=[], typedCount=0, typingStart=0, typingDuration=1;
  const entries=[{text:content.greeting,at:content.greetingAt},...content.letterLines,{text:content.signoff,at:content.signoffAt},{text:content.signature,at:content.signatureAt}];
  let cues=timing.createCues(entries,start,end);
  let stickerScene=-1;
  const activeStickers=content.stickers.filter(sticker=>sticker.enabled!==false);
  function showSticker(index){
    const layer=$('sticker-layer');
    layer.hidden=index<0||finished||!activeStickers.length;
    if(layer.hidden)return;
    const scene=Math.floor(index/2);
    if(scene===stickerScene)return;
    stickerScene=scene;
    const sticker=activeStickers[scene%activeStickers.length];
    layer.dataset.side=scene%2?'right':'left';
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
    const hearts=document.createElement('span');hearts.className='sticker-hearts';hearts.textContent='♡  ♡';
    layer.replaceChildren(wrap,hearts);
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
  function paint(){
    const time=audio.currentTime||start;
    const state=timing.snapshot(cues,time,start,end);
    const index=started?Math.max(state.visible-1,manualFloor):-1;
    if(index!==lastIndex){
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
