import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import MockWindow from '../components/MockWindow'
import HighlightGuide from '../components/HighlightGuide'
import PracticeNote from '../components/PracticeNote'
import VirtualKeypadHint from '../components/VirtualKeypadHint'
import { checkTyping, sfx } from '../lib/feedback'

const EMAIL = 'class1@school.com'

function SkyLogo() {
  return (
    <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-sky-600">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-lg text-white">☁</span>
      하늘계정
    </div>
  )
}

export default function Step3GoogleEmail({ say, nudge, onClear }) {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState(false)
  const [shiftLatched, setShiftLatched] = useState(false)
  const gotAt = useRef(false)
  const inputRef = useRef(null)

  const check = checkTyping(email, EMAIL, { ignoreCase: true })
  const done = check.state === 'done'

  useEffect(() => {
    say('학교 계정에는 꼭 들어가는 마법의 기호 @(골뱅이)가 있어요! 반짝이는 이메일 칸을 눌러봐요.')
  }, [say])

  const update = (v) => {
    setEmail(v)
    const c = checkTyping(v, EMAIL, { ignoreCase: true })
    if (v.includes('@') && !gotAt.current) {
      gotAt.current = true
      sfx.ding()
      say('우와! 골뱅이 @ 를 입력했어요! 🎉 이제 school.com 을 마저 써봐요.', 'happy')
      return
    }
    if (c.state === 'done') {
      sfx.click()
      say('이메일 주소를 다 썼어요! 파란색 [다음] 버튼을 눌러요.', 'happy')
    } else if (c.hint) say(c.hint, 'oops')
    else if (v === 'class1') say('좋아요! 이제 Shift 키를 꾹 누른 채로 숫자 2 를 눌러 @ 를 만들어요.')
  }

  // 그림 키보드를 눌러서도 입력할 수 있어요 (터치 화면용)
  const onVirtualKey = (k) => {
    if (k === 'Shift') {
      setShiftLatched((s) => !s)
      return
    }
    let ch = k.toLowerCase()
    if (k === '2' && shiftLatched) ch = '@'
    setShiftLatched(false)
    update(email + ch)
    inputRef.current?.focus()
  }

  const next = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!done) {
      nudge(email.includes('@') ? '아직 이메일이 다 맞지 않아요. 쪽지를 다시 봐요!' : '아직 @ 골뱅이가 없어요! Shift + 2 를 눌러봐요.')
      inputRef.current?.focus()
    } else onClear()
  }

  const target = done ? 'next' : 'email'

  return (
    <div className="space-y-4">
      <PracticeNote items={[['이메일', EMAIL]]} />
      <MockWindow
        url="https://accounts.haneul-account.kr/signin (연습용)"
        onBackgroundClick={() => nudge('반짝이는 곳을 눌러야 해요! 노란 테두리를 찾아봐요.')}
      >
        <div className="flex justify-center bg-white px-4 py-8">
          <form
            onSubmit={next}
            onClick={(e) => e.stopPropagation()}
            autoComplete="off"
            className="w-full max-w-md rounded-3xl border border-gray-200 px-6 py-8 sm:px-10"
          >
            <SkyLogo />
            <h2 className="mt-4 text-center text-2xl">로그인</h2>
            <p className="mb-6 mt-1 text-center text-gray-600">이메일 또는 휴대전화</p>

            <HighlightGuide active={target === 'email'} tip="여기를 누르고 이메일을 써요">
              <div className="relative">
                <input
                  ref={inputRef}
                  value={email}
                  onChange={(e) => update(e.target.value)}
                  onFocus={() => setFocused(true)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="email"
                  className="peer w-full rounded-md border-2 border-gray-300 px-3 pb-2 pt-5 text-xl outline-none focus:border-sky-600"
                />
                <span className="pointer-events-none absolute left-3 top-1 text-xs text-gray-500 peer-focus:text-sky-600">
                  이메일 또는 휴대전화
                </span>
                {done && <Check className="absolute right-3 top-4 text-green-600" />}
              </div>
            </HighlightGuide>

            {/* @ 강조 미리보기 */}
            {email && (
              <p className="mt-3 break-all text-center font-mono text-2xl">
                {[...email].map((c, i) => (
                  <span key={i} className={c === '@' ? 'mx-0.5 rounded bg-orange-200 px-1 font-black text-orange-600' : ''}>
                    {c}
                  </span>
                ))}
              </p>
            )}

            <p className="mt-4 text-sm text-sky-700">이메일을 잊으셨나요?</p>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-sm font-bold text-sky-700">계정 만들기</span>
              <HighlightGuide active={target === 'next'} tip="다음!" tipSide="top">
                <button
                  type="submit"
                  className={`rounded-full px-6 py-2.5 text-lg font-bold text-white ${done ? 'bg-sky-600 hover:bg-sky-700' : 'bg-sky-600/50'}`}
                >
                  다음
                </button>
              </HighlightGuide>
            </div>
          </form>
        </div>
      </MockWindow>

      {focused && !done && (
        <div onClick={(e) => e.stopPropagation()}>
          {shiftLatched && (
            <p className="mb-1 text-center font-bold text-orange-700">⇧ Shift 가 눌려 있어요! 이제 2 를 눌러요.</p>
          )}
          <VirtualKeypadHint onKeyPress={onVirtualKey} />
        </div>
      )}
    </div>
  )
}
