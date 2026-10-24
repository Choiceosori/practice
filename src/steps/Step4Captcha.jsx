import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw, Volume2, ShieldAlert, Bot } from 'lucide-react'
import MockWindow from '../components/MockWindow'
import HighlightGuide from '../components/HighlightGuide'
import { sfx, speak, settings } from '../lib/feedback'

// 헷갈리는 글자(0/O, 1/I/L, 2/Z, 5/S, 8/B)는 빼고 만들어요.
const CHARS = 'ACDEFHKMNPRTWXY34679'
const SAY = {
  A: '에이', C: '씨', D: '디', E: '이', F: '에프', H: '에이치', K: '케이', M: '엠', N: '엔', P: '피',
  R: '알', T: '티', W: '더블유', X: '엑스', Y: '와이', 3: '숫자 삼', 4: '숫자 사', 6: '숫자 육', 7: '숫자 칠', 9: '숫자 구',
}

function makeCode() {
  return Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

function drawCaptcha(canvas, code) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height
  const bg = ctx.createLinearGradient(0, 0, w, h)
  bg.addColorStop(0, '#e0f2fe')
  bg.addColorStop(1, '#fef3c7')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  // 방해 점과 선
  for (let i = 0; i < 60; i++) {
    ctx.fillStyle = `hsla(${Math.random() * 360},60%,60%,0.5)`
    ctx.beginPath()
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `hsla(${Math.random() * 360},50%,50%,0.45)`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, Math.random() * h)
    ctx.bezierCurveTo(w / 3, Math.random() * h, (2 * w) / 3, Math.random() * h, w, Math.random() * h)
    ctx.stroke()
  }
  // 삐뚤빼뚤 글자
  const step = w / (code.length + 1)
  ;[...code].forEach((c, i) => {
    ctx.save()
    ctx.translate(step * (i + 1), h / 2 + (Math.random() - 0.5) * 14)
    ctx.rotate((Math.random() - 0.5) * 0.7)
    ctx.font = `900 ${50 + Math.random() * 10}px "Noto Sans KR", sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = `hsl(${200 + Math.random() * 120},55%,32%)`
    ctx.fillText(c, 0, 0)
    ctx.restore()
  })
}

export default function Step4Captcha({ say, nudge, onClear }) {
  const [code, setCode] = useState(makeCode)
  const [value, setValue] = useState('')
  const [upper, setUpper] = useState(true)
  const [looked, setLooked] = useState(false)
  const canvasRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    say('삐리릭! 🤖 내가 로봇이 아니라는 걸 증명해요. 반짝이는 그림을 눌러 글자를 잘 보고, 똑같이 따라 써봐요!')
  }, [say])

  useEffect(() => {
    if (canvasRef.current) drawCaptcha(canvasRef.current, code)
  }, [code])

  const refresh = useCallback(() => {
    sfx.click()
    setCode(makeCode())
    setValue('')
    say('새 그림으로 바꿨어요! 글자가 잘 안 보이면 언제든 새로고침을 눌러도 돼요.')
  }, [say])

  const listen = () => {
    const words = [...code].map((c) => SAY[c]).join(', ')
    if (settings.voice) speak(`보안문자는 ${words} 입니다.`, { rate: 0.7 })
    else say(`보안문자는 ${words} 예요. (읽어주기를 켜면 소리로 들을 수 있어요)`)
  }

  const shown = upper ? value.toUpperCase() : value
  const target = !looked ? 'image' : shown.length < code.length ? 'input' : 'confirm'

  const onType = (v) => {
    const clean = v.replace(/\s/g, '').slice(0, 6)
    setValue(clean)
    if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(clean)) say('앗, 한글이 써졌어요! [한/영] 키를 눌러 영어로 바꿔요.', 'oops')
    else if (!upper && clean !== clean.toUpperCase())
      say('보안문자는 모두 대문자예요. 아래 [대문자로 자동 바꾸기]를 켜면 편해요!', 'oops')
    else if (clean.length === code.length) say('다 썼으면 파란 [확인] 버튼을 눌러요!')
  }

  const confirm = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (shown === code) {
      onClear()
      return
    }
    if (shown.length < code.length) {
      nudge(`글자가 ${code.length}개 있어요. 그림을 보고 끝까지 써봐요!`)
    } else {
      nudge('아쉬워요, 글자가 조금 달라요. 그림을 다시 보고 써봐요. 어려우면 🔄 새로고침!')
    }
    inputRef.current?.focus()
  }

  return (
    <MockWindow
      url="https://accounts.haneul-account.kr/challenge (연습용)"
      onBackgroundClick={() => nudge('반짝이는 곳을 눌러야 해요! 노란 테두리를 찾아봐요.')}
    >
      <div className="flex justify-center bg-white px-4 py-8">
        <form
          onSubmit={confirm}
          onClick={(e) => e.stopPropagation()}
          autoComplete="off"
          className="w-full max-w-md rounded-3xl border border-gray-200 px-6 py-8 sm:px-10"
        >
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-amber-800">
            <ShieldAlert className="shrink-0" />
            <p className="text-sm">
              <b>보안 확인이 필요해요.</b>
              <br />
              로봇이 아닌지 확인하기 위해 그림 속 글자를 입력하세요.
            </p>
          </div>

          <HighlightGuide active={target === 'image'}>
            <button
              type="button"
              onClick={() => {
                setLooked(true)
                sfx.click()
                say('잘 봤나요? 글자를 하나씩 소리 내어 읽어보고, 아래 칸에 써봐요.')
                setTimeout(() => inputRef.current?.focus(), 200)
              }}
              className="block w-full overflow-hidden rounded-lg border-2 border-gray-300"
            >
              <canvas ref={canvasRef} width={320} height={100} className="h-auto w-full" />
            </button>
          </HighlightGuide>

          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={refresh} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50">
              <RefreshCw size={16} /> 새로고침
            </button>
            <button type="button" onClick={listen} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50">
              <Volume2 size={16} /> 소리 듣기
            </button>
          </div>

          <HighlightGuide active={target === 'input'} tip="그림 속 글자를 써요" className="mt-4">
            <input
              ref={inputRef}
              value={shown}
              onChange={(e) => onType(e.target.value)}
              onFocus={() => setLooked(true)}
              placeholder="보안문자 입력"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className={`w-full rounded-md border-2 border-gray-300 px-3 py-3 text-center font-mono text-3xl outline-none placeholder:font-sans placeholder:text-xl ${shown ? 'tracking-[0.4em]' : ''} focus:border-sky-600`}
            />
          </HighlightGuide>

          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="h-5 w-5 accent-sky-600" />
            대문자로 자동 바꾸기 (a → A)
          </label>

          <div className="mt-6 flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Bot size={16} /> 나는 로봇이 아니에요
            </span>
            <HighlightGuide active={target === 'confirm'} tip="확인!" tipSide="top">
              <button type="submit" className="rounded-full bg-sky-600 px-6 py-2.5 text-lg font-bold text-white hover:bg-sky-700">
                확인
              </button>
            </HighlightGuide>
          </div>
        </form>
      </div>
    </MockWindow>
  )
}
