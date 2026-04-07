'use client';

import { useState } from 'react';
import type { Story } from '@/app/admin/stories/page';

interface StoriesTableProps {
  stories: Story[];
  onEdit: (story: Story) => void;
  onDelete: (id: number) => void;
}

export function StoriesTable({ stories, onEdit, onDelete }: StoriesTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'premium'>('all');

  const filteredStories = stories.filter((story) => {
    const matchesSearch =
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAccess = accessFilter === 'all' || story.access === accessFilter;
    return matchesSearch && matchesAccess;
  });

  return (
    <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
      {/* Table Header */}
      <div className="p-5 border-b border-cream2 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h3 className="font-display text-lg font-bold text-ink">Story Library</h3>
          <p className="text-xs text-inkm">{filteredStories.length} stories</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories…"
            className="px-4 py-2 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange w-full sm:w-auto"
          />

          {/* Filter */}
          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value as 'all' | 'free' | 'premium')}
            className="px-4 py-2 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          >
            <option value="all">All Access</option>
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
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Story</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Category</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Access</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-inkm">Reads</th>
              <th className="px-5 py-3 text-right text-xs font-bold text-inkm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-inkm">
                  No stories found
                </td>
              </tr>
            ) : (
              filteredStories.map((story) => (
                <tr
                  key={story.id}
                  className="border-b border-cream2 hover:bg-cream/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="text-2xl">{story.emoji}</div>
                      <div className="text-sm font-semibold text-ink">{story.title}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-inkm">{story.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        story.access === 'premium'
                          ? 'bg-orange/12 text-oranged border border-orange/20'
                          : 'bg-cream text-inkm border border-cream2'
                      }`}
                    >
                      {story.access === 'premium' ? '⭐ Premium' : '🌱 Free'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-ink">{story.reads}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(story)}
                        className="text-xs font-semibold text-blue px-3 py-1.5 rounded-lg hover:bg-blue/10 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => onDelete(story.id)}
                        className="text-xs font-semibold text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
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
