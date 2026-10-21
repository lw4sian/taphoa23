import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_HERO_SLIDES, HERO_SLIDES_KEY } from '../data/slidesData';

const SlideContext = createContext(null);

export function SlideProvider({ children }) {
  const [slides, setSlides] = useState(() => {
    try {
      const raw = localStorage.getItem(HERO_SLIDES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(DEFAULT_HERO_SLIDES));
    return DEFAULT_HERO_SLIDES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(slides));
    } catch (e) {}
  }, [slides]);

  const updateSlide = (id, fields) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...fields } : s))
    );
  };

  const addSlide = (newSlideData) => {
    const id = 'slide_' + Date.now();
    const slide = {
      id,
      mode: 'custom',
      active: true,
      tag: newSlideData.tag || '⚡ SỰ KIỆN MỚI',
      badgeLeft: newSlideData.badgeLeft || 'HOT SALE',
      priceLeft: newSlideData.priceLeft || 'Giá Tốt',
      featureNote: newSlideData.featureNote || '⚡ Giao dịch tự động 24/7',
      titleRight: newSlideData.titleRight || 'BANNER MỚI',
      subtitleRight: newSlideData.subtitleRight || 'MUA NGAY HÔM NAY',
      btnText: newSlideData.btnText || 'XEM NGAY ►',
      link: newSlideData.link || '/products',
      characterImg: newSlideData.characterImg || 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop',
      bgImg: newSlideData.bgImg || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
      bgGradient: newSlideData.bgGradient || 'linear-gradient(135deg, rgba(88, 28, 135, 0.92), rgba(15, 15, 30, 0.95))'
    };

    setSlides((prev) => [...prev, slide]);
    return slide;
  };

  const deleteSlide = (id) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSlideActive = (id) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const resetSlides = () => {
    setSlides(DEFAULT_HERO_SLIDES);
  };

  return (
    <SlideContext.Provider
      value={{
        slides,
        activeSlides: slides.filter((s) => s.active),
        updateSlide,
        addSlide,
        deleteSlide,
        toggleSlideActive,
        resetSlides
      }}
    >
      {children}
    </SlideContext.Provider>
  );
}

export function useSlides() {
  const context = useContext(SlideContext);
  if (!context) {
    throw new Error('useSlides must be used within SlideProvider');
  }
  return context;
}
