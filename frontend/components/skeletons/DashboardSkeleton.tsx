/**
 * Skeleton loader for Dashboard page
 * Shown while data is loading
 */
const DashboardSkeleton = () => (
    <div className="space-y-6 p-6">
        {/* KPIs Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#1a1f25] border border-[#40474f] rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                </div>
            ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-[#1a1f25] border border-[#40474f] rounded-xl p-4 animate-pulse">
                    <div className="h-10 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
            ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="bg-[#1a1f25] border border-[#40474f] rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default DashboardSkeleton;
