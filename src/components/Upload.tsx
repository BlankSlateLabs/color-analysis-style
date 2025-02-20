import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadProps {
  onUploadSuccess: (imageUrl: string) => void;
}

export const Upload = ({ onUploadSuccess }: UploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Upload Your Photo</h1>
      <p className="text-gray-600 mb-6">
        Upload an image to analyze its colors and get style recommendations
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <p className="text-gray-600">Uploading...</p>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the image here</p>
        ) : (
          <div>
            <p className="text-gray-600">Drag and drop an image here, or click to select</p>
            <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, GIF, and WebP</p>
          </div>
        )}
      </div>

      {uploadError && (
        <p className="text-red-500 mt-4">{uploadError}</p>
      )}
    </div>
  );
}; 