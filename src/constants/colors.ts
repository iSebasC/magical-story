/**
 * Paleta de colores centralizada de Magical Story
 * Exporta todos los colores principales usados en la aplicación
 */

export const colors = {
  // Tonos crema
  cream: '#FFFDF7',
  cream2: '#FFF3E0',
  cream3: '#FFE4C4',
  
  // Tonos naranja
  orange: '#FF6B35',
  oranged: '#E05520',
  
  // Tonos teal/cyan
  teal: '#00BCD4',
  teald: '#0097A7',
  
  // Otros colores de acento
  plum: '#7E57C2',
  sun: '#FFD54F',
  
  // Tonos ink (azul oscuro)
  ink: '#344E7A',
  inks: '#4A628A',
  inkm: '#7A90B0',
  inkl: '#B0C0D4',
  navy: '#1F3872',
} as const;

export type ColorKey = keyof typeof colors;
