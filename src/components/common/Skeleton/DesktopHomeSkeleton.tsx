import { SkeletonTab } from "./RightSectionSkeleton";

export default function DesktopHomeSkeleton() {
  return (
    <div className="hidden md:flex justify-center pt-[72px] bg-[#f8fafc] min-h-[100dvh]">
      <div className="flex gap-6 w-full max-w-[884px] px-6">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col justify-between h-full bg-white rounded-xl p-5  min-h-[470px] max-h-[500px]">
            {/* Chart Info */}
            <div className="flex flex-col gap-3">
              <SkeletonLine width="36%" height="24px" />
              <SkeletonLine width="90%" height="40px" />
            </div>

            {/* Chart */}
            <div className="flex flex-col gap-4 items-center justify-center h-[240px]">
              <div className="shimmer w-53 h-53 rounded-full" />
            </div>

            {/* Control Pills */}
            <div className="flex flex-col gap-3">
              <SkeletonPill />
              <SkeletonPill />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col bg-white rounded-xl gap-4">
          <div className="p-[10px]">
            <div className="w-full flex items-center justify-center gap-3 px-5 pt-5 pb-3">
              <SkeletonTab width="72px" />
              <SkeletonTab width="64px" />
              <SkeletonTab width="56px" />
            </div>
            <div className="h-px bg-[#f3f3f3] mx-5 mt-1" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`desk-feed-${idx}`}
                  className="flex gap-3 justify-between bg-white rounded-xl mt-[10px] mb-2 py-[10px] px-4"
                >
                  <div className="shimmer w-12 h-12 rounded-full" />
                  <div className="flex flex-col gap-2 flex-1">
                    <SkeletonLine width="40%" height="14px" />
                    <SkeletonLine width="85%" height="14px" />
                    <SkeletonLine width="75%" height="14px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Skeleton Utilities --- */
function SkeletonLine({ width, height }: { width: string; height: string }) {
  return <div style={{ width, height }} className="shimmer rounded-md" />;
}

function SkeletonPill() {
  return <div className="shimmer h-[38px] rounded-md" />;
}
