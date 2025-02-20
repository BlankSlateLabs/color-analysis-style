'use client';

import { useState } from 'react';
import { Upload } from '@/components/Upload';
import { ColorSelection } from '@/components/ColorSelection';
import { ColorAnalysis } from '@/components/ColorAnalysis';

export default function Home() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [colorAnalysis, setColorAnalysis] = useState<{
    season: string;
    description: string;
    colors: string[];
  } | null>(null);

  const handleUploadSuccess = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
  };

  const handleColorAnalysis = async (colors: { hair: string; eyes: string; skin: string }) => {
    try {
      const response = await fetch('/api/analyze-color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(colors),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setColorAnalysis(data);
    } catch (error) {
      console.error('Color analysis error:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!uploadedImageUrl && (
          <Upload onUploadSuccess={handleUploadSuccess} />
        )}
        
        {uploadedImageUrl && !colorAnalysis && (
          <ColorSelection
            imageUrl={uploadedImageUrl}
            onAnalyze={handleColorAnalysis}
          />
        )}
        
        {uploadedImageUrl && colorAnalysis && (
          <ColorAnalysis
            imageUrl={uploadedImageUrl}
            colorAnalysis={colorAnalysis}
          />
        )}
      </div>
    </div>
  );
}
