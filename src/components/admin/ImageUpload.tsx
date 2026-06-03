'use client';
import { useRef, useState } from 'react';
import { Upload, X, Loader2, CheckCircle2, Link as LinkIcon, ChevronDown } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /** Width the image will display on the site — for the size selector */
  showSizeControl?: boolean;
}

const SIZE_OPTIONS = [
  { id: 'original', label: 'Original size', css: 'object-contain' },
  { id: 'cover',    label: 'Fill / Cover (crop to fit)', css: 'object-cover' },
  { id: 'contain',  label: 'Fit inside (no crop)', css: 'object-contain' },
];

export default function ImageUpload({ value, onChange, label = 'Image', showSizeControl = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [objectFit, setObjectFit] = useState<'object-cover' | 'object-contain'>('object-cover');
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    setError('');
    setSuccess(false);
    setProgress(0);

    // Client-side checks
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('Only JPG, PNG, WebP or GIF images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large — maximum size is 5 MB.');
      return;
    }

    setUploading(true);

    // Simulate progress bar while uploading
    const fakeProgress = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 200);

    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json();

    clearInterval(fakeProgress);
    setProgress(100);

    if (res.ok) {
      onChange(data.url);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } else {
      setError(data.error ?? 'Upload failed. Please try again.');
    }

    setUploading(false);
    setTimeout(() => setProgress(0), 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const applyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
      setUrlDraft('');
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-white/40 text-[11px] font-semibold uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* ── Preview ── */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-black/30 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className={`w-full h-48 ${objectFit} transition-all`}
          />

          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-gold text-navy text-xs font-bold rounded-lg hover:bg-gold/90 transition-colors"
            >
              <Upload size={13} /> Replace
            </button>
            <button
              type="button"
              onClick={() => { onChange(''); setError(''); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              <X size={13} /> Remove
            </button>
          </div>

          {/* Success badge */}
          {success && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              <CheckCircle2 size={11} /> Uploaded!
            </div>
          )}
        </div>
      ) : (
        /* ── Upload zone ── */
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
            dragging
              ? 'border-gold bg-gold/10 scale-[1.01]'
              : 'border-white/20 hover:border-gold/50 hover:bg-white/3'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />

          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            {uploading ? (
              <>
                <Loader2 size={32} className="text-gold animate-spin mb-3" />
                <p className="text-white/60 text-sm font-semibold mb-3">Uploading your image…</p>
                {/* Progress bar */}
                <div className="w-full max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-3">
                  <Upload size={24} className="text-gold" />
                </div>
                <p className="text-white font-bold text-sm mb-1">
                  {dragging ? 'Drop it here!' : 'Click to choose a photo'}
                </p>
                <p className="text-white/40 text-xs mb-1">or drag and drop from your computer</p>
                <p className="text-white/25 text-[10px]">JPG · PNG · WebP · GIF — max 5 MB</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Progress bar (outside drop zone, shown during upload) ── */}
      {uploading && progress > 0 && !value && (
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gold rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-lg px-3 py-2">
          <X size={13} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      {/* ── Size control (optional) ── */}
      {showSizeControl && value && (
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-[11px] font-semibold uppercase tracking-wide">Display size:</span>
          <div className="flex gap-1.5">
            {[
              { id: 'object-cover' as const, label: 'Fill' },
              { id: 'object-contain' as const, label: 'Fit' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setObjectFit(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                  objectFit === opt.id
                    ? 'bg-gold/20 border-gold/40 text-gold'
                    : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Optional URL paste (hidden by default) ── */}
      <div>
        <button
          type="button"
          onClick={() => setShowUrlInput(o => !o)}
          className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[11px] transition-colors"
        >
          <LinkIcon size={11} />
          {showUrlInput ? 'Hide URL input' : 'Or paste an image URL instead'}
          <ChevronDown size={11} className={`transition-transform ${showUrlInput ? 'rotate-180' : ''}`} />
        </button>
        {showUrlInput && (
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              value={urlDraft}
              onChange={e => setUrlDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyUrl()}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-gold/40 placeholder-white/20"
            />
            <button
              type="button"
              onClick={applyUrl}
              className="px-3 py-2 bg-gold/20 border border-gold/30 text-gold text-xs font-bold rounded-lg hover:bg-gold/30 transition-colors"
            >
              Use
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
