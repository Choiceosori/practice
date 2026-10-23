import { Star, Volume2, VolumeX, Mic, MicOff, Home } from 'lucide-react'

const LABELS = ['로그인 찾기', '아이디·비밀번호', '골뱅이 @', '보안문자', '메일 보내기']

export default function StepHeader({ step, cleared, onJump, sound, voice, onToggleSound, onToggleVoice, onHome }) {
  return (
    <header className="no-print sticky top-0 z-30 border-b-4 border-yellow-300 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3 py-2 sm:gap-4 sm:px-4">
        <button
          onClick={onHome}
          className="flex shrink-0 items-center gap-1 rounded-xl px-2 py-1 font-cute text-lg text-amber-600 hover:bg-amber-50 sm:text-xl"
          title="처음 화면으로"
        >
          <Home size={20} />
          <span className="hidden sm:inline">로그인 마스터</span>
        </button>

        <ol className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
          {LABELS.map((label, i) => {
            const n = i + 1
            const done = cleared.includes(n)
            const current = n === step
            return (
              <li key={n}>
                <button
                  onClick={() => onJump(n)}
                  title={`${n}단계: ${label} (선생님용 이동)`}
                  className={`flex flex-col items-center rounded-xl px-1.5 py-1 transition sm:px-2 ${
                    current ? 'bg-yellow-100 ring-2 ring-yellow-400' : 'hover:bg-gray-50'
                  }`}
                >
                  <Star
                    size={current ? 30 : 24}
                    className={done ? 'fill-yellow-400 text-yellow-500' : current ? 'text-yellow-500' : 'text-gray-300'}
                  />
                  <span className={`hidden text-[11px] font-bold md:block ${current ? 'text-amber-700' : 'text-gray-400'}`}>
                    {n}. {label}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="flex shrink-0 gap-1">
          <button
            onClick={onToggleSound}
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
            title={sound ? '효과음 끄기' : '효과음 켜기'}
          >
            {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button
            onClick={onToggleVoice}
            className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
            title={voice ? '읽어주기 끄기' : '읽어주기 켜기'}
          >
            {voice ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
