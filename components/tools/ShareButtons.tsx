'use client';

import { useToolShare, useToast } from '@/hooks';

interface ShareButtonsProps {
  toolSlug: string;
  shareText: string | ((result: any) => string);
  result?: any;
  variant?: 'compact' | 'full';
}

export function ShareButtons({ 
  toolSlug, 
  shareText, 
  result, 
  variant = 'full' 
}: ShareButtonsProps) {
  const { shareTwitter, shareFacebook, shareInstagram, shareThreads, copyLink } = useToolShare({
    toolSlug,
    shareText,
    result
  });
  const { showToast } = useToast();

  const handleInstagram = async () => {
    const success = await shareInstagram();
    if (success) {
      showToast('✅ Copied to clipboard for Instagram!');
    } else {
      showToast('Failed to copy. Please try again.', 'error');
    }
  };

  const handleCopyLink = async () => {
    const success = await copyLink();
    if (success) {
      showToast('✅ Link copied to clipboard!');
    } else {
      showToast('Failed to copy. Please try again.', 'error');
    }
  };

  return (
    <div className={`flex flex-wrap gap-3 ${variant === 'compact' ? 'justify-start' : 'justify-center'}`}>
      <button 
        onClick={shareTwitter}
        className="share-btn share-btn-twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </button>
      
      <button 
        onClick={shareFacebook}
        className="share-btn share-btn-facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>
      
      <button 
        onClick={handleInstagram}
        className="share-btn share-btn-instagram"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        Instagram
      </button>
      
      <button 
        onClick={shareThreads}
        className="share-btn share-btn-threads"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.625 13.248c-.082-.394-.258-.754-.509-1.065-.679-.846-1.99-1.282-3.898-1.299l-.004.001h-.021c-1.908.017-3.22.453-3.898 1.299-.251.311-.427.671-.509 1.065a3.96 3.96 0 0 0-.068.652c0 .223.023.442.068.652.082.394.258.754.509 1.065.679.846 1.99 1.282 3.898 1.299h.025c1.908-.017 3.219-.453 3.898-1.299.251-.311.427-.671.509-1.065a3.96 3.96 0 0 0 .068-.652 3.96 3.96 0 0 0-.068-.652zm-4.432 1.817c-1.229-.013-1.989-.281-2.305-.815a1.76 1.76 0 0 1-.235-.488 2.37 2.37 0 0 1-.041-.39c0-.132.014-.262.041-.39.058-.198.142-.357.235-.488.316-.534 1.076-.802 2.305-.815 1.229.013 1.989.281 2.305.815.093.131.177.29.235.488.027.128.041.258.041.39 0 .132-.014.262-.041.39-.058.198-.142.357-.235.488-.316.534-1.076.802-2.305.815zm9.237-6.281c-1.038-2.379-3.087-4.228-5.612-5.067a11.78 11.78 0 0 0-3.818-.64 11.78 11.78 0 0 0-3.818.64C5.657 4.471 3.608 6.319 2.57 8.698 1.867 10.339 1.5 12.112 1.5 13.9c0 1.788.367 3.561 1.07 5.202 1.038 2.379 3.087 4.228 5.612 5.067a11.78 11.78 0 0 0 3.818.64 11.78 11.78 0 0 0 3.818-.64c2.525-.839 4.574-2.688 5.612-5.067.703-1.641 1.07-3.414 1.07-5.202 0-1.788-.367-3.561-1.07-5.202z"/>
        </svg>
        Threads
      </button>
      
      <button 
        onClick={handleCopyLink}
        className="px-4 py-2 border-2 border-purple-300 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-all flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Copy Link
      </button>
    </div>
  );
}
