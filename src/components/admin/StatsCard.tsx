import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  badge?: React.ReactNode;
}

export function StatsCard({ title, value, icon, badge }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-cream2 p-5 hover:shadow-[0_8px_20px_rgba(26,37,64,0.1)] transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        {badge && <div className="text-xs">{badge}</div>}
      </div>
      <div className="font-display text-2xl font-bold text-ink mb-0.5">{value}</div>
      <div className="text-xs text-inkm">{title}</div>
    </div>
  );
}
