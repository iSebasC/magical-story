interface UploadProgressProps {
  filename: string;
  progress: number;
}

export function UploadProgress({ filename, progress }: UploadProgressProps) {
  const getStatus = () => {
    if (progress < 25) return 'Uploading…';
    if (progress < 50) return 'Processing PDF…';
    if (progress < 75) return 'Splitting pages…';
    if (progress < 100) return 'Generating thumbnails…';
    return 'Done!';
  };

  return (
    <div className="bg-white rounded-2xl border border-cream2 p-5 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-3xl">📄</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-ink truncate">{filename}</div>
          <div className="text-xs text-inkm">{getStatus()}</div>
        </div>
        <div className="text-sm font-bold text-orange">{Math.round(progress)}%</div>
      </div>
      <div className="w-full bg-cream rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-orange rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
