'use client';

import { useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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
      <span className="text-lg font-medium">{label}</span>
      <div 
        className={`flex items-center p-1 rounded-full border transition-colors ${
          isActive 
            ? 'bg-background border-zinc-700' 
            : 'bg-background border-zinc-300 hover:border-zinc-500 hover:bg-zinc-50'
        }`}
      >
        <div
          className="w-6 h-6 rounded-full m-1"
          style={{ backgroundColor: color }}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onActivate(!isActive)}
          className={`rounded-full h-8 w-8 mr-1 ${
            isActive 
              ? 'text-zinc-700 hover:text-zinc-700 hover:bg-transparent' 
              : 'text-foreground/70 hover:text-foreground hover:bg-transparent'
          }`}
        >
          <EyeDropper className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
} 