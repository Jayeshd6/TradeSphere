import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
      <Skeleton height={18} width={120} />
      <div className="mt-4">
        <Skeleton height={35} width={160} />
      </div>
      <div className="mt-4">
        <Skeleton height={15} width={100} />
      </div>
    </div>
  );
}

export default SkeletonCard;
