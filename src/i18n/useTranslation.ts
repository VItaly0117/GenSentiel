import { useLanguageStore } from '../stores/languageStore';
import { translations } from './translations';

function getPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const dict = translations[language] ?? translations.en;

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let value = getPath(dict, key);
    if (typeof value !== 'string') {
      value = getPath(translations.en, key);
    }
    if (typeof value !== 'string') {
      return key;
    }
    if (vars) {
      return Object.entries(vars).reduce(
        (str, [k, v]) => str.split(`{{${k}}}`).join(String(v)),
        value,
      );
    }
    return value;
  };

  return { t, dict, language };
}
