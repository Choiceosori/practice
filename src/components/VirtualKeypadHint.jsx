import { useEffect, useState } from 'react'

// 3단계: Shift + 2 = @ 를 보여주는 가상 키보드
const ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', 'Shift'],
]

export default function VirtualKeypadHint({ highlight = ['Shift', '2'], onKeyPress }) {
  const [pressed, setPressed] = useState({})

  useEffect(() => {
    const name = (e) => (e.key === 'Shift' ? 'Shift' : e.code?.startsWith('Digit') ? e.code.slice(5) : e.key.toUpperCase())
    const down = (e) => setPressed((p) => ({ ...p, [name(e)]: true }))
    const up = (e) => setPressed((p) => ({ ...p, [name(e)]: false }))
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return (
    <div className="rounded-2xl border-4 border-orange-200 bg-orange-50 p-3 shadow-inner">
      <p className="mb-2 text-center font-cute text-lg text-orange-800 sm:text-xl">
        <b className="text-orange-600">Shift</b> 키를 꾹 누른 채로 <b className="text-orange-600">2</b> 를 누르면{' '}
        <span className="rounded-lg bg-white px-2 text-2xl text-orange-600">@</span> 가 나와요!
      </p>
      <div className="mx-auto flex max-w-xl flex-col items-center gap-1">
        {ROWS.map((row, r) => (
          <div key={r} className="flex gap-1" style={{ marginLeft: r === 2 ? 12 : 0 }}>
            {row.map((k, i) => {
              const hl = highlight.includes(k)
              const down = pressed[k]
              const wide = k === 'Shift'
              return (
                <button
                  key={`${k}-${i}`}
                  type="button"
                  tabIndex={-1}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onKeyPress?.(k)}
                  className={`flex h-8 flex-col items-center justify-center rounded-md border-2 border-b-4 text-xs font-bold transition sm:h-10 sm:text-sm ${
                    wide ? 'w-14 sm:w-20' : 'w-6 sm:w-9'
                  } ${down ? 'translate-y-0.5 border-green-600 bg-green-400 text-white' : hl ? 'key-blink' : 'border-gray-300 bg-white text-gray-500'}`}
                >
                  {k === '2' && <span className="text-[10px] leading-none sm:text-xs">@</span>}
                  {k === 'Shift' ? '⇧ Shift' : k}
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-orange-700/80">
        태블릿이라면 화면 키보드의 <b>?123</b> 또는 <b>!#1</b> 버튼을 눌러 @ 를 찾아요. 위의 그림 키를 눌러서 입력할 수도 있어요.
      </p>
    </div>
  )
}
