import { useCallback } from 'react';

interface CanvasConfig {
  width: number;
  height: number;
  background?: string | 'gradient';
  filename: string;
}

type RenderFunction = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement
) => void;

interface UseCanvasDownloadReturn {
  generateImage: (renderContent: RenderFunction) => void;
}

export function useCanvasDownload(config: CanvasConfig): UseCanvasDownloadReturn {
  const generateImage = useCallback((renderContent: RenderFunction) => {
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    // Apply background
    if (config.background === 'gradient' || !config.background) {
      // Default purple-pink gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#4F46E5'); // Purple
      gradient.addColorStop(1, '#7C3AED'); // Pink-Purple
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Solid color or custom gradient
      ctx.fillStyle = config.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Call custom render function
    renderContent(ctx, canvas);

    // Download the image
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to generate image blob');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = config.filename;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(url);
    }, 'image/png');
  }, [config]);

  return { generateImage };
}
