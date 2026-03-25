"use client";

const SKELETON_HEIGHTS = [
  "h-28",
  "h-40",
  "h-32",
  "h-48",
  "h-36",
  "h-28",
  "h-44",
  "h-32",
];

interface NoteCardSkeletonProps {
  index?: number;
}

export function NoteCardSkeleton({ index = 0 }: NoteCardSkeletonProps) {
  const height = SKELETON_HEIGHTS[index % SKELETON_HEIGHTS.length];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 animate-pulse border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-5 bg-gray-200 rounded" />
      </div>

      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />

      <div className={`space-y-2 mb-3 ${height}`}>
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-4/6 bg-gray-200 rounded" />
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex gap-1">
          <div className="h-5 w-10 bg-gray-200 rounded-md" />
          <div className="h-5 w-12 bg-gray-200 rounded-md" />
        </div>
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function NoteGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="columns-2 lg:columns-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="break-inside-avoid-column mb-4">
          <NoteCardSkeleton index={i} />
        </div>
      ))}
    </div>
  );
}

export function HeaderSkeleton() {
  return (
    <header className="bg-slate-800 h-16 animate-pulse">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full" />
          <div className="w-24 h-5 bg-gray-600 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-32 h-4 bg-gray-600 rounded" />
          <div className="w-8 h-8 bg-gray-600 rounded" />
        </div>
      </div>
    </header>
  );
}
