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
  $('answer-yes').firstChild.textContent=content.yesLabel+' ';
  $('answer-later').textContent=content.laterLabel;
  $('answer-yes').addEventListener('click',()=>{
    $('answer-message').textContent=content.yesMessage;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||document.querySelector('.celebration-heart'))return;
    for(let i=0;i<12;i++){const heart=document.createElement('span');heart.className='celebration-heart';heart.textContent='♡';heart.setAttribute('aria-hidden','true');heart.style.left=(8+Math.random()*84)+'%';heart.style.animationDelay=(Math.random()*.6)+'s';document.body.append(heart);setTimeout(()=>heart.remove(),3700);}
  });
  $('answer-later').addEventListener('click',()=>{$('answer-message').textContent=content.laterMessage;});
})();
