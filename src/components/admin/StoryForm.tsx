'use client';

import { useState, useEffect } from 'react';
import type { Story } from '@/app/admin/stories/page';

interface StoryFormProps {
  filename: string;
  editingStory: Story | null;
  onPublish: (data: Partial<Story>) => void;
  onCancel: () => void;
}

export function StoryForm({ filename, editingStory, onPublish, onCancel }: StoryFormProps) {
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');
  const [access, setAccess] = useState<'free' | 'premium'>('free');
  const [category, setCategory] = useState('Animals');

  useEffect(() => {
    if (editingStory) {
      setTitle(editingStory.title);
      setEmoji(editingStory.emoji);
      setAccess(editingStory.access);
      setCategory(editingStory.category);
    }
  }, [editingStory]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Please enter a story title');
      return;
    }
    
    onPublish({
      title,
      emoji: emoji || '📖',
      access,
      category,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-cream2 p-6 mb-5">
      <div className="flex items-center gap-3 mb-5 pb-5 border-b border-cream2">
        <div className="text-3xl">📄</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink truncate">{filename || 'New Story'}</div>
          <div className="text-xs text-inkm">{editingStory ? 'Edit story details' : 'Configure story details before publishing'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-2">Story Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="The Brave Little Lion"
            className="w-full px-4 py-2.5 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          />
        </div>

        {/* Emoji */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-2">Emoji Icon</label>
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="🦁"
            maxLength={2}
            className="w-full px-4 py-2.5 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          >
            <option value="Animals">Animals</option>
            <option value="Magic">Magic</option>
            <option value="Adventure">Adventure</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Education">Education</option>
          </select>
        </div>

        {/* Access */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-2">Access Level</label>
          <select
            value={access}
            onChange={(e) => setAccess(e.target.value as 'free' | 'premium')}
            className="w-full px-4 py-2.5 border border-cream2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
          >
            <option value="free">Free - All users</option>
            <option value="premium">Premium - Paid users only</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-orange text-white font-semibold px-5 py-3 rounded-xl hover:bg-oranged transition-colors"
        >
          {editingStory ? '✏️ Update Story' : '🎉 Publish Story'}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-3 border border-cream2 text-inkm font-semibold rounded-xl hover:bg-cream transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
