import { useState, useEffect } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsent {
  hasConsented: boolean;
  preferences: CookiePreferences;
  timestamp: number;
}


const COOKIE_CONSENT_KEY = 'unravel-cookie-consent';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Cargar consentimiento existente al montar
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed);
        setShowBanner(false);
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const newConsent: CookieConsent = {
      hasConsented: true,
      preferences: {
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true,
      },
      timestamp: Date.now(),
    };
    
    setConsent(newConsent);
    setShowBanner(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
  };

  const acceptSelected = (preferences: CookiePreferences) => {
    const newConsent: CookieConsent = {
      hasConsented: true,
      preferences: {
        ...preferences,
        necessary: true, // Siempre true
      },
      timestamp: Date.now(),
    };
    
    setConsent(newConsent);
    setShowBanner(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
  };

  const rejectAll = () => {
    const newConsent: CookieConsent = {
      hasConsented: true,
      preferences: {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      },
      timestamp: Date.now(),
    };
    
    setConsent(newConsent);
    setShowBanner(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsent(null);
    setShowBanner(true);
  };

  const canUseCookies = (type: keyof CookiePreferences): boolean => {
    if (!consent?.hasConsented) return false;
    return consent.preferences[type];
  };

  return {
    consent,
    showBanner,
    acceptAll,
    acceptSelected,
    rejectAll,
    resetConsent,
    canUseCookies,
    setShowBanner,
  };
};
