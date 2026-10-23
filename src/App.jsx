import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Printer, RotateCcw, ArrowRight } from 'lucide-react'
import StepHeader from './components/StepHeader'
import CharacterHelper from './components/CharacterHelper'
import Step1PortalHome from './steps/Step1PortalHome'
import Step2SimpleLogin from './steps/Step2SimpleLogin'
import Step3GoogleEmail from './steps/Step3GoogleEmail'
import Step4Captcha from './steps/Step4Captcha'
import Step5SendMail from './steps/Step5SendMail'
import { celebrate, settings, sfx, speak, stopSpeaking } from './lib/feedback'

const STEPS = [null, Step1PortalHome, Step2SimpleLogin, Step3GoogleEmail, Step4Captcha, Step5SendMail]

const PRAISE = [
  null,
  ['로그인 버튼을 찾았어요!', '인터넷에서 "나야!" 하고 알려주는 문을 찾은 거예요.'],
  ['로그인 성공!', '아이디와 비밀번호를 순서대로 잘 썼어요.'],
  ['골뱅이 @ 마스터!', 'Shift + 2 로 이메일 주소를 완성했어요.'],
  ['보안 통과!', '나는 로봇이 아니라는 걸 증명했어요. 🤖❌'],
]

function Intro({ student, setStudent, onStart }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 py-8 text-center">
      <div className="bounce-soft text-7xl">🎒</div>
      <h1 className="mt-2 font-cute text-5xl text-amber-600 sm:text-6xl">키즈 로그인 마스터</h1>
      <p className="mt-3 font-cute text-xl text-gray-700 sm:text-2xl">
        토토와 함께 로그인하고 메일 보내는 법을 배워요!
      </p>

      <ol className="mx-auto mt-6 grid max-w-xl gap-2 text-left font-cute text-lg sm:grid-cols-2">
        {['⭐ 로그인 버튼 찾기', '⭐ 아이디·비밀번호 쓰기', '⭐ 골뱅이 @ 쓰기', '⭐ 보안문자 따라 쓰기', '⭐ 선생님께 메일 보내기'].map((t, i) => (
          <li key={t} className="rounded-xl bg-white px-4 py-2 shadow-sm">
            <span className="mr-1 text-amber-500">{i + 1}단계</span> {t.slice(2)}
          </li>
        ))}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onStart()
        }}
        className="mx-auto mt-8 max-w-md space-y-3 rounded-3xl border-4 border-yellow-300 bg-white p-6 shadow-lg"
      >
        <p className="font-cute text-xl">내 이름을 알려줘요 (임명장에 들어가요!)</p>
        <div className="flex gap-2">
          <input
            value={student.klass}
            onChange={(e) => setStudent((s) => ({ ...s, klass: e.target.value }))}
            placeholder="1학년 1반"
            className="w-32 rounded-xl border-2 border-gray-200 px-3 py-3 text-center text-lg outline-none focus:border-amber-400"
          />
          <input
            value={student.name}
            onChange={(e) => setStudent((s) => ({ ...s, name: e.target.value }))}
            placeholder="이름"
            className="min-w-0 flex-1 rounded-xl border-2 border-gray-200 px-3 py-3 text-center text-lg outline-none focus:border-amber-400"
          />
        </div>
        <button type="submit" className="glow flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 py-4 font-cute text-2xl text-amber-950 hover:bg-amber-500">
          시작하기 <ArrowRight />
        </button>
      </form>

      <details className="mx-auto mt-8 max-w-xl rounded-2xl bg-white/70 p-4 text-left text-sm text-gray-600">
        <summary className="cursor-pointer font-bold">👩‍🏫 선생님께</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>모든 화면은 실제 사이트가 아닌 <b>연습용 모의 화면</b>이에요. 입력한 내용은 어디에도 전송·저장되지 않아요.</li>
          <li>위쪽 별(⭐)을 누르면 원하는 단계로 바로 이동할 수 있어요.</li>
          <li>🔊 효과음, 🎤 읽어주기(브라우저 음성)는 오른쪽 위에서 켜고 끌 수 있어요.</li>
          <li>"초록포털"은 네이버, "하늘계정"은 구글처럼 생긴 연습 화면이라고 소개해 주세요.</li>
        </ul>
      </details>
    </motion.div>
  )
}

function SuccessModal({ step, onNext }) {
  const [title, desc] = PRAISE[step]
  return (
    <motion.div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        initial={{ scale: 0.7, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="w-full max-w-sm rounded-3xl border-4 border-yellow-300 bg-white p-6 text-center shadow-2xl"
      >
        <div className="text-6xl">🎉</div>
        <h2 className="mt-2 font-cute text-3xl text-green-600">{title}</h2>
        <p className="mt-2 font-cute text-lg text-gray-700">{desc}</p>
        <div className="my-3 text-3xl">{'⭐'.repeat(step)}</div>
        <button autoFocus onClick={onNext} className="glow mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 py-3 font-cute text-2xl text-white hover:bg-green-600">
          {step + 1}단계로 가기 <ArrowRight />
        </button>
      </motion.div>
    </motion.div>
  )
}

function Certificate({ student, onRestart }) {
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl px-4 py-8">
      <div className="relative rounded-3xl border-[10px] border-double border-amber-400 bg-gradient-to-b from-amber-50 to-white p-8 text-center shadow-xl sm:p-12">
        <div className="text-7xl">🏆</div>
        <h1 className="mt-2 font-cute text-5xl text-amber-600 sm:text-6xl">임 명 장</h1>
        <p className="mt-6 font-cute text-2xl text-gray-700">{student.klass}</p>
        <p className="font-cute text-4xl text-gray-900 sm:text-5xl">{student.name || '친구'}</p>
        <p className="mx-auto mt-6 max-w-md font-cute text-xl leading-relaxed text-gray-700 sm:text-2xl">
          위 어린이는 로그인 버튼 찾기, 아이디·비밀번호 입력, 골뱅이 @ 쓰기, 보안문자 통과, 메일 보내기의 다섯 가지 미션을 모두 완수하였기에
          <br />
          <b className="text-amber-600">“로그인 마스터”</b>로 임명합니다.
        </p>
        <div className="mt-6 text-4xl">⭐⭐⭐⭐⭐</div>
        <p className="mt-6 text-gray-500">{today}</p>
        <p className="font-cute text-xl text-gray-700">키즈 로그인 마스터 🐰 토토</p>
      </div>
      <div className="no-print mt-6 flex justify-center gap-3">
        <button onClick={() => window.print()} className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-cute text-xl shadow hover:bg-gray-50">
          <Printer /> 인쇄하기
        </button>
        <button onClick={onRestart} className="flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-cute text-xl text-amber-950 shadow hover:bg-amber-500">
          <RotateCcw /> 처음부터 다시
        </button>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [step, setStep] = useState(0) // 0: 시작, 1~5: 단계, 6: 임명장
  const [cleared, setCleared] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [helper, setHelper] = useState({ message: '', mood: 'normal' })
  const [shaking, setShaking] = useState(false)
  const shakeTimer = useRef(null)
  const [sound, setSound] = useState(true)
  const [voice, setVoice] = useState(true)
  const [student, setStudent] = useState({ klass: '1학년 1반', name: '' })
  const lastSpoken = useRef('')

  useEffect(() => {
    settings.sound = sound
    settings.voice = voice
    if (!voice) stopSpeaking()
  }, [sound, voice])

  const say = useCallback((message, mood = 'normal') => {
    setHelper({ message, mood })
    if (lastSpoken.current !== message) {
      lastSpoken.current = message
      speak(message)
    }
  }, [])

  const nudge = useCallback(
    (message) => {
      sfx.oops()
      // 컴포넌트를 다시 만들지 않고 클래스만 껐다 켜서 입력값을 지켜요.
      setShaking(false)
      clearTimeout(shakeTimer.current)
      requestAnimationFrame(() => setShaking(true))
      shakeTimer.current = setTimeout(() => setShaking(false), 500)
      lastSpoken.current = ''
      say(message, 'oops')
    },
    [say],
  )

  const goTo = (n) => {
    stopSpeaking()
    lastSpoken.current = ''
    setShowSuccess(false)
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearStep = useCallback(() => {
    setCleared((c) => (c.includes(step) ? c : [...c, step]))
    if (step === 5) {
      sfx.fanfare()
      celebrate(true)
      setStep(6)
      speak('모든 미션 완수! 축하해요, 이제 로그인 마스터예요!')
      return
    }
    sfx.ding()
    celebrate()
    setShowSuccess(true)
    speak(PRAISE[step][0])
  }, [step])

  const restart = () => {
    setCleared([])
    goTo(0)
  }

  const Step = STEPS[step]

  return (
    <div className="min-h-screen font-sans">
      {step >= 1 && (
        <StepHeader
          step={Math.min(step, 5)}
          cleared={cleared}
          onJump={goTo}
          sound={sound}
          voice={voice}
          onToggleSound={() => setSound((s) => !s)}
          onToggleVoice={() => setVoice((v) => !v)}
          onHome={() => goTo(0)}
        />
      )}

      {step === 0 && <Intro student={student} setStudent={setStudent} onStart={() => goTo(1)} />}

      {Step && (
        <main className="mx-auto max-w-5xl px-3 pb-16 pt-4 sm:px-4">
          <div className="mb-4">
            <p className="mb-1 font-cute text-lg text-amber-600">{step}단계 미션</p>
            <CharacterHelper message={helper.message} mood={helper.mood} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
              <div className={shaking ? 'shake' : ''}>
                <Step say={say} nudge={nudge} onClear={clearStep} student={{ ...student, name: student.name || '홍길동' }} />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {step === 6 && <Certificate student={student} onRestart={restart} />}

      <AnimatePresence>{showSuccess && step < 5 && <SuccessModal step={step} onNext={() => goTo(step + 1)} />}</AnimatePresence>
    </div>
  )
}
