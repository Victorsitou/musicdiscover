import { Provider } from "../types/types";

export type LangPref = "en" | "es";

const KEYS = {
  lang: "md_lang",
  provider: "md_provider",
} as const;

const isBrowser = () => typeof window !== "undefined";

// Language
export function getLangPref(): LangPref {
  if (!isBrowser()) return "en";

  const lang = localStorage.getItem(KEYS.lang) as LangPref | null;
  return lang ? lang : "en";
}

export function setLangPref(lang: LangPref) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.lang, lang);
}

// Provider
export function getProviderPref(): Provider {
  if (!isBrowser()) return Provider.RECCO;

  const provider = localStorage.getItem(KEYS.provider) as Provider | null;
  return provider ? provider : Provider.RECCO;
}

export function setProviderPref(provider: Provider) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.provider, provider);
}
