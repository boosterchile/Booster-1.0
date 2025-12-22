/**
 * Reusable card skeleton loader
 */
const CardSkeleton = ({ className = '' }: { className?: string }) => (
    <div className={`bg-[#1a1f25] border border-[#40474f] rounded-xl p-6 animate-pulse ${className}`}>
        <div className="h-5 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-4/6"></div>
        </div>
    </div>
);

export default CardSkeleton;
