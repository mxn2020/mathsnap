// i18n configuration for MathSnap
const translations = {
    en: { appName: 'MathSnap', description: 'Photograph a math problem for step-by-step solutions' },
    de: { appName: 'MathSnap', description: 'Photograph a math problem for step-by-step solutions (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
