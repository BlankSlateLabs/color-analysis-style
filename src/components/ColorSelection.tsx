'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ColorPicker } from './ColorPicker';

interface ColorSelectionProps {
  imageUrl: string;
  onAnalyze: (colors: { hair: string; eyes: string; skin: string }) => void;
}

interface Position {
  x: number;
  y: number;
}

type ActivePicker = 'hair' | 'eyes' | 'skin' | null;

export function ColorSelection({ imageUrl, onAnalyze }: ColorSelectionProps) {
  const [hairColor, setHairColor] = useState('#000000');
  const [eyeColor, setEyeColor] = useState('#000000');
  const [skinColor, setSkinColor] = useState('#000000');
  const imageRef = useRef<HTMLImageElement>(null);
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const [mousePosition, setMousePosition] = useState<Position | null>(null);
  const [currentColor, setCurrentColor] = useState<string | null>(null);

  const handleAnalyze = () => {
    onAnalyze({
      hair: hairColor,
      eyes: eyeColor,
      skin: skinColor
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activePicker || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get current pixel color
    const canvas = document.createElement('canvas');
    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    
    const pixel = ctx.getImageData(x * scaleX, y * scaleY, 1, 1).data;
    const hexColor = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`.toUpperCase();
    
    setCurrentColor(hexColor);
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
    setCurrentColor(null);
  };

  const handleColorChange = (color: string) => {
    switch (activePicker) {
      case 'hair':
        setHairColor(color);
        break;
      case 'eyes':
        setEyeColor(color);
        break;
      case 'skin':
        setSkinColor(color);
        break;
    }
    setActivePicker(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Confirm Image Analysis</h2>
      <p className="text-xl text-center text-gray-600 mb-6">
        Click each color to adjust using the eyedropper
      </p>

      <div 
        className="mb-8 relative" 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          ref={imageRef}
          src={imageUrl}
          alt="Uploaded photo"
          className={`w-full rounded-lg shadow-lg`}
          width={800}
          height={600}
          style={{ 
            width: '100%', 
            height: 'auto',
            cursor: activePicker ? 'crosshair' : 'default'
          }}
        />
        {activePicker && mousePosition && (
          <div
            className="pointer-events-none absolute bg-white rounded-lg shadow-lg p-4"
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y + 20,
              minWidth: '200px'
            }}
          >
            <div className="grid grid-cols-7 gap-1 mb-2">
              {Array.from({ length: 49 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-sm`}
                  style={{ 
                    backgroundColor: currentColor || '#000000',
                    outline: i === 24 ? '2px solid black' : 'none'
                  }}
                />
              ))}
            </div>
            <div className="text-center font-mono text-sm">{currentColor}</div>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <ColorPicker
          label="Hair Color"
          color={hairColor}
          onChange={handleColorChange}
          imageRef={imageRef}
          onActivate={() => setActivePicker(activePicker === 'hair' ? null : 'hair')}
          isActive={activePicker === 'hair'}
        />
        <ColorPicker
          label="Skin Tone"
          color={skinColor}
          onChange={handleColorChange}
          imageRef={imageRef}
          onActivate={() => setActivePicker(activePicker === 'skin' ? null : 'skin')}
          isActive={activePicker === 'skin'}
        />
        <ColorPicker
          label="Eye Color"
          color={eyeColor}
          onChange={handleColorChange}
          imageRef={imageRef}
          onActivate={() => setActivePicker(activePicker === 'eyes' ? null : 'eyes')}
          isActive={activePicker === 'eyes'}
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get my analysis
      </button>
    </div>
  );
} 