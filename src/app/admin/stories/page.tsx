'use client';

import { useState, useRef, ChangeEvent, DragEvent } from 'react';

interface Story {
  id: number;
  title: string;
  emoji: string;
  access: 'free' | 'premium';
  category: string;
  reads: number;
  pages: number;
}

const INITIAL_STORIES: Story[] = [
  { id: 0, title: 'The Brave Little Lion', emoji: '🦁', access: 'free', category: 'Animals', reads: 245, pages: 8 },
  { id: 1, title: 'The Forest Fairy', emoji: '🧚', access: 'free', category: 'Magic', reads: 198, pages: 10 },
  { id: 2, title: 'Dragon of Paper', emoji: '🐉', access: 'premium', category: 'Adventure', reads: 132, pages: 9 },
  { id: 3, title: 'Journey to the Moon', emoji: '🚀', access: 'premium', category: 'Adventure', reads: 87, pages: 12 },
  { id: 4, title: 'The Dreaming Turtle', emoji: '🐢', access: 'free', category: 'Animals', reads: 310, pages: 7 },
  { id: 5, title: 'The Star Collector', emoji: '⭐', access: 'premium', category: 'Magic', reads: 64, pages: 11 },
  { id: 6, title: 'Ocean of Secrets', emoji: '🐙', access: 'premium', category: 'Adventure', reads: 53, pages: 14 },
  { id: 7, title: 'The Invisible Friend', emoji: '👻', access: 'free', category: 'Magic', reads: 176, pages: 8 },
];

export default function StoriesPage() {
  const [storiesData, setStoriesData] = useState<Story[]>(INITIAL_STORIES);
  const [filteredStories, setFilteredStories] = useState<Story[]>(INITIAL_STORIES);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadStatus, setUploadStatus] = useState('Uploading…');
  const [isDragging, setIsDragging] = useState(false);
  
  const [showUploadZone, setShowUploadZone] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formTitle, setFormTitle] = useState('');
  const [formEmoji, setFormEmoji] = useState('');
  const [formAccess, setFormAccess] = useState<'free' | 'premium'>('free');
  const [formCategory, setFormCategory] = useState('Animals');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    
    if (file.size > 50 * 1024 * 1024) {
      alert('File too large. Max 50 MB.');
      return;
    }
    
    setUploadFilename(file.name);
    setShowUploadZone(false);
    setShowProgress(true);
    startUpload();
  };

  const startUpload = () => {
    let pct = 0;
    const statuses = ['Uploading…', 'Processing PDF…', 'Splitting pages…', 'Generating thumbnails…', 'Done!'];
    
    uploadTimerRef.current = setInterval(() => {
      pct += Math.random() * 18 + 4;
      if (pct >= 100) {
        pct = 100;
        if (uploadTimerRef.current) clearInterval(uploadTimerRef.current);
        setTimeout(() => {
          setShowProgress(false);
          setShowForm(true);
        }, 600);
      }
      setUploadProgress(pct);
      setUploadStatus(statuses[Math.min(Math.floor(pct / 25), statuses.length - 1)]);
    }, 400);
  };

  const publishStory = () => {
    const title = formTitle.trim();
    if (!title) {
      alert('Please enter a story title');
      return;
    }
    
    const newId = storiesData.length;
    const newStory: Story = {
      id: newId,
      title,
      emoji: formEmoji || '📖',
      access: formAccess,
      category: formCategory,
      reads: 0,
      pages: 8,
    };
    
    const updated = [...storiesData, newStory];
    setStoriesData(updated);
    setFilteredStories(updated);
    cancelForm();
    alert(`"${title}" published!`);
  };

  const saveDraft = () => {
    alert('Draft saved');
    cancelForm();
  };

  const cancelForm = () => {
    setShowForm(false);
    setShowProgress(false);
    setShowUploadZone(true);
    setFormTitle('');
    setFormEmoji('');
    setUploadProgress(0);
    setUploadFilename('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filterStories = (search: string, access: string) => {
    const q = search.toLowerCase();
    const filtered = storiesData.filter(s =>
      (s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) &&
      (access === 'all' || s.access === access)
    );
    setFilteredStories(filtered);
  };

  const deleteStory = (id: number, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      const updated = storiesData.filter(s => s.id !== id);
      setStoriesData(updated);
      setFilteredStories(updated);
    }
  };

  const scrollToUpload = () => {
    document.getElementById('uploadZone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Stories</h2>
          <p className="text-sm text-inkm">Upload PDFs and manage your story library</p>
        </div>
        <button 
          onClick={scrollToUpload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-orange hover:bg-oranged shadow-[0_4px_12px_rgba(255,107,53,.35)] hover:-translate-y-0.5 transition-all"
        >
          📤 Upload new story
        </button>
      </div>

      {/* Upload zone */}
      {showUploadZone && (
        <div 
          id="uploadZone"
          className={`border-2 border-dashed border-cream3 bg-cream rounded-2xl p-10 text-center cursor-pointer hover:border-orange hover:bg-orange/4 transition-all mb-4 relative ${isDragging ? 'border-orange bg-orange/6' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e: DragEvent) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e: DragEvent) => { 
            e.preventDefault(); 
            setIsDragging(false); 
            handleFileSelect(e.dataTransfer.files);
          }}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileSelect(e.target.files)}
          />
          <div className="text-5xl mb-3">📄</div>
          <div className="font-display font-semibold text-ink mb-1.5">Drop your PDF story here</div>
          <div className="text-sm text-inkm mb-4">Drag & drop a PDF, or click to browse. The system will split it into pages automatically.</div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-inks border-2 border-cream3 bg-white hover:border-cream3 transition-all">
            📂 Choose PDF file
          </div>
          <div className="text-xs text-inkl mt-3">Supported: PDF · Max size: 50 MB</div>
        </div>
      )}

      {/* Upload progress */}
      {showProgress && (
        <div className="bg-white rounded-2xl border border-cream2 p-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-inks">📄 <span>{uploadFilename}</span></div>
            <div className="text-sm font-bold text-orange">{Math.round(uploadProgress)}%</div>
          </div>
          <div className="h-2 bg-cream2 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-orange rounded-full transition-all" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="text-xs text-inkm">{uploadStatus}</div>
        </div>
      )}

      {/* Story meta form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-cream2 p-6 mb-5">
          <div className="font-display font-semibold text-ink mb-4">
            📝 Story details — <span className="text-orange">{uploadFilename}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Story title *</label>
              <input 
                type="text" 
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. The Brave Little Lion" 
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Cover emoji</label>
              <input 
                type="text" 
                value={formEmoji}
                onChange={(e) => setFormEmoji(e.target.value)}
                placeholder="🦁" 
                maxLength={2} 
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Age range</label>
              <select className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all">
                <option>3 – 5 years</option>
                <option>4 – 6 years</option>
                <option selected>5 – 7 years</option>
                <option>6 – 8 years</option>
                <option>7 – 9 years</option>
                <option>8 – 12 years</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Access</label>
              <select 
                value={formAccess}
                onChange={(e) => setFormAccess(e.target.value as 'free' | 'premium')}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
              >
                <option value="free">🟢 Free</option>
                <option value="premium">🔒 Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Category</label>
              <select 
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
              >
                <option>Animals</option>
                <option>Adventure</option>
                <option>Magic</option>
                <option>Family</option>
                <option>Nature</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Reading time</label>
              <input 
                type="text" 
                placeholder="e.g. 4 min" 
                className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-inkm mb-1.5">Description</label>
            <textarea 
              rows={3} 
              placeholder="A short description of the story…" 
              className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all resize-none"
            />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button 
              onClick={publishStory}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-orange hover:bg-oranged hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(255,107,53,.35)]"
            >
              ✅ Publish story
            </button>
            <button 
              onClick={saveDraft}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-inks border-2 border-cream2 hover:border-cream3 bg-white hover:-translate-y-0.5 transition-all"
            >
              💾 Save draft
            </button>
            <button 
              onClick={cancelForm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-inkm hover:text-ink transition-all"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stories table */}
      <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream2 flex-wrap gap-3">
          <span className="font-display font-semibold text-ink">
            All stories (<span>{filteredStories.length}</span>)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-inkm text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="Search stories…" 
                onChange={(e) => filterStories(e.target.value, (document.getElementById('storyFilterAccess') as HTMLSelectElement)?.value || 'all')}
                className="pl-8 pr-4 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all w-44"
              />
            </div>
            <select 
              id="storyFilterAccess"
              onChange={(e) => {
                const search = (document.querySelector('input[placeholder="Search stories…"]') as HTMLInputElement)?.value || '';
                filterStories(search, e.target.value);
              }}
              className="px-3 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
            >
              <option value="all">All access</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream2 bg-cream text-left">
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm">Story</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm">Access</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm hidden sm:table-cell">Category</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm hidden md:table-cell">Reads</th>
                <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-inkm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream2">
              {filteredStories.map((story) => (
                <tr key={story.id} className="hover:bg-[#F8F5F0] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange/12 flex items-center justify-center text-lg shrink-0">
                        {story.emoji}
                      </div>
                      <div>
                        <div className="font-semibold text-ink">{story.title}</div>
                        <div className="text-xs text-inkm">{story.pages} pages</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                      story.access === 'premium'
                        ? 'bg-orange/12 text-oranged border-orange/20'
                        : 'bg-mint/10 text-green-700 border-mint/30'
                    }`}>
                      {story.access === 'premium' ? '🔒 Premium' : '🟢 Free'}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-inks">{story.category}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="font-semibold text-ink">{story.reads}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-inks bg-cream hover:bg-cream2 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => deleteStory(story.id, story.title)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
