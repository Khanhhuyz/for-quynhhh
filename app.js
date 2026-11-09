(() => {
  'use strict';
  const content=window.CARD_CONTENT;
  const $=id=>document.getElementById(id);
  $('full-greeting').textContent=content.greeting;
  $('full-signoff').textContent=content.signoff;
  $('full-signature').textContent=content.signature;
  content.letterLines.forEach(line=>{const p=document.createElement('p');p.textContent=line.text;$('full-letter').append(p);});
  content.question.split(/<br\s*\/?>/i).forEach((line,i)=>{if(i)$('question-title').append(document.createElement('br'));$('question-title').append(document.createTextNode(line));});
  $('question-description').textContent=content.questionDescription;
  $('question-description').hidden=!content.questionDescription;
  $('answer-yes').firstChild.textContent=content.yesLabel+' ';
  $('answer-later').textContent=content.laterLabel;
  const yes=$('answer-yes'), later=$('answer-later'), question=$('question');
  const answers=yes.parentElement;
  let laterClicks=0, placeholder=null;
  const overlaps=(a,b,padding=12)=>a.left<b.right+padding&&a.right>b.left-padding&&a.top<b.bottom+padding&&a.bottom>b.top-padding;
  function moveLater(){
    const bounds=question.getBoundingClientRect(), previous=later.getBoundingClientRect();
    if(!placeholder){
      placeholder=document.createElement('span');placeholder.setAttribute('aria-hidden','true');
      placeholder.style.width=previous.width+'px';placeholder.style.flexShrink='0';answers.append(placeholder);
    }
    later.classList.add('answer-runaway');
    const width=later.offsetWidth,height=later.offsetHeight;
    const maxX=Math.max(12,bounds.width-width-12),maxY=Math.max(12,bounds.height-height-12);
    const obstacles=[$('question-title'),yes].map(el=>el.getBoundingClientRect());
    let best=null;
    for(let i=0;i<120;i++){
      const x=12+Math.random()*(maxX-12),y=12+Math.random()*(maxY-12);
      const rect={left:bounds.left+x,top:bounds.top+y,right:bounds.left+x+width,bottom:bounds.top+y+height};
      if(obstacles.some(obstacle=>overlaps(rect,obstacle)))continue;
      const distance=Math.hypot(rect.left-previous.left,rect.top-previous.top);
      if(!best||distance>best.distance)best={x,y,distance};
      if(distance>Math.min(150,bounds.width*.35))break;
    }
    const target=best||{x:maxX,y:maxY};
    later.style.left=target.x+'px';later.style.top=target.y+'px';
  }
  function inviteYes(){
    later.hidden=true;placeholder?.remove();placeholder=null;
    answers.classList.add('answer-invitation');
    const effects=document.createElement('div');effects.className='answer-effects';effects.setAttribute('aria-hidden','true');
    const words=[['đồng ý',10,16,-14],['đồng ý',82,20,12],['đồng ý!!!!',18,83,9],['đồng ý',78,80,-11],['đồng ý',50,8,-6],['đồng ý!!!!',52,95,7]];
    words.forEach(([text,x,y,angle])=>{
      const word=document.createElement('span');word.className='agree-whisper';word.textContent=text;
      word.style.left=x+'%';word.style.top=y+'%';word.style.setProperty('--angle',angle+'deg');effects.append(word);
    });
    for(let i=0;i<14;i++){
      const star=document.createElement('span');star.className='answer-sparkle';star.textContent=i%3?'✧':'✦';
      const angle=i/14*Math.PI*2;
      star.style.left=(50+Math.cos(angle)*44)+'%';star.style.top=(50+Math.sin(angle)*36)+'%';
      star.style.animationDelay=(i*.17)+'s';effects.append(star);
    }
    answers.append(effects);yes.focus({preventScroll:true});
  }
  function resetAnswers(){
    laterClicks=0;later.hidden=false;later.textContent=content.laterLabel;
    later.classList.remove('answer-runaway');later.style.removeProperty('left');later.style.removeProperty('top');
    placeholder?.remove();placeholder=null;answers.classList.remove('answer-invitation');
    answers.querySelector('.answer-effects')?.remove();$('answer-message').textContent='';
  }
  window.addEventListener('resize',()=>{if(laterClicks>0&&laterClicks<3&&!question.hidden)moveLater();});
  $('restart-letter').addEventListener('click',resetAnswers);
  $('answer-yes').addEventListener('click',()=>{
    $('answer-message').textContent=content.yesMessage;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.querySelector('.celebration-heart'))return;
    for(let i=0;i<12;i++){const heart=document.createElement('span');heart.className='celebration-heart';heart.textContent='♡';heart.setAttribute('aria-hidden','true');heart.style.left=(8+Math.random()*84)+'%';heart.style.animationDelay=(Math.random()*.6)+'s';document.body.append(heart);setTimeout(()=>heart.remove(),3700);}
  });
  later.addEventListener('click',()=>{
    laterClicks++;
    if(laterClicks===3){inviteYes();return;}
    later.textContent=laterClicks===1?'oh nooo':'suy nghĩ lại đi mòo';
    moveLater();
  });
})();
