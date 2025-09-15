"use client";

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SmartphoneIcon, TabletIcon, DownloadIcon } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // Check if device is mobile or tablet
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
      
      setIsMobileOrTablet(isMobile || isTablet);
      
      // Detect platform for instructions
      if (/iphone|ipad|ipod/i.test(userAgent)) {
        setDeviceType('ios');
      } else if (/android/i.test(userAgent)) {
        setDeviceType('android');
      } else {
        setDeviceType('other');
      }
    };

    checkDevice();

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Don't show on desktop
  if (!isMobileOrTablet) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt && isInstallable) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Installation failed:', error);
        setShowInstructions(true);
      }
    } else {
      setShowInstructions(true);
    }
  };

  const getInstructionText = () => {
    switch (deviceType) {
      case 'ios':
        return {
          title: 'Install IME RMS App',
          steps: [
            '1. Tap the Share button at the bottom of Safari',
            '2. Scroll down and tap "Add to Home Screen"',
            '3. Tap "Add" in the top right corner',
            '4. The IME RMS app will appear on your home screen'
          ]
        };
      case 'android':
        return {
          title: 'Install IME RMS App',
          steps: [
            '1. Tap the menu (⋮) in the top right corner of Chrome',
            '2. Select "Add to Home screen" or "Install app"',
            '3. Tap "Add" or "Install" to confirm',
            '4. The IME RMS app will appear on your home screen'
          ]
        };
      default:
        return {
          title: 'Install IME RMS App',
          steps: [
            '1. Look for an "Install" or "Add to Home Screen" option in your browser menu',
            '2. Follow your browser\'s prompts to install the app',
            '3. The IME RMS app will appear on your device\'s home screen'
          ]
        };
    }
  };

  const instructions = getInstructionText();

  if (isInstalled) {
    return (
      <div className="flex items-center px-3 py-2 text-sm font-medium text-green-700 rounded-md bg-green-50">
        <SmartphoneIcon className="w-4 h-4 mr-2" />
        <span className="text-xs">App Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-800 hover:text-white transition-colors w-full justify-start gap-3"
      >
        <DownloadIcon className="w-4 h-4 flex-shrink-0" />
        <span className="transition-opacity duration-300">
          Install Mobile App
        </span>
      </button>

      <Sheet open={showInstructions} onOpenChange={setShowInstructions}>
        <SheetContent side="bottom" className="h-[70vh] max-h-[600px] min-h-[400px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {deviceType === 'ios' ? <TabletIcon className="w-5 h-5" /> : <SmartphoneIcon className="w-5 h-5" />}
              {instructions.title}
            </SheetTitle>
            <SheetDescription className="!block">
              Follow these steps to install IME RMS as an app on your device:
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-4 py-4 flex-1 overflow-y-auto">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                  {index + 1}
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {step.replace(/^\d+\.\s*/, '')}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center px-4 pb-6 pt-2 border-t bg-white">
            <Button onClick={() => setShowInstructions(false)} className="w-full">
              Got it
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
