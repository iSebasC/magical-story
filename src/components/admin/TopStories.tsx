'use client';

interface Story {
  id: number;
  title: string;
  emoji: string;
  reads: number;
  access: 'free' | 'premium';
}

const topStories: Story[] = [
  { id: 4, title: 'The Dreaming Turtle', emoji: '🐢', reads: 310, access: 'free' },
  { id: 0, title: 'The Brave Little Lion', emoji: '🦁', reads: 245, access: 'free' },
  { id: 1, title: 'The Forest Fairy', emoji: '🧚', reads: 198, access: 'free' },
];

export function TopStories() {
  return (
    <div className="bg-white rounded-2xl border border-cream2 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-bold text-ink">Top Stories</h3>
        <span className="text-xs text-inkm">By reads this month</span>
      </div>

      <div className="space-y-4">
        {topStories.map((story, index) => (
          <div key={story.id} className="flex items-center gap-2.5">
            <div className="text-2xl font-display font-bold text-cream3 w-6">
              #{index + 1}
            </div>
            <div className="text-2xl">{story.emoji}</div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink">{story.title}</div>
              <div className="text-xs text-inkm">{story.reads} reads</div>
            </div>
            <div
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                story.access === 'premium'
                  ? 'bg-orange/12 text-oranged'
                  : 'bg-cream text-inkm'
              }`}
            >
              {story.access === 'premium' ? '⭐ Premium' : '🌱 Free'}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Chart Placeholder */}
      <div className="mt-6 pt-5 border-t border-cream2">
        <div className="text-xs text-inkm mb-3">Weekly Activity</div>
        <div className="flex items-end gap-2 h-24">
          {[40, 65, 45, 80, 90, 70, 95].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="bg-orange/20 rounded-t transition-all hover:bg-orange/30"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-inkm mt-2">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}
