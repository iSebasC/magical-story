'use client';

import { useState, useRef, useEffect, useCallback, ChangeEvent, DragEvent } from 'react';
import { Upload, Image as ImageIcon, FolderOpen, Camera, FileText, Paperclip, BookOpen, Search, Lock, CircleDot, Pencil, Trash2, X, CheckCircle, XCircle, AlertTriangle, Loader, ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  access_level: 'free' | 'premium';
  total_pages: number;
  bucket: string;
  cover_image: string | null;
  description: string | null;
  banner_color: string | null;
  created_at: string;
}

interface FilePreview {
  file: File;
  url: string;
  id: string;
}

interface ResourceFile {
  file: File;
  id: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_RESOURCE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_PAGES = 100;

export default function StoriesPage() {
  const [storiesData, setStoriesData] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [showUploadZone, setShowUploadZone] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formTitle, setFormTitle] = useState('');
  const [formAccess, setFormAccess] = useState<'free' | 'premium'>('free');
  const [formDescription, setFormDescription] = useState('');
  const [formBannerColor, setFormBannerColor] = useState('#FFE8E0');
  const [images, setImages] = useState<FilePreview[]>([]);
  const [coverImage, setCoverImage] = useState<FilePreview | null>(null);
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [uploadError, setUploadError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAccess, setFilterAccess] = useState('all');

  // Toast & confirm modal
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
  
  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editStoryTitle, setEditStoryTitle] = useState('');
  const [editStoryDescription, setEditStoryDescription] = useState('');
  const [editStoryAccess, setEditStoryAccess] = useState<'free' | 'premium'>('free');
  const [editBannerColor, setEditBannerColor] = useState('#FFE8E0');
  
  // New states for editing files
  const [editCoverImage, setEditCoverImage] = useState<FilePreview | null>(null);
  const [editImages, setEditImages] = useState<FilePreview[]>([]);
  const [editUploadError, setEditUploadError] = useState('');
  const [editResources, setEditResources] = useState<ResourceFile[]>([]);
  const [editExistingResources, setEditExistingResources] = useState<{ id: string; name: string; file_path: string }[]>([]);
  const [editDeleteResourceIds, setEditDeleteResourceIds] = useState<string[]>([]);

  const [isSavingEdit, setIsSavingEdit] = useState(false);
  
  const pageInputRef = useRef<HTMLInputElement>(null);
  const addMorePagesRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);

  const editCoverInputRef = useRef<HTMLInputElement>(null);
  const editPageInputRef = useRef<HTMLInputElement>(null);
  const editResourceInputRef = useRef<HTMLInputElement>(null);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stories');
      const json = await res.json();
      if (json.success) {
        setStoriesData(json.data);
        setFilteredStories(json.data);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = storiesData.filter(s =>
      s.title.toLowerCase().includes(q) &&
      (filterAccess === 'all' || s.access_level === filterAccess)
    );
    setFilteredStories(filtered);
  }, [searchQuery, filterAccess, storiesData]);

  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
      if (coverImage) URL.revokeObjectURL(coverImage.url);
    };
  }, [images, coverImage]);

  const validateAndAddImages = (files: FileList | File[]) => {
    setUploadError('');
    const fileArray = Array.from(files);
    const errors: string[] = [];
    const validFiles: FilePreview[] = [];

    for (const file of fileArray) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" — only JPG, PNG or WEBP allowed`);
        continue;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`"${file.name}" — exceeds 5MB limit`);
        continue;
      }
      validFiles.push({
        file,
        url: URL.createObjectURL(file),
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      });
    }

    const totalAfter = images.length + validFiles.length;
    if (totalAfter > MAX_PAGES) {
      errors.push(`Maximum ${MAX_PAGES} pages. You have ${images.length}, tried to add ${validFiles.length}`);
      validFiles.splice(MAX_PAGES - images.length);
    }

    if (errors.length > 0) setUploadError(errors.join('\n'));

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      if (!showForm) {
        setShowUploadZone(false);
        setShowForm(true);
      }
    }
  };

  const handlePageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    validateAndAddImages(files);
  };

  const handleCoverSelect = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUploadError('Cover must be JPG, PNG or WEBP');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setUploadError('Cover exceeds 5MB limit');
      return;
    }
    if (coverImage) URL.revokeObjectURL(coverImage.url);
    setCoverImage({
      file,
      url: URL.createObjectURL(file),
      id: `cover_${Date.now()}`,
    });
  };

  const handleResourceSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const errors: string[] = [];
    const valid: ResourceFile[] = [];

    for (const file of fileArray) {
      if (file.size > MAX_RESOURCE_SIZE) {
        errors.push(`"${file.name}" — exceeds 20MB limit`);
        continue;
      }
      valid.push({ file, id: `res_${Date.now()}_${Math.random().toString(36).slice(2)}` });
    }

    if (errors.length > 0) setUploadError(errors.join('\n'));
    if (valid.length > 0) setResources(prev => [...prev, ...valid]);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      const updated = prev.filter(i => i.id !== id);
      if (updated.length === 0) cancelForm();
      return updated;
    });
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages(prev => {
      const newArr = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= newArr.length) return prev;
      [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
      return newArr;
    });
  };

  const removeResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const publishStory = async () => {
    const title = formTitle.trim();
    if (!title) { showToast('Ingresa un título para la historia', 'error'); return; }
    if (images.length === 0) { showToast('Agrega al menos una imagen de página', 'error'); return; }

    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('access_level', formAccess);
      formData.append('banner_color', formBannerColor);
      if (formDescription.trim()) {
        formData.append('description', formDescription.trim());
      }

      // Cover
      if (coverImage) {
        formData.append('cover', coverImage.file);
      }

      // Pages in order
      for (const img of images) {
        formData.append('images', img.file);
      }

      // Resources
      for (const res of resources) {
        formData.append('resources', res.file);
      }

      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!json.success) {
        showToast(json.error, 'error');
        return;
      }

      cancelForm();
      await fetchStories();
      showToast(`"${title}" publicada con ${json.data.total_pages} páginas`, 'success');
    } catch (error) {
      console.error('Error publishing story:', error);
      showToast('Error al publicar la historia. Intenta de nuevo.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const cancelForm = () => {
    images.forEach(img => URL.revokeObjectURL(img.url));
    if (coverImage) URL.revokeObjectURL(coverImage.url);
    setShowForm(false);
    setShowUploadZone(true);
    setFormTitle('');
    setFormAccess('free');
    setFormDescription('');
    setFormBannerColor('#FFE8E0');
    setImages([]);
    setCoverImage(null);
    setResources([]);
    setUploadError('');
    if (pageInputRef.current) pageInputRef.current.value = '';
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (resourceInputRef.current) resourceInputRef.current.value = '';
  };

  const deleteStory = async (id: string, title: string) => {
    setConfirmModal({
      message: `¿Eliminar "${title}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          const res = await fetch(`/api/admin/stories/${id}`, { method: 'DELETE' });
          const json = await res.json();
          if (json.success) {
            await fetchStories();
            showToast(`"${title}" eliminada correctamente`, 'success');
          } else {
            showToast(json.error, 'error');
          }
        } catch (error) {
          console.error('Error deleting story:', error);
          showToast('Error al eliminar la historia', 'error');
        }
      },
    });
  };

  const openEditModal = async (story: Story) => {
    setEditingStory(story);
    setEditStoryTitle(story.title);
    setEditStoryDescription(story.description || '');
    setEditStoryAccess(story.access_level);
    setEditBannerColor(story.banner_color || '#FFE8E0');
    setEditCoverImage(null);
    setEditImages([]);
    setEditResources([]);
    setEditDeleteResourceIds([]);
    setEditUploadError('');
    setShowEditModal(true);

    // Fetch existing resources
    try {
      const res = await fetch(`/api/admin/stories/${story.id}`);
      const json = await res.json();
      if (json.success && json.data.resources) {
        setEditExistingResources(json.data.resources.map((r: any) => ({ id: r.id, name: r.name, file_path: r.file_path })));
      } else {
        setEditExistingResources([]);
      }
    } catch {
      setEditExistingResources([]);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingStory(null);
    if (editCoverImage) URL.revokeObjectURL(editCoverImage.url);
    editImages.forEach(img => URL.revokeObjectURL(img.url));
  };

  const saveEditedStory = async () => {
    if (!editingStory) return;
    const title = editStoryTitle.trim();
    if (!title) { showToast('El título no puede estar vacío', 'error'); return; }

    setIsSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('access_level', editStoryAccess);
      formData.append('banner_color', editBannerColor);
      if (editStoryDescription.trim()) {
        formData.append('description', editStoryDescription.trim());
      }
      if (editCoverImage) {
        formData.append('cover', editCoverImage.file);
      }
      for (const img of editImages) {
        formData.append('images', img.file);
      }
      for (const res of editResources) {
        formData.append('resources', res.file);
      }
      if (editDeleteResourceIds.length > 0) {
        formData.append('delete_resource_ids', JSON.stringify(editDeleteResourceIds));
      }

      const res = await fetch(`/api/admin/stories/${editingStory.id}`, {
        method: 'PUT',
        body: formData,
      });
      const json = await res.json();
      
      if (json.success) {
        // Just reload the stories to get the latest DB URLs
        await fetchStories();
        showToast('Historia actualizada', 'success');
        closeEditModal();
      } else {
        showToast(json.error, 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Error al editar historia', 'error');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleEditCoverSelect = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) { setEditUploadError('Cover must be JPG, PNG or WEBP'); return; }
    if (file.size > MAX_IMAGE_SIZE) { setEditUploadError('Cover exceeds 5MB limit'); return; }
    setEditUploadError('');
    if (editCoverImage) URL.revokeObjectURL(editCoverImage.url);
    setEditCoverImage({ file, url: URL.createObjectURL(file), id: `cover_${Date.now()}` });
  };

  const handleEditPageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setEditUploadError('');
    const fileArray = Array.from(files);
    const validFiles: FilePreview[] = [];
    for (const file of fileArray) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) continue;
      if (file.size > MAX_IMAGE_SIZE) continue;
      validFiles.push({ file, url: URL.createObjectURL(file), id: `${Date.now()}_${Math.random().toString(36).slice(2)}` });
    }
    setEditImages(prev => [...prev, ...validFiles]);
  };

  const handleEditResourceSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const errors: string[] = [];
    const valid: ResourceFile[] = [];
    const currentTotal = editExistingResources.filter(r => !editDeleteResourceIds.includes(r.id)).length + editResources.length;

    for (const file of fileArray) {
      if (file.size > MAX_RESOURCE_SIZE) {
        errors.push(`"${file.name}" — exceeds 20MB limit`);
        continue;
      }
      if (currentTotal + valid.length >= 5) {
        errors.push('Maximum 5 resources per story');
        break;
      }
      valid.push({ file, id: `eres_${Date.now()}_${Math.random().toString(36).slice(2)}` });
    }

    if (errors.length > 0) setEditUploadError(errors.join('\n'));
    if (valid.length > 0) setEditResources(prev => [...prev, ...valid]);
  };

  const removeEditResource = (id: string) => {
    setEditResources(prev => prev.filter(r => r.id !== id));
  };

  const markExistingResourceForDeletion = (id: string) => {
    setEditDeleteResourceIds(prev => [...prev, id]);
  };

  const scrollToUpload = () => {
    document.getElementById('uploadZone')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="p-5 lg:p-7">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h2 className="font-display text-lg text-ink tracking-wide">Stories</h2>
          <p className="text-sm text-inkm">Upload page images and manage your story library</p>
        </div>
        <button 
          onClick={scrollToUpload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-orange hover:bg-oranged shadow-[0_4px_12px_rgba(255,107,53,.35)] hover:-translate-y-0.5 transition-all"
        >
          <Upload className="w-4 h-4" /> Upload new story
        </button>
      </div>

      {/* Upload zone */}
      {showUploadZone && (
        <div 
          id="uploadZone"
          className={`border-2 border-dashed border-cream3 bg-cream rounded-2xl p-10 text-center cursor-pointer hover:border-orange hover:bg-orange/4 transition-all mb-4 relative ${isDragging ? 'border-orange bg-orange/6' : ''}`}
          onClick={() => pageInputRef.current?.click()}
          onDragOver={(e: DragEvent) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e: DragEvent) => { 
            e.preventDefault(); 
            setIsDragging(false); 
            handlePageSelect(e.dataTransfer.files);
          }}
        >
          <input 
            ref={pageInputRef}
            type="file" 
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden" 
            onChange={(e: ChangeEvent<HTMLInputElement>) => handlePageSelect(e.target.files)}
          />
          <ImageIcon className="w-12 h-12 text-inkm mb-3" />
          <div className="font-display font-medium text-ink mb-1.5 tracking-wide">Drop your story page images here</div>
          <div className="text-sm text-inkm mb-4">Drag & drop images (one per page), or click to browse. Upload them in the correct page order.</div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-inks border-2 border-cream3 bg-white hover:border-cream3 transition-all">
            <FolderOpen className="w-4 h-4" /> Choose images
          </div>
          <div className="text-xs text-inkl mt-3">Supported: JPG, PNG, WEBP · Max 5 MB per image · Max 100 pages</div>
        </div>
      )}

      {/* Story form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-cream2 p-6 mb-5">
          <div className="font-display font-medium text-ink mb-4 tracking-wide">
            <FileText className="w-4 h-4 inline -mt-0.5" /> New Story — <span className="text-orange">{images.length} page{images.length !== 1 ? 's' : ''}</span>
          </div>

          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700 whitespace-pre-line">
              <AlertTriangle className="w-4 h-4 inline -mt-0.5" /> {uploadError}
            </div>
          )}

          {/* Cover + Title + Access row */}
          <div className="flex flex-col sm:flex-row gap-5 mb-5">
            {/* Cover image */}
            <div className="shrink-0">
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Cover image *</label>
              <div 
                className="w-32 h-44 rounded-xl border-2 border-dashed border-cream3 bg-cream flex flex-col items-center justify-center cursor-pointer hover:border-orange transition-all overflow-hidden relative"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverImage ? (
                  <>
                    <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (coverImage) URL.revokeObjectURL(coverImage.url); setCoverImage(null); }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <Camera className="w-6 h-6 text-inkm mb-1" />
                    <span className="text-[10px] text-inkm text-center px-2">Click to upload cover</span>
                  </>
                )}
              </div>
              <input 
                ref={coverInputRef}
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                className="hidden" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => { handleCoverSelect(e.target.files); e.target.value = ''; }}
              />
            </div>

            {/* Title, Access, Description */}
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Story title *</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Andy The Angry Ape" 
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Access</label>
                  <select 
                    value={formAccess}
                    onChange={(e) => setFormAccess(e.target.value as 'free' | 'premium')}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
                  >
                    <option value="free">● Free</option>
                    <option value="premium">🔒 Premium</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Banner Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={formBannerColor}
                    onChange={(e) => setFormBannerColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border-2 border-cream2 cursor-pointer p-0.5"
                  />
                  <input 
                    type="text" 
                    value={formBannerColor}
                    onChange={(e) => setFormBannerColor(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all font-mono"
                  />
                  <div className="h-8 flex-1 rounded-lg border border-cream2" style={{ background: formBannerColor }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Description / Summary</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3} 
                  placeholder="A fun and exciting story about anger, self-control, friendship…" 
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-cream focus:border-orange focus:bg-white outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Page images grid */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Pages ({images.length})</label>
              <button
                type="button"
                onClick={() => addMorePagesRef.current?.click()}
                className="text-xs font-medium text-orange hover:text-oranged transition-colors"
              >
                + Add more pages
              </button>
              <input 
                ref={addMorePagesRef}
                type="file" 
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handlePageSelect(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {images.map((img, index) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-cream2 bg-cream">
                    <img src={img.url} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                    {index + 1}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-1">
                    {index > 0 && (
                      <button type="button" onClick={() => moveImage(index, 'up')} className="w-6 h-6 rounded-full bg-white/90 text-ink text-xs flex items-center justify-center hover:bg-white" title="Move left">←</button>
                    )}
                    <button type="button" onClick={() => removeImage(img.id)} className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600" title="Remove">✕</button>
                    {index < images.length - 1 && (
                      <button type="button" onClick={() => moveImage(index, 'down')} className="w-6 h-6 rounded-full bg-white/90 text-ink text-xs flex items-center justify-center hover:bg-white" title="Move right">→</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources section */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-inkm flex items-center gap-1"><Paperclip className="w-3.5 h-3.5" /> Downloadable Resources (optional)</label>
              <button
                type="button"
                onClick={() => resourceInputRef.current?.click()}
                className="text-xs font-medium text-orange hover:text-oranged transition-colors"
              >
                + Add files
              </button>
              <input 
                ref={resourceInputRef}
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                multiple
                className="hidden" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  handleResourceSelect(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>
            {resources.length === 0 ? (
              <div 
                className="border-2 border-dashed border-cream3 bg-cream rounded-xl p-4 text-center cursor-pointer hover:border-orange transition-all"
                onClick={() => resourceInputRef.current?.click()}
              >
                <span className="text-sm text-inkm">Drop PDFs or images here — coloring pages, activities, etc.</span>
                <div className="text-xs text-inkl mt-1">Max 50 MB per file</div>
              </div>
            ) : (
              <div className="space-y-2">
                {resources.map((res) => (
                  <div key={res.id} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-2.5 border border-cream2">
                    <FileText className="w-4 h-4 text-inkm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-ink truncate">{res.file.name}</div>
                      <div className="text-xs text-inkm">{(res.file.size / 1024).toFixed(0)} KB</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeResource(res.id)}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2.5">
            <button 
              onClick={publishStory}
              disabled={isPublishing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white bg-orange hover:bg-oranged hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(255,107,53,.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isPublishing ? <><Loader className="w-4 h-4 animate-spin" /> Uploading…</> : <><CheckCircle className="w-4 h-4" /> Publish story ({images.length} pages)</>}
            </button>
            <button 
              onClick={cancelForm}
              disabled={isPublishing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-inkm hover:text-ink transition-all"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stories table */}
      <div className="bg-white rounded-2xl border border-cream2 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream2 flex-wrap gap-3">
          <span className="font-display font-medium text-ink tracking-wide">
            All stories (<span>{filteredStories.length}</span>)
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-inkm w-3.5 h-3.5" />
              <input 
                type="text" 
                placeholder="Search stories…" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all w-44"
              />
            </div>
            <select 
              value={filterAccess}
              onChange={(e) => setFilterAccess(e.target.value)}
              className="px-3 py-2 rounded-xl border border-cream2 text-sm text-ink bg-cream focus:border-orange outline-none transition-all"
            >
              <option value="all">All access</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-inkm">Loading stories…</div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream2 bg-cream text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm">Story</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm">Access</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm hidden sm:table-cell">Pages</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm hidden md:table-cell">Created</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-inkm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream2">
              {filteredStories.map((story) => (
                <tr key={story.id} className="hover:bg-[#F8F5F0] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {story.cover_image ? (
                        <div className="w-10 h-14 rounded-lg overflow-hidden border border-cream2 shrink-0">
                          <img src={story.cover_image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-14 rounded-lg bg-orange/12 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-orange" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-ink">{story.title}</div>
                        {story.description && (
                          <div className="text-xs text-inkm truncate max-w-[200px]">{story.description}</div>
                        )}
                        <div className="text-xs text-inkl">{story.total_pages} pages</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                      story.access_level === 'premium'
                        ? 'bg-orange/12 text-oranged border-orange/20'
                        : 'bg-mint/10 text-green-700 border-mint/30'
                    }`}>
                      {story.access_level === 'premium' ? <><Lock className="w-3 h-3" /> Premium</> : <><CircleDot className="w-3 h-3" /> Free</>}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-inks">{story.total_pages}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-inks">{new Date(story.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditModal(story)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-inks bg-cream hover:bg-cream3 hover:text-ink transition-colors"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button 
                        onClick={() => deleteStory(story.id, story.title)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-inkm">
                    {storiesData.length === 0 ? 'No stories yet. Upload your first story images!' : 'No stories match your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideUp_0.3s_ease-out]">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg border text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <span>{toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}</span>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditModal && editingStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm overflow-y-auto pt-20">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
            <div className="px-6 py-4 border-b border-cream2 flex justify-between items-center bg-cream/50">
              <h3 className="font-display font-medium text-ink">Edit Story</h3>
              <button 
                onClick={closeEditModal} 
                className="text-inkm hover:text-ink w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream transition-colors"
              >✕</button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {editUploadError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
                  <AlertTriangle className="w-4 h-4 inline -mt-0.5" /> {editUploadError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-5">
                {/* Cover target */}
                <div className="shrink-0">
                  <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Cover Image (optional replacement)</label>
                  <div 
                    className="w-32 h-44 rounded-xl border-2 border-dashed border-cream3 bg-cream flex flex-col items-center justify-center cursor-pointer hover:border-orange transition-all overflow-hidden relative"
                    onClick={() => editCoverInputRef.current?.click()}
                  >
                    {editCoverImage ? (
                      <>
                        <img src={editCoverImage.url} alt="Cover" className="w-full h-full object-cover" />
                        <button type="button" onClick={(e) => { e.stopPropagation(); URL.revokeObjectURL(editCoverImage.url); setEditCoverImage(null); }} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">✕</button>
                      </>
                    ) : editingStory.cover_image ? (
                      <>
                        <img src={editingStory.cover_image} alt="Original Cover" className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity text-white text-xs text-center p-2">
                          <span>Click to replace</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 text-inkm mb-1" />
                        <span className="text-[10px] text-inkm text-center px-2">Upload cover</span>
                      </>
                    )}
                  </div>
                  <input ref={editCoverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { handleEditCoverSelect(e.target.files); e.target.value = ''; }} />
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Title</label>
                    <input 
                      type="text" 
                      value={editStoryTitle} 
                      onChange={(e) => setEditStoryTitle(e.target.value)} 
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Access Logic</label>
                    <select 
                      value={editStoryAccess} 
                      onChange={(e) => setEditStoryAccess(e.target.value as 'free' | 'premium')} 
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none"
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Banner Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={editBannerColor}
                        onChange={(e) => setEditBannerColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border-2 border-cream2 cursor-pointer p-0.5"
                      />
                      <input 
                        type="text" 
                        value={editBannerColor}
                        onChange={(e) => setEditBannerColor(e.target.value)}
                        className="w-28 px-3 py-2 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none transition-all font-mono"
                      />
                      <div className="h-8 flex-1 rounded-lg border border-cream2" style={{ background: editBannerColor }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Description / Summary</label>
                    <textarea 
                      value={editStoryDescription} 
                      onChange={(e) => setEditStoryDescription(e.target.value)} 
                      rows={3} 
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-cream2 text-sm text-ink bg-white focus:border-orange outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-inkm mb-1.5">Replace All Pages (Optional)</label>
                <div className="text-xs text-inkm mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> If you add any pages here, ALL existing pages will be replaced. Leave empty to keep existing pages.</div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <button type="button" onClick={() => editPageInputRef.current?.click()} className="text-xs font-medium bg-cream hover:bg-cream3 px-3 py-1.5 rounded-lg border border-cream2 flex items-center gap-1"><FolderOpen className="w-3.5 h-3.5" /> Select New Pages</button>
                  <input ref={editPageInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { handleEditPageSelect(e.target.files); e.target.value = ''; }} />
                </div>
                
                {editImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {editImages.map((img, index) => (
                      <div key={img.id} className="aspect-[3/4] relative group rounded-xl overflow-hidden border-2 border-orange bg-cream">
                        <img src={img.url} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md">{index + 1}</div>
                        <button type="button" onClick={() => { URL.revokeObjectURL(img.url); setEditImages(prev => prev.filter(i => i.id !== img.id)); }} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xl">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resources section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-inkm flex items-center gap-1"><Paperclip className="w-3.5 h-3.5" /> Downloadable Resources</label>
                  {(editExistingResources.filter(r => !editDeleteResourceIds.includes(r.id)).length + editResources.length) < 5 && (
                    <button
                      type="button"
                      onClick={() => editResourceInputRef.current?.click()}
                      className="text-xs font-medium text-orange hover:text-oranged transition-colors"
                    >
                      + Add files
                    </button>
                  )}
                  <input 
                    ref={editResourceInputRef}
                    type="file" 
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    multiple
                    className="hidden" 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      handleEditResourceSelect(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>

                {/* Existing resources */}
                {editExistingResources.filter(r => !editDeleteResourceIds.includes(r.id)).length > 0 && (
                  <div className="space-y-2 mb-2">
                    {editExistingResources.filter(r => !editDeleteResourceIds.includes(r.id)).map((res) => (
                      <div key={res.id} className="flex items-center gap-3 bg-cream rounded-xl px-4 py-2.5 border border-cream2">
                        <FileText className="w-4 h-4 text-inkm" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-ink truncate">{res.name}</div>
                          <div className="text-xs text-inkm">Existing</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => markExistingResourceForDeletion(res.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New resources to upload */}
                {editResources.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {editResources.map((res) => (
                      <div key={res.id} className="flex items-center gap-3 bg-orange/5 rounded-xl px-4 py-2.5 border border-orange/20">
                        <FileText className="w-4 h-4 text-orange" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-ink truncate">{res.file.name}</div>
                          <div className="text-xs text-inkm">{(res.file.size / 1024).toFixed(0)} KB · New</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEditResource(res.id)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {editExistingResources.filter(r => !editDeleteResourceIds.includes(r.id)).length === 0 && editResources.length === 0 && (
                  <div 
                    className="border-2 border-dashed border-cream3 bg-cream rounded-xl p-4 text-center cursor-pointer hover:border-orange transition-all"
                    onClick={() => editResourceInputRef.current?.click()}
                  >
                    <span className="text-sm text-inkm">Drop PDFs or images — coloring pages, activities, etc.</span>
                    <div className="text-xs text-inkl mt-1">Max 50 MB per file · Max 5 files</div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 bg-cream/30 border-t border-cream2 flex justify-end gap-3 rounded-b-[24px]">
              <button onClick={closeEditModal} className="px-4 py-2 rounded-xl text-sm font-medium text-ink border-2 border-transparent hover:bg-cream transition-colors">
                Cancel
              </button>
              <button onClick={saveEditedStory} disabled={isSavingEdit} className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-orange hover:bg-oranged transition-colors disabled:opacity-50">
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-cream2 p-6 max-w-sm w-full mx-4 animate-[scaleIn_0.2s_ease-out]">
            <div className="text-center mb-5">
              <AlertTriangle className="w-10 h-10 text-orange mx-auto mb-3" />
              <p className="text-sm text-ink leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-inkm border-2 border-cream2 hover:bg-cream transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
