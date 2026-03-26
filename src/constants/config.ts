/**
 * Configuración general de la aplicación
 */

export const siteConfig = {
  name: 'Magical Story',
  tagline: 'Where Every Page Opens a World',
  email: {
    schools: 'schools@magicalstory.com',
    support: 'hello@magicalstory.com',
  },
  social: {
    twitter: 'https://twitter.com/magicalstory',
    facebook: 'https://facebook.com/magicalstory',
    instagram: 'https://instagram.com/magicalstory',
    linkedin: 'https://linkedin.com/company/magicalstory',
  },
  stats: {
    schools: '120+',
    students: '8,500',
    stories: '150+',
    rating: '4.9 ★',
    readingIncrease: '3×',
  },
  navigation: [
    { label: 'How it works', href: '#how' },
    { label: 'Features', href: '#features' },
    { label: 'For Schools', href: '#schools' },
    { label: 'Pricing', href: '#pricing' },
  ],
} as const;

export const fonts = {
  display: ['Fraunces', 'Georgia', 'serif'],
  body: ['DM Sans', 'system-ui', 'sans-serif'],
} as const;
