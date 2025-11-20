export default function RightSectionSkeleton() {
  return (
    <div
      className="
        w-[430px]
        h-full
        rounded-[16px]
        bg-white
        shadow-[0_12px_32px_rgba(15,23,42,0.08)]
        flex flex-col
      "
    >
      <div className="flex items-center gap-3 px-5 pt-5 pb-3">
        <SkeletonTab width="72px" />
        <SkeletonTab width="64px" />
        <SkeletonTab width="56px" />
      </div>
      <div className="h-px bg-[#f3f3f3]" />

      <div className="flex flex-col gap-4 p-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <SkeletonFeedCard key={`right-skeleton-feed-${idx}`} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTab({ width }: { width: string }) {
  return <div style={{ width }} className="rounded-sm shimmer h-[30px]" />;
}

export function SkeletonFeedCard() {
  return (
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] animate-shimmer" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="w-[45%] h-3 rounded-md bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] animate-shimmer" />
        <div className="w-[80%] h-3 rounded-md bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] animate-shimmer" />
        <div className="w-[65%] h-3 rounded-md bg-gradient-to-r from-[#f3f4f6] via-[#e5e7eb] to-[#f3f4f6] animate-shimmer" />
      </div>
    </div>
  );
}
