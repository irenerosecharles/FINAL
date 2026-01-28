
import React from 'react';

interface RiskBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ score, size = 'md' }) => {
  const getColors = () => {
    if (score < 20) return 'bg-green-100 text-green-700 border-green-200';
    if (score < 40) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (score < 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (score < 80) return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getLabel = () => {
    if (score < 20) return 'Low Risk';
    if (score < 40) return 'Stable';
    if (score < 60) return 'Concern';
    if (score < 80) return 'High Risk';
    return 'Critical';
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base font-bold'
  };

  return (
    <div className={`inline-flex items-center rounded-full border ${getColors()} ${sizeClasses[size]}`}>
      <span className="mr-1.5 opacity-70">Risk:</span>
      <span>{score} - {getLabel()}</span>
    </div>
  );
};

export default RiskBadge;
