'use client';

import { useCallback, useEffect } from 'react';
import { EyeDropper } from './icons/EyeDropper';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  imageRef: React.RefObject<HTMLImageElement | null>;
  onActivate: (isActive: boolean) => void;
  isActive: boolean;
}

export function ColorPicker({ label, color, onChange, imageRef, onActivate, isActive }: ColorPickerProps) {
  const handleColorPick = useCallback((e: MouseEvent) => {
    if (!isActive || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale coordinates to match original image dimensions
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    
    const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
    const hexColor = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
    
    onChange(hexColor);
  }, [isActive, onChange, imageRef]);

  useEffect(() => {
    if (isActive && imageRef.current) {
      document.addEventListener('click', handleColorPick);
    }
    return () => {
      document.removeEventListener('click', handleColorPick);
    };
  }, [isActive, handleColorPick, imageRef]);

  return (
    <div className="flex items-center justify-between">
      <span className="text-2xl font-normal text-gray-900">{label}</span>
      <div className={`flex items-center gap-2 rounded-full ${isActive ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'} px-2 py-1`}>
        <div
          className="w-8 h-8 rounded-full"
          style={{ backgroundColor: color }}
        />
        <button
          onClick={() => onActivate(!isActive)}
          className={`p-2 rounded-full transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
          aria-label="Pick color"
        >
          <EyeDropper className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
} 