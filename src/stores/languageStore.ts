import { create } from 'zustand';
import { getSetting, setSetting } from '../db/repositories/equipment';

export type Language = 'en' | 'ru';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  init: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'ru',
  setLanguage: (lang) => {
    setSetting('language', lang);
    set({ language: lang });
  },
  init: () => {
    const stored = getSetting('language');
    if (stored === 'en' || stored === 'ru') {
      set({ language: stored });
    }
  },
}));
