'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Confirm Image Analysis</CardTitle>
        <CardDescription>
          Click each color to adjust using the eyedropper
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div 
          className="relative rounded-lg overflow-hidden" 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <Image
            ref={imageRef}
            src={imageUrl}
            alt="Uploaded photo"
            className={`w-full rounded-lg ${activePicker ? 'cursor-crosshair' : ''}`}
            width={800}
            height={600}
            style={{ width: '100%', height: 'auto' }}
          />
          {activePicker && mousePosition && (
            <div
              className="pointer-events-none absolute bg-background rounded-lg shadow-lg p-4"
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
                      outline: i === 24 ? '2px solid var(--primary)' : 'none'
                    }}
                  />
                ))}
              </div>
              <div className="text-center font-mono text-sm text-muted-foreground">{currentColor}</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
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

        <Button 
          onClick={handleAnalyze}
          className="w-full"
          size="lg"
        >
          Get my analysis
        </Button>
      </CardContent>
    </Card>
  );
} 