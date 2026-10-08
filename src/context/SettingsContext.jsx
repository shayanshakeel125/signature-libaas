import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const SETTINGS_KEY = 'signature_settings';

export const DEFAULT_SETTINGS = {
  brandName: 'Signature Libaas',
  logo: '', // '' → default theme logo (logo-light.png / logo-dark.png)
  heroSlides: [
    {
      id: 1,
      tag: 'NEW ARRIVALS 2026',
      title: 'Summer Collection',
      accent: 'Summer',
      subtitle: 'Discover timeless elegance crafted for the modern wardrobe',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
      cta: 'Shop Collection',
      link: '/tshirts'
    },
    {
      id: 2,
      tag: 'FESTIVE EDIT',
      title: 'Eid Specials',
      accent: 'Eid',
      subtitle: 'Exclusive designs for your most memorable celebrations',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
      cta: 'Explore Now',
      link: '/kurtis'
    },
    {
      id: 3,
      tag: 'PREMIUM QUALITY',
      title: 'Pret Wear Launches',
      accent: 'Pret Wear',
      subtitle: 'Where tradition meets modern aesthetics in every stitch',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80',
      cta: 'Discover More',
      link: '/tshirts'
    }
  ],
  navLinks: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' }
  ]
};

const mergeSettings = (saved) => {
  if (!saved) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    heroSlides: Array.isArray(saved.heroSlides) && saved.heroSlides.length
      ? saved.heroSlides.map((s, i) => ({
          ...DEFAULT_SETTINGS.heroSlides[i % DEFAULT_SETTINGS.heroSlides.length],
          ...s
        }))
      : DEFAULT_SETTINGS.heroSlides,
    navLinks: Array.isArray(saved.navLinks) ? saved.navLinks : DEFAULT_SETTINGS.navLinks
  };
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      return mergeSettings(saved);
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Partial update → merged + saved
  const updateSettings = (patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
    return { success: true };
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    return { success: true };
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
