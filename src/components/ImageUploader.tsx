import React, { useState, useRef } from 'react';
import { useBooking } from '../context/BookingContext';

interface ImageUploaderProps {
  currentUrl?: string;
  onImageSelected: (url: string) => void;
  label?: string;
  category?: string;
}

const PRESET_HOTEL_ASSETS = [
  { label: 'Cliff Suite', url: '/cliff suit.jpeg' },
  { label: 'Deluxe Room', url: '/deluxe room.jpeg' },
  { label: 'Cliff Twin', url: '/cliff twin.jpeg' },
  { label: 'Super Luxe', url: '/super luxe.jpeg' },
  { label: 'Building Dusk', url: '/hotel img.jpeg' },
  { label: 'Building Day', url: '/hotel img (2).jpeg' },
  { label: 'Ground Lobby', url: '/ground lobby.avif' },
  { label: 'Staff & Chef', url: '/staff.jpeg' },
  { label: 'Hotel Brand Poster', url: '/home_page.jpeg' },
  { label: 'Hotel Crest Logo', url: '/logo.png' },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  onImageSelected,
  label = 'Upload Photo',
}) => {
  const { paymentSettings, showToast } = useBooking();
  const [preview, setPreview] = useState<string>(currentUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress and convert image file to optimized Base64
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = () => reject(new Error('Failed to parse image'));
        img.onload = () => {
          // Scale down if larger than 1600px width/height to save storage
          const maxDimension = 1600;
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          resolve(compressed);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WebP, AVIF)');
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus('Optimizing image...');
      const base64Data = await processImageFile(file);
      setPreview(base64Data);

      // Check if GitHub Integration is configured
      const token = paymentSettings.githubToken?.trim();
      const repo = paymentSettings.githubRepo?.trim() || 'arnavsen09/hotelroopcliff';
      const branch = paymentSettings.githubBranch?.trim() || 'main';

      if (token) {
        setUploadStatus('Committing image to GitHub repository...');
        try {
          const cleanFileName = file.name
            .toLowerCase()
            .replace(/[^a-z0-9.]/g, '_')
            .replace(/_+/g, '_');
          const timestamp = Date.now();
          const targetPath = `public/uploads/${timestamp}_${cleanFileName}`;

          // Extract base64 payload without prefix
          const base64Content = base64Data.split(',')[1];

          const response = await fetch(`https://api.github.com/repos/${repo}/contents/${targetPath}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
              message: `Add hotel photo: ${cleanFileName}`,
              content: base64Content,
              branch,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Permanent raw github URL or relative public path
            const liveUrl = data.content?.download_url || `/uploads/${timestamp}_${cleanFileName}`;
            onImageSelected(liveUrl);
            setPreview(liveUrl);
            setUploadStatus('✓ Stored in GitHub & active on website!');
            showToast('Image successfully pushed to GitHub & added to website!');
            return;
          } else {
            const errJson = await response.json().catch(() => ({}));
            console.warn('GitHub API upload response not ok:', errJson);
            // Fallback to local Base64 storage
            onImageSelected(base64Data);
            setUploadStatus('✓ Active on website (Local storage saved)');
            showToast('Image saved to website! (GitHub push returned ' + (errJson.message || response.status) + ')');
            return;
          }
        } catch (err) {
          console.error('Error committing to GitHub:', err);
          onImageSelected(base64Data);
          setUploadStatus('✓ Active on website (Local storage)');
          showToast('Image saved to website storage!');
          return;
        }
      } else {
        // Direct local storage mode (instant, no token required)
        onImageSelected(base64Data);
        setUploadStatus('✓ Photo loaded and active on website!');
        showToast('Photo uploaded and displayed on website!');
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      showToast('Could not process selected image file.');
      setUploadStatus('Failed to load image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold text-[#142E25] uppercase tracking-wider">
          {label}
        </label>
        {paymentSettings.githubToken ? (
          <span className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono">
            GitHub Sync: Enabled ({paymentSettings.githubRepo || 'arnavsen09/hotelroopcliff'})
          </span>
        ) : (
          <span className="text-[9px] text-[#64756D]">
            Direct file upload (drag &amp; drop supported)
          </span>
        )}
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
            : 'border-[#142E25]/20 hover:border-[#D4AF37] hover:bg-[#FAF8F5]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        {preview ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={preview}
                alt="Selected preview"
                className="w-48 h-32 object-cover rounded shadow-md border border-[#D4AF37]/40"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-white text-xs font-medium">
                Click to replace photo
              </div>
            </div>
            <div className="text-[11px] text-[#2D4238]">
              {isUploading ? (
                <span className="text-amber-700 font-semibold animate-pulse">{uploadStatus}</span>
              ) : (
                <span>{uploadStatus || 'Photo ready. Click or drag to change.'}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#142E25]/5 flex items-center justify-center text-[#142E25]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-[#142E25]">
              Click to browse or drag and drop hotel photo
            </p>
            <p className="text-[10px] text-[#64756D]">
              PNG, JPG, WEBP, or AVIF up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Preset Hotel Asset Selectors */}
      <div>
        <div className="text-[9.5px] uppercase tracking-wider text-[#64756D] font-semibold mb-1.5 flex items-center gap-1.5">
          <span>Or pick from hotel photo collection:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_HOTEL_ASSETS.map((asset) => (
            <button
              key={asset.url}
              type="button"
              onClick={() => {
                setPreview(asset.url);
                onImageSelected(asset.url);
                showToast(`Selected ${asset.label}`);
              }}
              className={`text-[10px] px-2.5 py-1 rounded border transition-all ${
                preview === asset.url
                  ? 'bg-[#142E25] text-[#D4AF37] border-[#142E25] font-semibold'
                  : 'bg-white text-[#2D4238] border-gray-200 hover:border-[#D4AF37]'
              }`}
            >
              {asset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
