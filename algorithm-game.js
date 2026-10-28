let algorithmIndex=0,algorithmStates=[],algorithmTimer=null,algorithmRemaining=60;
function stopAlgorithmTimer(){clearInterval(algorithmTimer);algorithmTimer=null;}
function algorithmClockText(){return String(Math.floor(algorithmRemaining/60)).padStart(2,'0')+':'+String(algorithmRemaining%60).padStart(2,'0');}
function ensureAlgorithmOverlay(){
 let d=document.getElementById('algorithm-overlay');
 if(!d){d=document.createElement('dialog');d.id='algorithm-overlay';d.setAttribute('aria-labelledby','algorithm-overlay-title');document.body.appendChild(d);d.addEventListener('click',ev=>{if(ev.target===d){const r=d.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)d.close();}});}
 return d;
}
function showAlgorithmOverlay(kind){
 stopAlgorithmTimer();
 const q=ALGORITHM_QUESTIONS[algorithmIndex],state=algorithmStates[algorithmIndex];
 state[kind]=true;
 const dialog=ensureAlgorithmOverlay();
 dialog.innerHTML=`<div class="algorithm-overlay-top"><span>${kind==='hint'?'그림 속 상황 · 텍스트 힌트':'함께 확인해요 · 정답과 해설'} · ${String(algorithmIndex+1).padStart(2,'0')} / 10</span><button class="close" id="algorithm-overlay-close" aria-label="닫기">×</button></div><h2 id="algorithm-overlay-title">${kind==='hint'?q.title:q.answer}</h2><div class="algorithm-overlay-copy">${kind==='hint'?q.hint.map(t=>`<p>${t}</p>`).join(''):`<p>${q.why}</p><div class="algorithm-alternative"><strong>다른 풀이도 이야기해봐요</strong><p>${q.note}</p></div>`}</div><button class="button blue" id="algorithm-overlay-done">그림으로 돌아가기</button>`;
 document.getElementById('algorithm-overlay-close').onclick=()=>dialog.close();document.getElementById('algorithm-overlay-done').onclick=()=>dialog.close();
 drawAlgorithm();dialog.showModal();
}
function openAlgorithmQuiz(){stopAlgorithmTimer();document.querySelector('.play-placeholder').classList.remove('keyword-host');history.replaceState(null,'','#play-10');drawAlgorithm();}
function drawAlgorithm(){
 stopAlgorithmTimer();
 const q=ALGORITHM_QUESTIONS[algorithmIndex],state=algorithmStates[algorithmIndex]||(algorithmStates[algorithmIndex]={hint:false,reveal:false});
 const box=document.querySelector('.play-placeholder');box.classList.add('algorithm-host');
 box.innerHTML=`<div class="algorithm-toolbar"><span>10월 · 일상 속 알고리즘 퀴즈</span><div><button id="algorithm-projector" class="outline-link">${document.body.classList.contains('projector-mode')?'기본 화면':'발표 화면'}</button><button class="outline-link" id="algorithm-timer">${algorithmRemaining===0?'↺ 타이머 다시 시작':'▶ 60초 타이머'}</button><strong id="algorithm-clock">${algorithmClockText()}</strong><b>${String(algorithmIndex+1).padStart(2,'0')} / 10</b></div></div><h2 class="algorithm-question">이 상황에서 가장 적절한 알고리즘은?</h2><p class="algorithm-subtitle">보기 없이, 팀끼리 의논해 알고리즘 이름과 선택한 이유를 적어주세요.</p><figure class="algorithm-scene"><img class="algorithm-image" decoding="async" src="./assets/algorithms/daily-${algorithmIndex+1}.png" alt="${q.title}의 일상 장면"><figcaption><span>SCENE ${String(algorithmIndex+1).padStart(2,'0')}</span><strong>${q.title}</strong><span>상황이 궁금하다면 ‘텍스트 힌트’를 열어보세요.</span></figcaption></figure><div class="algorithm-controls"><button class="outline-link" id="algorithm-prev" ${algorithmIndex===0?'disabled':''}>← 이전 문제</button><button class="button algorithm-hint-button" id="algorithm-hint">${state.hint?'텍스트 힌트 다시 보기':'텍스트 힌트'}</button><button class="button blue" id="algorithm-reveal">${state.reveal?'정답 · 해설 다시 보기':'정답 · 해설 공개'}</button><button class="outline-link" id="algorithm-next" ${algorithmIndex===9?'disabled':''}>다음 문제 →</button></div><p class="algorithm-footnote">진행자용 · 팀별 답안은 종이에 적고 동시에 공개해요. 그림은 상황을 표현한 창작 이미지이며, 자세한 조건은 힌트에서 확인할 수 있어요.</p>`;
 document.getElementById('algorithm-prev').onclick=()=>{if(algorithmIndex>0){algorithmIndex--;algorithmRemaining=60;drawAlgorithm();}};
 document.getElementById('algorithm-next').onclick=()=>{if(algorithmIndex<9){algorithmIndex++;algorithmRemaining=60;drawAlgorithm();}};
 document.getElementById('algorithm-hint').onclick=()=>showAlgorithmOverlay('hint');
 document.getElementById('algorithm-reveal').onclick=()=>showAlgorithmOverlay('reveal');
 document.getElementById('algorithm-projector').onclick=()=>{document.body.classList.toggle('projector-mode');drawAlgorithm();window.scrollTo(0,0);};
 document.getElementById('algorithm-timer').onclick=()=>{if(algorithmTimer){stopAlgorithmTimer();document.getElementById('algorithm-timer').textContent='▶ 이어서';return;}if(algorithmRemaining===0)algorithmRemaining=60;document.getElementById('algorithm-clock').textContent=algorithmClockText();document.getElementById('algorithm-timer').textContent='Ⅱ 일시 정지';algorithmTimer=setInterval(()=>{if(!document.body.classList.contains('play-view')||!document.querySelector('.algorithm-host')){stopAlgorithmTimer();return;}algorithmRemaining=Math.max(0,algorithmRemaining-1);document.getElementById('algorithm-clock').textContent=algorithmClockText();if(algorithmRemaining===0){stopAlgorithmTimer();document.getElementById('algorithm-timer').textContent='↺ 타이머 다시 시작';}},1000);};
}
const goToPlayBeforeAlgorithms=window.goToPlay;
window.goToPlay=function(event){stopAlgorithmTimer();document.body.classList.remove('projector-mode');const box=document.querySelector('.play-placeholder');box.classList.remove('algorithm-host');goToPlayBeforeAlgorithms(event);const chosen=event||EVENTS.find(e=>e.month===month);if(chosen.game==='algorithms')openAlgorithmQuiz();};
if(location.hash==='#play-10'){month=10;window.goToPlay(EVENTS.find(e=>e.month===10));}
window.addEventListener('popstate',()=>{if(location.hash==='#play-10'){month=10;window.goToPlay(EVENTS.find(e=>e.month===10));}else{stopAlgorithmTimer();document.body.classList.remove('projector-mode');}});
document.addEventListener('click',event=>{const a=event.target.closest('a');if(a&&a.getAttribute('href')!=='#play'){document.body.classList.remove('projector-mode');stopAlgorithmTimer();}});
