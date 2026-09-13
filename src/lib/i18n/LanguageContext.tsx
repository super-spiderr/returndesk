"use client";

import React, { createContext, useContext, useEffect, useMemo, useCallback } from "react";
import { en } from "./translations/en";
import { ta } from "./translations/ta";

export type Language = "en" | "ta";

export type TranslationDict = typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationDict;
  formatNumber: (num: number) => string;
  formatCurrency: (num: number) => string;
}

const translations: Record<Language, TranslationDict> = {
  en,
  ta,
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  toggleLang: () => {},
  t: en,
  formatNumber: (num: number) => num.toLocaleString("en-IN"),
  formatCurrency: (num: number) => `₹${num.toLocaleString("en-IN")}`,
});

function subscribeToLanguageChange(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("returndesk-lang-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("returndesk-lang-change", callback);
  };
}

function getClientLanguageSnapshot(): Language {
  try {
    const saved = localStorage.getItem("returndesk_lang");
    return saved === "ta" ? "ta" : "en";
  } catch {
    return "en";
  }
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = React.useSyncExternalStore(
    subscribeToLanguageChange,
    getClientLanguageSnapshot,
    getServerLanguageSnapshot
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.setAttribute("data-lang", lang);
    }
  }, [lang]);

  const setLang = useCallback((newLang: Language) => {
    try {
      localStorage.setItem("returndesk_lang", newLang);
      window.dispatchEvent(new Event("returndesk-lang-change"));
    } catch {
      // ignore in restricted environments
    }
  }, []);

  const toggleLang = useCallback(() => {
    const current = getClientLanguageSnapshot();
    const next = current === "en" ? "ta" : "en";
    try {
      localStorage.setItem("returndesk_lang", next);
      window.dispatchEvent(new Event("returndesk-lang-change"));
    } catch {
      // ignore
    }
  }, []);

  const activeDict = useMemo(() => {
    return translations[lang] || en;
  }, [lang]);

  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString("en-IN");
  }, []);

  const formatCurrency = useCallback((num: number) => {
    return `₹${num.toLocaleString("en-IN")}`;
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: activeDict,
      formatNumber,
      formatCurrency,
    }),
    [lang, setLang, toggleLang, activeDict, formatNumber, formatCurrency]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/**
 * Replaces placeholders like `{name}` with variables in translation strings
 */
export function interpolate(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}
