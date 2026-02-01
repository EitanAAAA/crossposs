import React from 'react';

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'success' | 'warning' | 'info';
}

/**
 * Renders a card for AI-driven insights with different styles based on type.
 */
const InsightCard: React.FC<InsightCardProps> = ({ title, description, icon, type }) => {
  const colors = {
    success: 'bg-green-50/60 backdrop-blur-sm border-green-200/50 text-green-800',
    warning: 'bg-yellow-50/60 backdrop-blur-sm border-yellow-200/50 text-yellow-800',
    info: 'bg-gradient-to-br from-pink-50/60 via-purple-50/60 to-blue-50/60 backdrop-blur-sm border-pink-200/50 text-purple-800',
  };

  return (
    <div className={`rounded-2xl p-4 border-2 ${colors[type]} flex items-start gap-3 hover:scale-105 transition-transform`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <h4 className="font-black text-sm mb-1">{title}</h4>
        <p className="text-xs font-medium opacity-90">{description}</p>
      </div>
    </div>
  );
};

export default InsightCard;

