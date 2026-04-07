'use client';

interface Activity {
  id: number;
  type: 'signup' | 'read' | 'upgrade';
  user: string;
  detail: string;
  time: string;
  icon: string;
}

const activities: Activity[] = [
  { id: 1, type: 'signup', user: 'Ana Torres', detail: 'Signed up', time: '2m ago', icon: '👋' },
  { id: 2, type: 'read', user: 'Sofia Rios', detail: 'Read "The Brave Lion"', time: '12m ago', icon: '📖' },
  { id: 3, type: 'upgrade', user: 'Lucy Park', detail: 'Upgraded to Premium', time: '1h ago', icon: '⭐' },
  { id: 4, type: 'read', user: 'Marcos López', detail: 'Read "Dragon of Paper"', time: '2h ago', icon: '📖' },
  { id: 5, type: 'signup', user: 'Diego Fuentes', detail: 'Signed up', time: '3h ago', icon: '👋' },
];

export function RecentActivity() {
  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'signup':
        return 'bg-mint/10 text-mint';
      case 'upgrade':
        return 'bg-orange/10 text-orange';
      case 'read':
        return 'bg-blue/10 text-blue';
      default:
        return 'bg-cream text-inkm';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-cream2 p-6">
      <h3 className="font-display text-lg font-bold text-ink mb-5">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(
                activity.type
              )}`}
            >
              <span className="text-sm">{activity.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-ink truncate">{activity.user}</div>
              <div className="text-xs text-inkm truncate">{activity.detail}</div>
            </div>
            <div className="text-[10px] text-inkm whitespace-nowrap">{activity.time}</div>
          </div>
        ))}
      </div>

      <button className="w-full mt-5 text-xs font-semibold text-orange border border-orange/20 px-4 py-2.5 rounded-full hover:bg-orange/5 transition-colors">
        View All Activity
      </button>
    </div>
  );
}
