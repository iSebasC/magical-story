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
    { label: 'Why SEL story lesson', href: '#features' },
    { label: 'Library', href: '#library' },
    { label: 'How It Works', href: '#how' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '#contact' },
  ],
} as const;

export const fonts = {
  display: ['Fraunces', 'Georgia', 'serif'],
  body: ['DM Sans', 'system-ui', 'sans-serif'],
} as const;
