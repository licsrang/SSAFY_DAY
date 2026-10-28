const KEYWORD_QUESTIONS = [{"words":["햄버거","우주","바다"],"image":"./assets/keyword-1.png","prompt":"A giant hamburger floating above a blue ocean in outer space, starry sky and planets clearly visible."},{"words":["고양이","피자","달"],"image":"./assets/keyword-2.png","prompt":"A cute cat eating a large pizza on the surface of the crescent moon."},{"words":["강아지","우산","딸기"],"image":"./assets/keyword-3.png","prompt":"A cute puppy holding a large strawberry-pattern umbrella under a shower of oversized strawberries."},{"words":["토끼","당근","기차"],"image":"./assets/keyword-4.png","prompt":"A rabbit driving a small train whose carriages are giant carrots."},{"words":["공룡","아이스크림","눈사람"],"image":"./assets/keyword-5.png","prompt":"A friendly dinosaur sharing a huge ice cream cone with a snowman."},{"words":["펭귄","수박","사막"],"image":"./assets/keyword-6.png","prompt":"A penguin sitting on a giant sliced watermelon in a sandy desert with dunes."},{"words":["로봇","풍선","숲"],"image":"./assets/keyword-7.png","prompt":"A friendly robot holding a bunch of colorful balloons in a lush green forest."},{"words":["코끼리","자전거","무지개"],"image":"./assets/keyword-8.png","prompt":"An elephant riding a bicycle along a rainbow arch in the sky."},{"words":["곰","도넛","바다"],"image":"./assets/keyword-9.png","prompt":"A bear floating in the blue sea using a giant donut as a swim ring."},{"words":["오리","왕관","성"],"image":"./assets/keyword-10.png","prompt":"A yellow duck wearing a golden crown standing proudly in front of a fairy tale castle."}];
let round=0, outcomes=[], guessed=[], revealed=false, attempts=0, roundStates=[], hintsShown=false;
const aliases={'버거':'햄버거','우주공간':'우주','해양':'바다','바닷가':'바다','바닷물':'바다','개':'강아지','아이스크림콘':'아이스크림','눈사람인형':'눈사람','도너츠':'도넛','도너트':'도넛','왕관모자':'왕관','궁전':'성','열차':'기차','산림':'숲'};
function normalizeWord(s){const v=s.trim().replace(/\s+/g,'');return aliases[v]||v;}
function startKeywords(){round=0;outcomes=[];roundStates=[];resetRound();drawKeywords();}
function resetRound(){guessed=[];revealed=false;attempts=0;hintsShown=false;}
function rememberRound(){
 const input=document.getElementById('keyword-input');
 roundStates[round]={guessed:[...guessed],revealed,attempts,draft:input?input.value:'',hintsShown};
 outcomes[round]=guessed.length===3&&!revealed;
}
function moveRound(direction){
 if(direction<0&&round===0)return;
 rememberRound();round+=direction;
 const saved=roundStates[round];
 if(saved){guessed=[...saved.guessed];revealed=saved.revealed;attempts=saved.attempts;hintsShown=saved.hintsShown||false;}else resetRound();
 drawKeywords();
}
function keywordInitials(word){const consonants='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';return [...word].map(c=>{const n=c.charCodeAt(0)-44032;return n>=0&&n<=11171?consonants[Math.floor(n/588)]:c;}).join('');}
function drawKeywords(){
 const box=document.querySelector('.play-placeholder');box.classList.add('keyword-host');
 if(round>=KEYWORD_QUESTIONS.length){const hits=outcomes.filter(x=>x).length;box.innerHTML=`<div class="keyword-finish"><p class="eyebrow">ALL TEN, WELL PLAYED!</p><h2>우리의 상상력, 오늘도 충전 완료.</h2><div class="result-big">${hits} / 10</div><p>정답 공개 없이 세 단어를 모두 맞힌 문제 수예요.</p><button class="button blue" id="keyword-restart">다시 도전하기 ↗</button></div>`;document.getElementById('keyword-restart').onclick=startKeywords;return;}
 const q=KEYWORD_QUESTIONS[round];
 box.innerHTML=`<div class="keyword-heading"><span class="eyebrow">IMAGE KEYWORD GAME · 새로 만든 10문제</span><strong>${String(round+1).padStart(2,'0')} / 10</strong></div><div class="keyword-layout"><img class="keyword-picture" src="${q.image}" alt="키워드 세 개가 숨어 있는 ${round+1}번 문제 그림"><div class="keyword-controls"><p class="eyebrow">LOOK CLOSELY, GUESS THREE.</p><h2>이 그림의 키워드는?</h2><p>그림을 보고 쉬운 단어 세 개를 맞혀보세요.<br>순서는 상관없어요. 한 단어씩 입력해도 좋아요.</p><div class="keyword-slots" aria-live="polite">${q.words.map((w,i)=>`<span class="${guessed.includes(w)?'found':hintsShown&&!revealed?'hinted':''}">${guessed.includes(w)||revealed?w:hintsShown?keywordInitials(w):'키워드 '+(i+1)}</span>`).join('')}</div><form id="keyword-form"><label for="keyword-input">떠오르는 단어</label><input class="text-input" id="keyword-input" maxlength="80" autocomplete="off" placeholder="예: 책, 시계, 운동화" ${revealed||guessed.length===3?'disabled':''}><button class="button blue" ${revealed||guessed.length===3?'disabled':''}>정답 확인 ↗</button></form><p id="keyword-feedback" role="status" aria-live="polite">${revealed?'정답을 확인했어요. 다음 그림도 도전해볼까요?':guessed.length===3?'세 단어 모두 정답이에요! ☺':'맞힌 단어는 위에 하나씩 나타나요.'}</p><div class="keyword-actions"><button class="outline-link" id="keyword-hint" aria-pressed="${hintsShown}">${hintsShown?'초성 힌트 표시 중':'초성 힌트'}</button><button class="outline-link" id="keyword-reveal">정답 보기</button><button class="outline-link" id="keyword-prev" ${round===0?'disabled':''}>← 이전 문제</button><button class="button blue" id="keyword-next">${round===9?'결과 보기':'다음 문제 →'}</button></div><p class="local-hint">진행과 점수는 이 화면에서만 유지돼요. 새로고침하면 다시 시작합니다.</p></div></div>`;
 document.getElementById('keyword-form').onsubmit=ev=>{ev.preventDefault();const input=document.getElementById('keyword-input');const words=input.value.split(/[,，、\/\s]+/).filter(Boolean).map(normalizeWord);let added=0;words.forEach(w=>{if(q.words.includes(w)&&!guessed.includes(w)){guessed.push(w);added++;}});attempts++;rememberRound();drawKeywords();document.getElementById('keyword-feedback').textContent=guessed.length===3?'세 단어 모두 정답이에요! ☺':added?`${added}개를 더 맞혔어요! 현재 ${guessed.length} / 3`:'아직 새로운 정답이 없어요. 그림을 다시 살펴보세요.';if(guessed.length<3)document.getElementById('keyword-input').focus();};
 document.getElementById('keyword-hint').onclick=()=>{hintsShown=true;rememberRound();drawKeywords();document.getElementById('keyword-hint').focus();};
 document.getElementById('keyword-reveal').onclick=()=>{revealed=true;rememberRound();drawKeywords();};
 document.getElementById('keyword-prev').onclick=()=>moveRound(-1);
 document.getElementById('keyword-next').onclick=()=>moveRound(1);
 const saved=roundStates[round];
 if(saved){document.getElementById('keyword-input').value=saved.draft;}
}
const previousGoToPlay=window.goToPlay;
window.goToPlay=function(event){previousGoToPlay(event);const selected=event||EVENTS.find(e=>e.month===month);const box=document.querySelector('.play-placeholder');box.classList.remove('keyword-host');if(selected.game==='keywords')startKeywords();};
if(location.hash === '#play')window.goToPlay(EVENTS.find(e=>e.month===9));
