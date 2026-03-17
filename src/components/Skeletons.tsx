'use client'

export function NoteCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
      
      <div className="space-y-2 mb-3">
        <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>

      <div className="flex items-center justify-between text-xs bg-gray-100 p-3 rounded border-t">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

export function NoteGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NoteCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HeaderSkeleton() {
  return (
    <header className="bg-slate-800 h-16 animate-pulse">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          <div className="w-24 h-5 bg-gray-600 rounded"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-32 h-4 bg-gray-600 rounded"></div>
          <div className="w-8 h-8 bg-gray-600 rounded"></div>
        </div>
      </div>
    </header>
  )
}
