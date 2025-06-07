
'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Track app installation status
    const appInstalledHandler = () => {
      setIsVisible(false); // Hide prompt if app is installed
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', appInstalledHandler);


    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the browser's install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the A2HS prompt');
    } else {
      console.log('User dismissed the A2HS prompt');
    }
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }
  
  // Basic check for mobile-like viewports for the custom prompt
  const isLikelyMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isLikelyMobile) {
    // Don't show custom prompt on larger screens, browser install icon is usually sufficient
     return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[101] p-4 bg-background/90 backdrop-blur-sm border-t border-border shadow-lg animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <p className="text-sm text-foreground">
          {t('installAppPromptMessage')}
        </p>
        <Button onClick={handleInstallClick} size="sm" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          {t('installAppButton')}
        </Button>
      </div>
    </div>
  );
};

export default InstallPrompt;
