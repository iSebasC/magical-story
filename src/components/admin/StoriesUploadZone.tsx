'use client';

import { useRef, useState } from 'react';

interface StoriesUploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function StoriesUploadZone({ onFileSelect }: StoriesUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-4
          ${isDragging 
            ? 'border-orange bg-orange/6' 
            : 'border-cream3 bg-cream hover:border-orange hover:bg-orange/4'
          }
        `}
      >
        <div className="text-5xl mb-4">📤</div>
        <div className="font-display text-lg font-bold text-ink mb-2">Upload Story PDF</div>
        <div className="text-sm text-inkm mb-4">
          Drag & drop or click to browse
        </div>
        <div className="text-xs text-inkm">Max file size: 50 MB • Supported: PDF</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
      />
    </>
  );
}
