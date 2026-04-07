'use client';

import { useState } from 'react';
import type { User } from '@/app/admin/users/page';

interface UsersTableProps {
  users: User[];
  onTogglePlan: (id: number) => void;
}

export function UsersTable({ users, onTogglePlan }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'premium'>('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === 'all' || user.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-cream2 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">User Directory</h3>
          <p className="text-xs text-inkm">{filteredUsers.length} users</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users…"
            className="px-4 py-2 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange w-full sm:w-auto"
          />

          {/* Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as 'all' | 'free' | 'premium')}
            className="px-4 py-2 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          >
            <option value="all">All Plans</option>
            <option value="free">Free Only</option>
            <option value="premium">Premium Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-cream/50 border-b border-cream2">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">User</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Email</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Plan</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Reads</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-inkm">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-cream2 hover:bg-cream/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center text-sm font-bold text-orange flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="text-sm font-semibold text-ink">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-inkm">{user.email}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => onTogglePlan(user.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        user.plan === 'premium'
                          ? 'bg-orange/12 text-oranged border-orange/20 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                          : 'bg-cream text-inkm border-cream2 hover:bg-mint/10 hover:text-green-700 hover:border-mint/40'
                      }`}
                    >
                      {user.plan === 'premium' ? '⭐ Premium' : '🌱 Free'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-ink">{user.reads}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-inkm">{user.joined}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
