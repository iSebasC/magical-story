# Protección Visual de Documentos - Frontend

## 📋 Implementación Completada

### Archivos Modificados

1. **`src/components/dashboard/DocumentViewer.tsx`**
   - Componente principal donde se visualizan las páginas de documentos
   - Implementación de todas las protecciones visuales

2. **`src/app/globals.css`**
   - Estilos globales para reforzar protección
   - Clases reutilizables: `.protected-content` y `.protection-overlay`

---

## 🛡️ Protecciones Implementadas

### 1. Bloqueo de Clic Derecho
```tsx
onContextMenu={(e) => e.preventDefault()}
```
- Aplicado en: contenedor de imagen + imagen + overlay
- Efecto: Usuario no puede "Guardar imagen como..." desde clic derecho

### 2. Prevenir Arrastrar Imagen
```tsx
draggable={false}
onDragStart={(e) => e.preventDefault()}
```
- Efecto: No se puede arrastrar imagen a escritorio o carpeta

### 3. Bloquear Selección
```css
.protected-content {
  user-select: none !important;
  -webkit-user-select: none !important;
  -webkit-touch-callout: none !important; /* iOS Safari */
}
```
- Efecto: No se puede seleccionar texto ni imagen

### 4. Capa Overlay Transparente
```tsx
<div className="protection-overlay" aria-hidden="true" />
```
- Div transparente absolutamente posicionado sobre la imagen
- Intercepta interacciones antes de que lleguen a la imagen
- z-index: 10 para estar por encima

### 5. `pointer-events: none` en Imagen
```css
.protected-content img {
  pointer-events: none !important;
}
```
- La imagen no recibe eventos directos del mouse
- Solo el overlay es interactuable (y bloqueado)

### 6. URLs Temporales con Expiración
- Signed URLs de Supabase con validez de 300 segundos (5 minutos)
- Dificulta compartir o reutilizar URLs
- Auto-regeneración al cambiar de página

---

## ✅ QUÉ SÍ PROTEGE (Nivel UI/UX)

| Acción | Bloqueada |
|--------|-----------|
| Clic derecho → "Guardar imagen" | ✅ |
| Arrastrar imagen a carpeta | ✅ |
| Seleccionar y copiar | ✅ |
| Doble clic para abrir imagen | ✅ |
| Interacciones táctiles en móvil (long-press) | ✅ |
| URL expuesta visualmente en UI | ✅ |

**Resultado práctico**: Usuario promedio sin conocimientos técnicos tendrá dificultad para guardar las imágenes.

---

## ❌ QUÉ NO PROTEGE (Limitaciones de Frontend)

| Método de Acceso | ¿Bloqueado? | Explicación |
|------------------|-------------|-------------|
| **DevTools (F12)** | ❌ | Usuario puede inspeccionar DOM, copiar `src` de img |
| **Network Tab** | ❌ | Ver requests HTTP y copiar signed URLs |
| **Print Screen** | ❌ | Captura de pantalla del sistema operativo |
| **Extensiones Browser** | ❌ | Extensiones pueden capturar canvas/DOM |
| **Deshabilitar JS** | ❌ | Sin JavaScript, eventos no funcionan |
| **Screenshots iOS/Android** | ❌ | Capturas nativas del dispositivo |
| **Curl/Wget directos** | ❌ | Si obtienen la signed URL, pueden descargar |

---

## 💡 POR QUÉ FRONTEND SOLO DIFICULTA

### Principios Fundamentales

1. **Todo lo renderizado es accesible**
   - Si el navegador puede mostrarlo, el usuario puede capturarlo
   - El píxel final está en su pantalla

2. **JavaScript se ejecuta en cliente**
   - Código JavaScript es controlado por el usuario
   - Pueden deshabilitarlo, modificarlo, o saltárselo

3. **DOM es inspeccionable por diseño**
   - HTML es inherentemente transparente
   - DevTools son herramientas estándar de navegadores

4. **Backend es la única capa de seguridad real**
   - Solo el servidor controla ACCESO a recursos
   - Frontend solo controla EXPERIENCIA de usuario

### Analogía
```
Frontend = Vidrio en museo (dificulta tocar, pero se puede romper)
Backend = Bóveda de banco (controla acceso real)
```

---

## 🔐 REFUERZOS RECOMENDADOS (Backend)

### Nivel 1: Básico (Fácil implementación)

#### 1. Rate Limiting en Signed URLs
```typescript
// Limitar generación de URLs por usuario
// Ejemplo: máximo 20 URLs por minuto
if (user.requestsLastMinute > 20) {
  throw new Error('Too many requests');
}
```

#### 2. Logs de Acceso
```typescript
// Registrar cada generación de signed URL
await db.insert('access_logs', {
  user_id,
  document_id,
  page_number,
  timestamp,
  ip_address
});
```
- Detectar patrones sospechosos (descargas masivas)
- Auditoría de accesos

#### 3. URLs de Un Solo Uso
```typescript
// Invalidar URL tras primera carga
const url = await generateOneTimeUrl(pageId);
// URL solo válida para 1 request HTTP
```

### Nivel 2: Intermedio

#### 4. Watermarks Dinámicos
```typescript
// Embeber user_id/email en la imagen
const watermarkedImage = await addWatermark(originalImage, {
  text: `${user.email} - ${new Date().toISOString()}`,
  opacity: 0.3,
  position: 'diagonal'
});
```
- Rastrea origen de capturas de pantalla
- Disuade compartir (nombre visible)

#### 5. Segmentación de Imágenes (Image Tiles)
```typescript
// Dividir imagen en 9 tiles (3x3)
// Renderizar en canvas, nunca exponer imagen completa
<canvas ref={canvasRef} />
// JS dibuja tiles por separado
```
- Más difícil reconstruir imagen completa
- No hay URL de imagen única

#### 6. Detección de DevTools
```typescript
// En frontend (complementario)
useEffect(() => {
  const detectDevTools = () => {
    if (window.outerWidth - window.innerWidth > 160) {
      // Posible DevTools abierto
      logSuspiciousActivity(user.id);
    }
  };
  window.addEventListener('resize', detectDevTools);
}, []);
```
- No bloquea, solo registra
- Combinado con backend logs

### Nivel 3: Avanzado (Costoso)

#### 7. DRM (Digital Rights Management)
- Encrypted Media Extensions (EME)
- Widevine/PlayReady para contenido premium
- Costoso de implementar y mantener

#### 8. Renderizado en Servidor (SSR Canvas)
```typescript
// Generar imagen en servidor como canvas
// Enviar solo bitmap temporal
// Nunca exponer archivo original
```

#### 9. Verificación de Integridad de Cliente
- Detectar modificaciones en código frontend
- Bloquear acceso si cliente está comprometido

---

## 📊 Comparativa Esfuerzo vs Efectividad

| Medida | Esfuerzo | Efectividad | Recomendado |
|--------|----------|-------------|-------------|
| Protecciones UI (actual) | ⭐ | ⭐⭐ | ✅ Sí (base) |
| Rate Limiting | ⭐ | ⭐⭐⭐ | ✅ Sí |
| Logs de acceso | ⭐ | ⭐⭐⭐ | ✅ Sí |
| URLs un solo uso | ⭐⭐ | ⭐⭐⭐ | ✅ Sí |
| Watermarks dinámicos | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Sí (premium) |
| Segmentación tiles | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 🤔 Depende del caso |
| DRM | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ Solo si es crítico |

---

## 🎯 Estrategia Recomendada por Caso de Uso

### Caso 1: Contenido Educativo (No ultra crítico)
```
✅ Protecciones UI (ya implementadas)
✅ Rate limiting básico
✅ Logs de acceso
Total: Barrera razonable sin mucho costo
```

### Caso 2: Contenido Premium pero no ultra sensible
```
✅ Todo lo anterior
✅ URLs de un solo uso
✅ Watermarks con email de usuario
Total: Dificulta compartir + trazabilidad
```

### Caso 3: Contenido extremadamente sensible
```
✅ Todo lo anterior
✅ Segmentación de imágenes
✅ Monitoreo activo de patrones
✅ DRM si el valor del contenido lo justifica
Total: Máxima protección posible
```

---

## 🧪 Cómo Verificar la Implementación

### Test 1: Usuario Casual
- ✅ Intentar clic derecho → Bloqueado
- ✅ Intentar arrastrar → Bloqueado
- ✅ Intentar seleccionar → Bloqueado

### Test 2: Usuario Técnico
- ❌ Abrir DevTools → Ver signed URL en `<img src>`
- ❌ Copiar URL y pegar en navegador → Funciona (hasta expirar)
- ❌ Print Screen → Funciona

### Test 3: Expiración de URLs
- ✅ Esperar 5 minutos → URL deja de funcionar
- ✅ Cambiar de página y regresar → Nueva URL generada

---

## 🚀 Próximos Pasos Sugeridos

### Semana 1-2 (Rápido)
1. Implementar rate limiting en endpoint de signed URLs
2. Agregar tabla de logs de acceso
3. Monitorear patrones por 1 semana

### Semana 3-4 (Si los datos lo justifican)
1. Implementar watermarks con user_id
2. URLs de un solo uso
3. Dashboard admin para ver accesos sospechosos

### Futuro (Solo si es crítico)
1. Evaluar costo/beneficio de segmentación de imágenes
2. Considerar DRM solo si contenido es extremadamente valioso

---

## ⚠️ IMPORTANTE: Expectativas Realistas

```
NO existe protección 100% en frontend.

Lo que SÍ logramos:
- Poner trabas significativas
- Dificultar descarga casual
- Registrar quién accede qué
- Rastrear fugas con watermarks

Lo que NO logramos:
- Impedir screenshots del sistema
- Bloquear usuarios técnicos expertos
- Proteger contra ingeniería reversa total

Conclusión:
Frontend dificulta.
Backend controla.
La combinación ofrece protección razonable pero NO absoluta.
```

---

## 📚 Referencias Técnicas

- [MDN: User-select](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select)
- [Supabase Signed URLs](https://supabase.com/docs/guides/storage/security/access-control)
- [OWASP: Client-Side Security](https://owasp.org/www-community/controls/Client-Side_Protection)

---

**Implementado por**: Copilot AI  
**Fecha**: 4 de abril de 2026  
**Build Status**: ✅ Exitoso sin errores
