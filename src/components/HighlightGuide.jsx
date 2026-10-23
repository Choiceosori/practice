// 다음에 눌러야 할 곳을 반짝이게 하고, 작은 힌트 툴팁을 붙여요.
export default function HighlightGuide({ active, tip, tipSide = 'bottom', className = '', children }) {
  return (
    <div className={`relative ${active ? 'glow' : ''} ${className}`}>
      {children}
      {active && tip && (
        <div
          className={`pointer-events-none absolute left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-yellow-400 px-3 py-1 font-cute text-sm text-yellow-950 shadow-md sm:text-base ${
            tipSide === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'
          }`}
        >
          {tipSide === 'top' ? `${tip} 👇` : `👆 ${tip}`}
        </div>
      )}
    </div>
  )
}
