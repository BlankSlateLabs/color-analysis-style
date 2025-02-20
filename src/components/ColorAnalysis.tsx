import { cn } from "@/lib/utils";
import Image from "next/image";

interface ColorAnalysisProps {
  imageUrl: string;
  colorAnalysis: {
    season: string;
    description: string;
    colors: string[];
  };
  className?: string;
}

export function ColorAnalysis({
  imageUrl,
  colorAnalysis,
  className,
}: ColorAnalysisProps) {
  return (
    <div className={cn("flex flex-col items-center gap-6 w-full", className)}>
      <h2 className="text-2xl font-semibold">Your Color Analysis</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Based on your unique features, here&apos;s your personalized color analysis
      </p>
      
      <div className="relative w-full max-w-md aspect-[3/4] rounded-lg overflow-hidden">
        {/* Uploaded image */}
        <Image
          src={imageUrl}
          alt="Uploaded photo for color analysis"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
        />
        
        {/* Color overlay at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-sm p-2">
          <div className="flex h-full gap-1">
            {colorAnalysis.colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center max-w-md">
        <h3 className="text-xl font-medium mb-2">
          Your Color Season: {colorAnalysis.season}
        </h3>
        <p className="text-muted-foreground">{colorAnalysis.description}</p>
      </div>
    </div>
  );
} 