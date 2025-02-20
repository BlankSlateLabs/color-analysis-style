import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload as UploadIcon } from "lucide-react";

interface UploadProps {
  onUploadSuccess: (imageUrl: string) => void;
}

export const Upload = ({ onUploadSuccess }: UploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

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
      setUploadProgress(100);
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Your Photo</CardTitle>
        <CardDescription>
          Upload an image to analyze its colors and get style recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted hover:border-muted-foreground/50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <UploadIcon className={`w-10 h-10 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            {isUploading ? (
              <div className="w-full space-y-2">
                <p className="text-sm text-muted-foreground">Uploading...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            ) : isDragActive ? (
              <p className="text-primary">Drop the image here</p>
            ) : (
              <div>
                <p className="text-muted-foreground">Drag and drop an image here, or click to select</p>
                <p className="text-sm text-muted-foreground/70 mt-2">Supports JPG, PNG, GIF, and WebP</p>
              </div>
            )}
          </div>
        </div>

        {uploadError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 