'use client';

import Link from 'next/link';

export default function OverviewPage() {
  return (
    <div className="p-5 lg:p-7">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-cream2 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-orange/12 flex items-center justify-center text-2xl flex-shrink-0">📚</div>
          <div>
            <div className="font-display text-xl text-ink tracking-wide">8</div>
            <div className="text-xs text-inkm">Total stories</div>
            <div className="text-[10px] text-green-500 font-medium mt-0.5">+2 this month</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-cream2 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-teal/12 flex items-center justify-center text-2xl flex-shrink-0">👥</div>
          <div>
            <div className="font-display text-xl text-ink tracking-wide">124</div>
            <div className="text-xs text-inkm">Registered users</div>
            <div className="text-[10px] text-green-500 font-medium mt-0.5">+18 this week</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-cream2 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-plum/12 flex items-center justify-center text-2xl flex-shrink-0">⭐</div>
          <div>
            <div className="font-display text-xl text-ink tracking-wide">34</div>
            <div className="text-xs text-inkm">Premium users</div>
            <div className="text-[10px] text-green-500 font-medium mt-0.5">+5 this week</div>
          </div>
        </div>
        {/* Fourth stat card - HIDDEN */}
        {false && <div className="bg-white rounded-2xl p-5 border border-cream2 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-xl bg-mint/20 flex items-center justify-center text-2xl flex-shrink-0">📖</div>
          <div>
            <div className="font-display text-xl text-ink tracking-wide">1,240</div>
            <div className="text-xs text-inkm">Reads this month</div>
            <div className="text-[10px] text-green-500 font-medium mt-0.5">↑ 23% vs last month</div>
          </div>
        </div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* Recent activity - HIDDEN */}
        {false && <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream2">
            <span className="font-display font-medium text-ink tracking-wide">Recent activity</span>
          </div>
          <div className="divide-y divide-cream2">
            <div className="flex items-start gap-3.5 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-orange/12 flex items-center justify-center text-base flex-shrink-0">📤</div>
              <div>
                <div className="text-sm text-inks"><strong>"Dragon of Paper"</strong> was uploaded and published</div>
                <div className="text-xs text-inkm mt-0.5">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-teal/12 flex items-center justify-center text-base flex-shrink-0">👤</div>
              <div>
                <div className="text-sm text-inks">New user <strong>sofia@school.edu</strong> registered</div>
                <div className="text-xs text-inkm mt-0.5">3 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-sun/25 flex items-center justify-center text-base flex-shrink-0">⭐</div>
              <div>
                <div className="text-sm text-inks"><strong>marcos@gmail.com</strong> upgraded to Premium</div>
                <div className="text-xs text-inkm mt-0.5">5 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-plum/12 flex items-center justify-center text-base flex-shrink-0">📚</div>
              <div>
                <div className="text-sm text-inks"><strong>"The Dreaming Turtle"</strong> reached 100 reads</div>
                <div className="text-xs text-inkm mt-0.5">Yesterday</div>
              </div>
            </div>
            <div className="flex items-start gap-3.5 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-teal/12 flex items-center justify-center text-base flex-shrink-0">👤</div>
              <div>
                <div className="text-sm text-inks">New user <strong>teacher@colegio.pe</strong> registered</div>
                <div className="text-xs text-inkm mt-0.5">Yesterday</div>
              </div>
            </div>
          </div>
        </div>}

        {/* Quick Actions + Top Stories */}
        <div className="flex flex-col gap-4">

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
            <div className="px-5 py-4 border-b border-cream2">
              <span className="font-display font-medium text-ink tracking-wide">Quick actions</span>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              <Link
                href="/admin/stories"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-orange hover:bg-oranged transition-all hover:-translate-y-0.5"
              >
                📤 Upload new story
              </Link>
              <Link
                href="/admin/users"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-inks border border-cream2 bg-cream hover:bg-white hover:border-cream3 transition-all hover:-translate-y-0.5"
              >
                👥 Manage users
              </Link>
              <Link
                href="/admin/settings"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-inks border border-cream2 bg-cream hover:bg-white hover:border-cream3 transition-all hover:-translate-y-0.5"
              >
                ⚙️ Settings
              </Link>
            </div>
          </div>

          {/* Top stories - HIDDEN */}
          {false && <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
            <div className="px-5 py-4 border-b border-cream2">
              <span className="font-display font-medium text-ink tracking-wide">Top stories</span>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {/* Story 1 */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-cream transition-colors">
                <span className="text-[10px] font-medium text-inkl w-6 text-center">#1</span>
                <div className="w-7 h-7 rounded-lg bg-orange/12 flex items-center justify-center text-sm flex-shrink-0">🐢</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">The Dreaming Turtle</div>
                  <div className="text-xs text-inkm">310 reads</div>
                </div>
                <div className="w-14 h-6 rounded-full bg-mint/15 flex items-center justify-center gap-1 text-[10px] font-medium text-mint flex-shrink-0">
                  🌿 Free
                </div>
              </div>

              {/* Story 2 */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-cream transition-colors">
                <span className="text-[10px] font-medium text-inkl w-6 text-center">#2</span>
                <div className="w-7 h-7 rounded-lg bg-orange/12 flex items-center justify-center text-sm flex-shrink-0">🦁</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">The Brave Little Lion</div>
                  <div className="text-xs text-inkm">245 reads</div>
                </div>
                <div className="w-14 h-6 rounded-full bg-mint/15 flex items-center justify-center gap-1 text-[10px] font-medium text-mint flex-shrink-0">
                  🌿 Free
                </div>
              </div>

              {/* Story 3 */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-cream transition-colors">
                <span className="text-[10px] font-medium text-inkl w-6 text-center">#3</span>
                <div className="w-7 h-7 rounded-lg bg-orange/12 flex items-center justify-center text-sm flex-shrink-0">🧚</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink truncate">The Forest Fairy</div>
                  <div className="text-xs text-inkm">198 reads</div>
                </div>
                <div className="w-14 h-6 rounded-full bg-mint/15 flex items-center justify-center gap-1 text-[10px] font-medium text-mint flex-shrink-0">
                  🌿 Free
                </div>
              </div>
            </div>
          </div>}

        </div>
      </div>
    </div>
  );
}
