
import React, { memo } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative';
  description?: string;
}

/**
 * Memoized Dashboard Card component
 * Only re-renders when props actually change
 */
const DashboardCard: React.FC<DashboardCardProps> = memo(({ title, value, icon, change, changeType, description }) => {
  return (
    <div className="bg-[#1a1f25] border border-[#40474f] shadow-lg rounded-xl p-6 hover:border-[#3f7fbf] transition-colors duration-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-[#a2abb3]">{title}</h3>
        {icon && <div className="text-[#3f7fbf]">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      {change && (
        <p className={`text-sm ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </p>
      )}
      {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
    </div>
  );
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
