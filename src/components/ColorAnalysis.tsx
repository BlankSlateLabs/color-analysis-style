import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader>
        <CardTitle className="text-center">Your Color Analysis</CardTitle>
        <CardDescription className="text-center">
          Based on your unique features, here&apos;s your personalized color analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
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

        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">
            Your Color Season: {colorAnalysis.season}
          </h3>
          <p className="text-muted-foreground">{colorAnalysis.description}</p>
        </div>
      </CardContent>
    </Card>
  );
} 