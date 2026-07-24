import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0"
        >
          <Skeleton width={120} height={16} />
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonTable;
