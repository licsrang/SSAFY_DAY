# SSAFY DAY
매달 하루, 우리답게. 우리 반의 월별 이벤트 아지트입니다.

## 사용
index.html을 열거나 GitHub Pages로 게시하세요. 별도 설치가 필요 없습니다.
GitHub 저장소 Settings → Pages → Deploy from a branch → main / (root) → Save.
게시 주소: https://licsrang.github.io/SSAFY_DAY/ (Pages 설정 후 사용 가능)

## 매월 수정
`events.js`의 EVENTS에 월별 객체를 추가하거나 수정합니다.
month: 월 / title: 제목 / poster: 포스터 문구 / desc: 안내 / game: bingo, quiz, mission / icon: 기호.
실제 일정과 장소는 app.js의 안내 문구를 수정하세요. 현재 콘텐츠는 모두 기획 예시입니다.
완료 행사 기록은 실제 행사 이후 내용을 확인해 추가해주세요. 현재 완료 기록은 없습니다.

## 기능과 범위
월별 탭, 월별 링크 복사, 친구 빙고, 개발 상식 퀴즈, 감사 미션 뽑기, 준비 체크.
체크와 빙고는 방문자의 브라우저에만 저장됩니다. 공동 참여 집계나 서버 저장은 없습니다.
외부 Google Fonts가 없어도 시스템 글꼴로 표시됩니다. SSAFY 공식 사이트가 아닙니다.
