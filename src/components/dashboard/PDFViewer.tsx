'use client';

import { useState } from 'react';
import { Upload, FileText, X, Download } from 'lucide-react';

interface PDFViewerProps {
  onFileSelect?: (file: File) => void;
}

export function PDFViewer({ onFileSelect }: PDFViewerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      
      // Crear URL para vista previa
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Callback al padre
      onFileSelect?.(file);
    } else {
      alert('Please select a valid PDF file');
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleDownload = () => {
    if (selectedFile && previewUrl) {
      const link = document.createElement('a');
      link.href = previewUrl;
      link.download = selectedFile.name;
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!selectedFile && (
        <div className="border-2 border-dashed border-cream2 rounded-xl p-12 text-center hover:border-orange transition-colors">
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-orange/10 rounded-2xl flex items-center justify-center">
                <Upload className="w-8 h-8 text-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">Upload PDF document</h3>
                <p className="text-sm text-inkm">
                  Drag and drop or click to select a PDF file
                </p>
              </div>
              <button
                type="button"
                className="mt-4 bg-orange hover:bg-oranged text-white font-semibold px-6 py-3 rounded-xl shadow-[0_4px_0_#E05520] hover:shadow-[0_2px_0_#E05520] hover:translate-y-0.5 transition-all duration-150"
              >
                Select PDF
              </button>
            </div>
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Preview Area */}
      {selectedFile && previewUrl && (
        <div className="space-y-4">
          {/* Header con acciones */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-[0_2px_12px_rgba(52,78,122,.08)] border border-cream2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange" />
              </div>
              <div>
                <h4 className="font-semibold text-ink text-sm">{selectedFile.name}</h4>
                <p className="text-xs text-inkm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-cream2 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5 text-inkm" />
              </button>
              <button
                onClick={handleRemove}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(52,78,122,.08)] border border-cream2">
            <iframe
              src={previewUrl}
              className="w-full h-150"
              title="PDF Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
