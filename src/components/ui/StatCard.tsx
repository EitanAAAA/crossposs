import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'green' | 'yellow' | 'gray' | 'purple';
  trend?: string;
  index: number;
}

/**
 * Renders a card displaying a single statistic with an icon and optional trend.
 */
const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend, index }) => {
  const colorClasses = {
    green: 'bg-gradient-to-br from-[#4a9082] to-[#3d7a6e] text-white',
    yellow: 'bg-gradient-to-br from-[#f8d902] to-[#e5c800] text-black',
    gray: 'bg-gradient-to-br from-gray-800 to-gray-900 text-white',
    purple: 'bg-gradient-to-br from-pink-500 via-purple-500 to-purple-700 text-white',
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[28px] p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2 relative overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-transparent rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl ${colorClasses[color]} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all`}>
            {icon}
          </div>
          {trend && (
            <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 rounded-full text-xs font-bold border border-gray-200/50">
              {trend}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black text-black tracking-tight">{value}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

