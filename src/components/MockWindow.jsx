import { Lock, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react'

// 웹 브라우저처럼 생긴 연습용 틀
export default function MockWindow({ url, children, className = '', onBackgroundClick }) {
  return (
    <div className={`overflow-hidden rounded-2xl border-2 border-gray-300 bg-white shadow-xl ${className}`}>
      <div className="flex items-center gap-2 border-b bg-gray-100 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="hidden gap-1 text-gray-400 sm:flex">
          <ChevronLeft size={18} />
          <ChevronRight size={18} />
          <RotateCw size={16} />
        </div>
        <div className="flex flex-1 items-center gap-1.5 truncate rounded-full bg-white px-3 py-1 text-sm text-gray-600">
          <Lock size={13} className="shrink-0 text-green-600" />
          <span className="truncate">{url}</span>
        </div>
        <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">연습 화면</span>
      </div>
      <div onClick={onBackgroundClick}>{children}</div>
    </div>
  )
}
