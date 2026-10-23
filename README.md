# 🎒 키즈 로그인 마스터

초등학교 저학년(1~3학년)이 **로그인 → 이메일 주소(@) → 보안문자 → 메일 보내기**를 5단계로 연습하는 교육용 웹앱입니다.

| 단계 | 연습 화면 | 배우는 것 |
|---|---|---|
| 1 | 초록포털 메인 (네이버 같은 화면) | 로그인 버튼 찾아 클릭하기 |
| 2 | 초록포털 로그인 | 아이디 `student1` / 비밀번호 `1234`, 비밀번호가 ●●●● 로 가려지는 이유 |
| 3 | 하늘계정 로그인 (구글 같은 화면) | `class1@school.com` — Shift + 2 로 `@` 입력 (가상 키보드 힌트) |
| 4 | 보안 확인 | 삐뚤빼뚤 보안문자 따라 쓰기, 새로고침·소리 듣기, 대문자 자동 변환 |
| 5 | 웹메일 | 메일 쓰기 → 받는 사람 `teacher@school.com` → 제목 → 보내기 → 🏆 임명장 |

## 아이들을 위한 장치
- 다음에 누를 곳에 **노란 형광 테두리 + 펄스**, 짧은 말풍선 툴팁
- 엉뚱한 곳을 누르면 **흔들림 + 도우미 토토의 안내** (효과음·브라우저 한국어 음성)
- 입력 실수 자동 감지: **한글로 입력됨(한/영 키)**, **Caps Lock**, 글자 초과/오타
- 성공 시 색종이 팡파르와 "딩-동!" 효과음, 마지막엔 이름이 들어간 **인쇄용 임명장**
- 효과음 파일 없이 Web Audio로 소리를 만들어서 별도 에셋이 필요 없어요.

## 선생님용 팁
- 위쪽 ⭐ 를 누르면 원하는 단계로 바로 이동합니다.
- 오른쪽 위에서 🔊 효과음 / 🎤 읽어주기를 켜고 끌 수 있어요.
- 모든 화면은 **연습용 모의 화면**입니다. 입력값은 어디에도 전송·저장되지 않습니다.
- 실제 브랜드(네이버·구글) 로고/이름 대신 "초록포털", "하늘계정"을 썼습니다. 실제 로그인 화면을 그대로 흉내 낸 페이지는
  피싱 사이트로 자동 차단(Google Safe Browsing 등)될 수 있기 때문이에요. 수업 때 "네이버처럼 생긴 화면"이라고 소개해 주세요.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 에 배포용 파일 생성
```

## 배포 (GitHub + Vercel)

```bash
git remote add origin https://github.com/<내 아이디>/kids-login-master.git
git push -u origin main
```

Vercel → **Add New… → Project** → 저장소 Import → Framework Preset `Vite` → **Deploy**.

## 구조

```
src/
├── components/
│   ├── StepHeader.jsx         # 1~5단계 별 진행 표시, 효과음/음성 토글
│   ├── HighlightGuide.jsx     # 반짝이는 강조 테두리 + 힌트 툴팁
│   ├── VirtualKeypadHint.jsx  # Shift + 2 = @ 가상 키보드 (눌러서 입력도 가능)
│   ├── CharacterHelper.jsx    # 말풍선 도우미 토토
│   ├── MockWindow.jsx         # 브라우저 모양 틀 ("연습 화면" 배지)
│   └── PracticeNote.jsx       # 연습용 아이디/비밀번호 쪽지
├── steps/Step1PortalHome.jsx … Step5SendMail.jsx
├── lib/feedback.js            # 효과음, 음성 읽기, 색종이, 입력 실수 감지
└── App.jsx                    # 시작 화면, 성공 팝업, 임명장
```

기술: Vite + React, Tailwind CSS v4, framer-motion, canvas-confetti, lucide-react
