const playPage = document.getElementById('play-page');
const mainSections = [...document.querySelector('main').children].filter(el => el !== playPage);
const navLinks = [...document.querySelectorAll('nav a')];
function setPlayView(show) {
  mainSections.forEach(el => el.hidden = show);
  playPage.hidden = !show;
  document.body.classList.toggle('play-view', show);
  navLinks.forEach(el => {
    const active = show ? el.id === 'play-nav' : el.getAttribute('href') === '#monthly';
    el.classList.toggle('nav-active', active);
    if (active) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current');
  });
}
document.addEventListener('click', ev => {
  const link = ev.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href === '#play') {
    ev.preventDefault(); setPlayView(true); history.pushState(null,'','#play'); window.scrollTo(0,0);
  } else if (href && href.startsWith('#')) {
    setPlayView(false);
  }
});
window.addEventListener('popstate', () => setPlayView(location.hash === '#play'));
setPlayView(location.hash === '#play');
window.goToPlay = function(event) {
  const chosen = event || EVENTS.find(e => e.month === month);
  setPlayView(true);
  history.pushState(null,'','#play');
  window.scrollTo(0,0);
  const box = document.querySelector('.play-placeholder');
  box.replaceChildren();
  const symbol = document.createElement('span'); symbol.textContent='▧'; symbol.setAttribute('aria-hidden','true');
  const title = document.createElement('h2'); title.textContent=chosen.title;
  const description = document.createElement('p'); description.textContent=chosen.desc;
  const status = document.createElement('p');
  status.textContent = chosen.game === 'keywords' ? '당시 사용한 이미지와 정답 키워드를 준비 중이에요.' : '진행 방식이 정해지면 이곳에서 참여할 수 있어요.';
  const label = document.createElement('p'); label.className='eyebrow'; label.textContent=chosen.month+'월 · '+(chosen.completed?'지난 이벤트':'기획 예시');
  box.append(label,symbol,title,description,status);
};
document.getElementById('play-nav').addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); window.goToPlay(); });
