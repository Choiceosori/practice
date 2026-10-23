import { useEffect, useRef, useState } from 'react'
import { User, KeyRound, Check, Eye, EyeOff } from 'lucide-react'
import MockWindow from '../components/MockWindow'
import HighlightGuide from '../components/HighlightGuide'
import PracticeNote from '../components/PracticeNote'
import { checkTyping, sfx } from '../lib/feedback'

const ID = 'student1'
const PW = '1234'

export default function Step2SimpleLogin({ say, nudge, onClear }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const pwRef = useRef(null)
  const idRef = useRef(null)

  const idCheck = checkTyping(id, ID)
  const pwCheck = checkTyping(pw, PW)
  const idDone = idCheck.state === 'done'
  const pwDone = pwCheck.state === 'done'
  const target = !idDone ? 'id' : !pwDone ? 'pw' : 'button'

  useEffect(() => {
    say('정해진 연습용 아이디와 비밀번호를 순서대로 입력해보아요! 먼저 반짝이는 [아이디] 칸을 눌러요.')
  }, [say])

  const onId = (v) => {
    setId(v)
    const c = checkTyping(v, ID)
    if (c.state === 'done') {
      sfx.click()
      say('아이디를 다 썼어요! 👏 이제 아래 [비밀번호] 칸에 1234 를 써봐요.', 'happy')
      setTimeout(() => pwRef.current?.focus(), 350)
    } else if (c.hint) say(c.hint, 'oops')
    else if (c.state === 'ok') say('좋아요! 쪽지를 보고 student1 을 한 글자씩 써봐요.')
  }

  const onPw = (v) => {
    setPw(v)
    const c = checkTyping(v, PW)
    if (c.state === 'done') {
      sfx.click()
      say('완벽해요! 이제 초록색 [로그인] 버튼을 눌러요.', 'happy')
    } else if (c.hint) say(c.hint, 'oops')
    else if (c.state === 'ok')
      say('글자가 까만 점 ●●●● 으로 바뀌었죠? 비밀번호는 다른 사람에게 보이면 안 되니까 숨겨주는 거예요!')
  }

  const submit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!idDone) {
      nudge('아직 아이디가 다 맞지 않아요. 아이디 칸부터 채워봐요!')
      idRef.current?.focus()
    } else if (!pwDone) {
      nudge('비밀번호를 먼저 써야 해요. 쪽지를 보고 1234 를 써봐요!')
      pwRef.current?.focus()
    } else onClear()
  }

  const status = (c) =>
    c.state === 'done' ? <Check className="text-green-600" size={22} /> : c.hint ? <span className="text-lg">⚠️</span> : null

  return (
    <div className="space-y-4">
      <PracticeNote items={[['아이디', ID], ['비밀번호', PW]]} />
      <MockWindow
        url="https://nid.chorok-portal.kr/login (연습용)"
        onBackgroundClick={() => nudge('반짝이는 칸을 눌러야 해요! 노란 테두리를 찾아봐요.')}
      >
        <div className="flex justify-center bg-white px-4 py-8 sm:py-10">
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm" autoComplete="off">
            <h2 className="mb-6 text-center text-4xl font-black text-[#03c75a]">초록포털</h2>
            <div className="space-y-4 rounded-xl border-2 border-gray-200 p-4">
              <HighlightGuide active={target === 'id'} tip="여기를 누르고 아이디를 써요">
                <label className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-3 py-3 focus-within:border-[#03c75a]">
                  <User className="text-gray-400" />
                  <input
                    ref={idRef}
                    value={id}
                    onChange={(e) => onId(e.target.value)}
                    placeholder="아이디"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="w-full text-xl outline-none"
                  />
                  {status(idCheck)}
                </label>
              </HighlightGuide>
              <HighlightGuide active={target === 'pw'} tip="비밀번호를 써요">
                <label className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-3 py-3 focus-within:border-[#03c75a]">
                  <KeyRound className="text-gray-400" />
                  <input
                    ref={pwRef}
                    type={showPw ? 'text' : 'password'}
                    value={pw}
                    onChange={(e) => onPw(e.target.value)}
                    placeholder="비밀번호"
                    autoComplete="new-password"
                    inputMode="numeric"
                    className="w-full text-xl tracking-widest outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="text-gray-400 hover:text-gray-600"
                    title={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                  >
                    {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {status(pwCheck)}
                </label>
              </HighlightGuide>
              <HighlightGuide active={target === 'button'} tip="마지막으로 꾹!">
                <button
                  type="submit"
                  className={`w-full rounded-lg py-3 text-xl font-black text-white transition ${
                    target === 'button' ? 'bg-[#03c75a] hover:bg-[#02b350]' : 'bg-[#03c75a]/50'
                  }`}
                >
                  로그인
                </button>
              </HighlightGuide>
            </div>
          </form>
        </div>
      </MockWindow>
    </div>
  )
}
