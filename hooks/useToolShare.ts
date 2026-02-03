import { useCallback } from 'react';

interface UseToolShareProps {
  toolSlug: string;
  shareText: string | ((result: any) => string);
  result?: any;
}

interface UseToolShareReturn {
  shareTwitter: () => void;
  shareFacebook: () => void;
  shareInstagram: () => Promise<boolean>;
  shareThreads: () => void;
  copyLink: () => Promise<boolean>;
  toolUrl: string;
}

export function useToolShare({ 
  toolSlug, 
  shareText, 
  result 
}: UseToolShareProps): UseToolShareReturn {
  const baseUrl = 'https://www.koreaexperience.com';
  const toolUrl = `${baseUrl}/tools/${toolSlug}`;
  
  const getText = useCallback(() => {
    if (typeof shareText === 'function') {
      return shareText(result);
    }
    return shareText;
  }, [shareText, result]);

  const shareTwitter = useCallback(() => {
    const text = getText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(toolUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [getText, toolUrl]);

  const shareFacebook = useCallback(() => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(toolUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [toolUrl]);

  const shareInstagram = useCallback(async () => {
    try {
      const text = getText();
      await navigator.clipboard.writeText(`${text} ${toolUrl}`);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, [getText, toolUrl]);

  const shareThreads = useCallback(() => {
    const text = getText();
    const url = `https://www.threads.net/intent/post?text=${encodeURIComponent(text + ' ' + toolUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [getText, toolUrl]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(toolUrl);
      return true;
    } catch (error) {
      console.error('Failed to copy link:', error);
      return false;
    }
  }, [toolUrl]);

  return {
    shareTwitter,
    shareFacebook,
    shareInstagram,
    shareThreads,
    copyLink,
    toolUrl
  };
}
