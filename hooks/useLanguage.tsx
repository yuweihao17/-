import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { translations, TranslationKey } from '../translations';
import { Role, RepairStatus } from '../types';

export type Language = 'en' | 'zh';

const isTranslationKey = (key: string): key is TranslationKey => {
    return key in translations;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string | number }) => string;
  translateRole: (role: Role) => string;
  translateRepairStatus: (status: RepairStatus) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // FIX: The reduce method was causing TypeScript type inference issues, leading to compilation errors.
  // It has been replaced with a for...of loop which is more explicit and resolves the type errors.
  const t = useCallback((key: TranslationKey, replacements?: { [key: string]: string | number }): string => {
    const template = translations[key]?.[language] || key;
    if (!replacements) {
      return template;
    }

    let result = template;
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.replace(`{${placeholder}}`, String(value));
    }

    return result;
  }, [language]);

  const translateRole = useCallback((role: Role): string => {
    const keyMap = {
      [Role.ADMIN]: 'role.administrator',
      [Role.MANAGER]: 'role.dormManager',
      [Role.STUDENT]: 'role.student',
    };
    const key = keyMap[role];
    if (isTranslationKey(key)) {
        return t(key as TranslationKey);
    }
    return role;
  }, [t]);

  const translateRepairStatus = useCallback((status: RepairStatus): string => {
    const keyMap = {
        [RepairStatus.PENDING]: 'repairStatus.pending',
        [RepairStatus.IN_PROGRESS]: 'repairStatus.in_progress',
        [RepairStatus.COMPLETED]: 'repairStatus.completed',
    };
    const key = keyMap[status];
    if (isTranslationKey(key)) {
        return t(key as TranslationKey);
    }
    return status;
  }, [t]);

  const value = useMemo(() => ({ 
      language, 
      setLanguage, 
      t,
      translateRole,
      translateRepairStatus
    }), [language, t, translateRole, translateRepairStatus]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
