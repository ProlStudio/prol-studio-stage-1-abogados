# PROL Studio — Sitio institucional

Sitio de PROL Studio: producción y administración de la presencia web de abogados y estudios
jurídicos de Córdoba, Argentina.

- **Dominio de producción:** https://prolstudio.com
- **Plan de implementación:** PROL_PROFESIONAL_v3 sobre PROL_BASE_v1.7.3
- **Módulo vertical:** ninguno. Este sitio es el de la propia agencia, no el de un cliente del rubro
  legal, por lo que las restricciones de PROL_VERTICAL_ABOGADOS no se aplican (ver *Production
  Observations* del Production Brief).
- **Tipo de generación:** regeneración completa desde cero. No reutiliza ni edita HTML, CSS o
  JavaScript de versiones anteriores del sitio. Sí reutiliza los recursos de marca existentes.
- **Stack:** HTML5, CSS y JavaScript sin dependencias ni proceso de build.

---

## 1. Estructura del proyecto

```
prol-website_v1.7/
├── index.html                      Página principal
├── servicios.html                  Página secundaria: servicios, planes y preguntas frecuentes
├── contacto.html                   Página de conversión
├── terminos-y-condiciones.html     Página legal
├── politica-de-privacidad.html     Página legal
├── politica-de-reembolso.html      Página legal
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── README.md
└── assets/
    ├── css/
    │   └── styles.css              Sistema de diseño y componentes compartidos
    ├── js/
    │   └── main.js                 Navegación, encabezado, año dinámico y formulario
    ├── icons/                      Librería oficial de iconos PROL (9 categorías, sin modificar)
    │   ├── business/  communication/  documents/  ecommerce/  navigation/
    │   └── payments/  security/  social/  ui/
    └── images/                     Recursos de marca y del proyecto
```

### Arquitectura de páginas

PROL Profesional exige una arquitectura multipágina real con un máximo de 3 páginas públicas
principales. Las páginas legales no cuentan para ese límite.

| Página | Rol |
| --- | --- |
| `index.html` | Propuesta de valor, servicios, diferenciales, proceso, trabajos y planes |
| `servicios.html` | Detalle del servicio, planes, administración y preguntas frecuentes |
| `contacto.html` | Conversión: formulario, canales de contacto y qué ocurre después |

### Módulos obligatorios de PROL Profesional

| Módulo | Ubicación |
| --- | --- |
| Diferenciales | `index.html` → `#diferenciales` |
| Proceso | `index.html` → `#proceso` (versión reducida en `contacto.html`) |
| Preguntas frecuentes | `servicios.html` → `#preguntas-frecuentes` |
| CTAs distribuidas | Encabezado, hero, cierre de secciones y banda de conversión en las tres páginas |
| Botón flotante de contacto | Todas las páginas, incluidas las legales |
| Firma PROL | Pie de página de todas las páginas |

### Módulos opcionales activados

- **Portfolio** — `index.html` → `#trabajos`. Un único proyecto real.
- **Pricing** — `servicios.html` → `#planes-legales` y `#planes-generales`.
- **FAQ** — `servicios.html` → `#preguntas-frecuentes`.

Módulos no activados por falta de respaldo en el Production Brief: testimonios, galería, reservas
de turnos, Calendly, Google Maps, reseñas de Google y descargas.

---

## 2. Sistema de diseño

Definido con custom properties en `:root`, al comienzo de `assets/css/styles.css`.

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-brand-primary` | `#2563EB` | Color primario de marca |
| `--color-brand-secondary` | `#60A5FA` | Color secundario, iconos y enlaces |
| `--color-brand-accent` | `#93C5FD` | Acento y estados hover |
| `--color-surface-base` | `#0F172A` | Fondo canónico (tema oscuro) |
| `--font-heading` | Poppins | Títulos |
| `--font-body` | Inter | Texto corrido |

El tema oscuro (fondo navy, texto claro) es el canónico, según el Production Brief, y no el fondo
claro que sugería la documentación de marca temprana.

Todos los pares de color en uso superan el ratio de contraste AA de WCAG (4.5:1). El par de menor
margen es el texto del botón de WhatsApp en estado hover (`#0B3D22` sobre `#1FB65B`, 4.63:1).

---

## 3. Sistema de iconos

Los iconos provienen exclusivamente de la librería oficial en `assets/icons/`, según
`ICON_LIBRARY.md`. No se generó, recreó ni modificó ningún SVG, y no se crearon sprites.

Cada icono se referencia **por archivo** mediante `mask-image` en CSS, en la sección *4.
Iconografía* de `assets/css/styles.css`:

```css
.icon-check { -webkit-mask-image: url("../icons/ui/check.svg"); mask-image: url("../icons/ui/check.svg"); }
```

El elemento toma el color con `background-color: currentColor`, de modo que cada icono hereda el
color de su contexto sin duplicar ni alterar el archivo original.

**Consecuencia operativa:** el sitio debe servirse por HTTP. Al abrir los archivos directamente con
`file://`, el navegador bloquea las referencias externas de las máscaras CSS y los iconos no se
pintan. Ver la sección *Puesta en marcha*.

### ⚠️ Recurso observado: `payments/mercado-pago.svg`

El Production Brief señala una duplicación visual conocida entre `assets/icons/payments/mercado-pago.svg`
y `assets/icons/ui/check-circle.svg`, no corregida al momento del brief. **Sigue sin resolverse:**
ambos archivos contienen el mismo dibujo (un círculo con un tilde interior).

Por indicación del brief se optó por señalarlo en lugar de reutilizarlo en silencio. En consecuencia:

- `payments/mercado-pago.svg` **no se usa** en ninguna página.
- MercadoPago se menciona en el texto de `servicios.html` acompañado por `payments/wallet.svg`.
- Cuando el archivo se corrija, puede incorporarse agregando una clase `.icon-mercado-pago` en la
  sección de iconografía de la hoja de estilos. No requiere cambios estructurales.

---

## 4. Marcadores de producción pendientes de reemplazo

### 4.1 Valores de los planes

Los importes de los planes del rubro legal no figuran en el Production Brief, por lo que no se
inventaron. El sitio muestra "Consultar" en un elemento marcado y verificable:

| Archivo | Selector | Contenido actual |
| --- | --- | --- |
| `servicios.html` | `[data-prol-placeholder="precio-presencia-profesional"]` | `Consultar` |
| `servicios.html` | `[data-prol-placeholder="precio-estudio-digital"]` | `Consultar` |

Para localizarlos: `grep -rn 'data-prol-placeholder' .`

El alcance definitivo de cada plan tampoco está detallado en el brief. Las listas de características
sólo incluyen prestaciones explícitamente respaldadas por él, y una nota bajo los planes aclara que
los valores y el alcance final se informan en la primera consulta. Al incorporar el documento
definitivo de precios, revisar ambas listas junto con los importes.

### 4.2 Contenido legal

Las tres páginas legales existen y están enlazadas, pero el brief no aportó su contenido definitivo.
Siguiendo PROL_BASE, no se redactó contenido legal ficticio: cada cláusula pendiente aparece como un
bloque visible y claramente identificado.

| Archivo | Bloques pendientes |
| --- | --- |
| `politica-de-privacidad.html` | 5 |
| `terminos-y-condiciones.html` | 6 |
| `politica-de-reembolso.html` | 4 |

Para localizarlos: `grep -rn 'legal-placeholder__label' .`

Cada bloque describe qué texto debe incorporarse. El contenido factual que sí estaba disponible
(responsable, ubicación, canales de contacto, esquema de implementación + abono opcional, propiedad
del sitio, funcionamiento del formulario) ya está redactado fuera de esos bloques.

Pendiente relacionado señalado en el brief: la confirmación contable del tipo y la oportunidad del
comprobante AFIP. El sitio menciona "el comprobante AFIP correspondiente", sin especificar el tipo.

---

## 5. Componentes configurables

### Formulario de contacto

Según PROL_BASE, la plataforma de mensajería no puede estar fijada en la estructura ni en la lógica
del formulario. Se configura con atributos `data-` en el propio elemento `<form>` de `contacto.html`:

```html
<form data-contact-form
      data-contact-channel="whatsapp"
      data-contact-target="5493518609822"
      data-message-intro="Hola PROL Studio, ...">
```

`assets/js/main.js` incluye constructores para `whatsapp`, `telegram` y `email`. Cambiar de canal no
requiere modificar el marcado del formulario más allá de esos atributos. Cada campo aporta su
etiqueta al mensaje mediante `data-message-label`.

El formulario **no envía datos a ningún servidor**: redirige a la plataforma de mensajería con el
mensaje ya redactado. Ese comportamiento se anuncia antes del envío, como exige PROL_BASE, y no se
muestra ningún mensaje de éxito engañoso.

### Botón flotante de contacto

Presente en las seis páginas. Es un enlace independiente ubicado antes del pie de página; puede
retirarse eliminando ese bloque, sin efectos sobre el resto de la interfaz.

### Número de WhatsApp

`+54 9 351 860 9822` (WhatsApp Business). Aparece como `5493518609822` en los enlaces `wa.me` del
botón flotante, del pie de página, del bloque `<noscript>` y de las páginas legales, y como
`data-contact-target` en el formulario. Para cambiarlo:
`grep -rn '5493518609822' .`

---

## 6. Recursos

### Recursos de marca reutilizados

Provienen del sistema de marca existente y **no fueron regenerados**.

| Archivo | Uso |
| --- | --- |
| `logo.svg` | Logo del encabezado y del pie de página. Fondo transparente, apto para el tema oscuro |
| `isotipo.svg` | Firma PROL del pie de página |
| `hero-visual.svg` | Composición visual del hero |
| `portfolio-daniel-labella.jpg` | Único proyecto del portfolio (1600×900) |
| `og-image.jpg` | Imagen de Open Graph (1200×630) |
| `favicon.ico`, `favicon.svg`, `favicon.png`, `favicon-96x96.png`, `apple-touch-icon.png` | Favicons |
| `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png` | Iconos del manifest |

### Recursos deliberadamente excluidos

- `portfolio-jd-amoblamientos.jpg` y `portfolio-leadrise.jpg` existen en el repositorio de marca pero
  **no se incorporaron**. El Production Brief reconoce un único proyecto de portfolio real (Lic.
  Héctor Daniel Labella) e indica no fabricar señales de confianza adicionales.
- Variantes del kit de marca no utilizadas por el sitio (`Main_Logo_Dark.svg`, `Main_Logo_Light.svg`,
  `Main_Logo_Light_NoBG.png`, `Logo_Icon_Black.svg`, `Logo_Icon_Blue.svg`, `Logo_Icon_White.svg`).
  Permanecen en el repositorio de Brand Assets.

### Optimización pendiente

`portfolio-daniel-labella.jpg` pesa aproximadamente 1,4 MB. Conviene recomprimirla y, si es posible,
ofrecer una variante WebP o AVIF antes de la publicación. La imagen ya declara `width`, `height`,
`loading="lazy"` y `decoding="async"`, de modo que reemplazar el archivo no exige cambios de código.

### Dependencia externa

Google Fonts (Poppins e Inter), cargadas con `preconnect` y `display=swap`. Es la única solicitud a
un tercero. La pila de respaldo (`"Segoe UI", system-ui, -apple-system, sans-serif`) mantiene el
sitio legible si la fuente no carga. Para autoalojar las tipografías, reemplazar el `<link>` de las
seis páginas por `@font-face` en `styles.css` y agregar los archivos a `assets/`.

---

## 7. Puesta en marcha

No hay proceso de build ni dependencias que instalar. El sitio se sirve como archivos estáticos.

Para revisarlo en local con cualquier servidor estático:

```bash
npx --yes serve "prol-website_v1.7"
```

Abrir la dirección que informe el comando. **No abrir los `.html` con doble clic:** bajo `file://`
las máscaras CSS de los iconos quedan bloqueadas y los iconos no se ven.

Para publicar, subir el contenido del directorio a la raíz del alojamiento. Las URLs canónicas, el
`sitemap.xml` y `robots.txt` ya apuntan a `https://prolstudio.com`.

---

## 8. Accesibilidad y mejora progresiva

- Un único `<h1>` por página y jerarquía de encabezados sin saltos de nivel.
- Enlace "Ir al contenido principal" en todas las páginas.
- Todas las imágenes tienen `alt`; los iconos decorativos usan `aria-hidden="true"`.
- Foco visible mediante `:focus-visible` en toda la interfaz.
- El menú móvil usa `<button>` con `aria-expanded` y se cierra con `Escape`.
- **Sin JavaScript el sitio sigue siendo utilizable:** la navegación se muestra desplegada (el panel
  colapsable sólo se activa cuando `main.js` agrega `data-nav="enhanced"`), las preguntas frecuentes
  funcionan con `<details>` nativo, el año de copyright tiene un valor de respaldo en el HTML y el
  formulario muestra un bloque `<noscript>` con los canales de contacto directos.
- Se respeta `prefers-reduced-motion`.

---

## 9. SEO

- `<title>`, meta description, `canonical`, Open Graph y Twitter Card en las seis páginas.
- Datos estructurados JSON-LD: `ProfessionalService` en `index.html`, `FAQPage` en `servicios.html`
  y `ContactPage` en `contacto.html`. Sólo contienen información verificable del Production Brief.
- `sitemap.xml` con las seis páginas y `robots.txt` que lo referencia.
- `lang="es-AR"` y `og:locale="es_AR"`.
- Intención de búsqueda cubierta: presencia web para abogados en Córdoba, sitio web para estudio
  jurídico, diseño web para profesionales en Córdoba.

---

## 10. Restricciones de contenido aplicadas

El Production Brief define exclusiones explícitas. Todas se respetaron:

| Restricción | Cómo se resolvió |
| --- | --- |
| Sin lenguaje de equipo ("equipo dedicado" o equivalentes) | Ninguna página menciona un equipo. La operación se presenta como atención directa y sin intermediarios |
| Sin cifras de experiencia no verificables como agencia web | Se declaran "más de 20 años de trato con clientes y gestión de proyectos", tal como los enuncia el brief. No se menciona antigüedad como agencia |
| Sin la estructura de mensaje "nos ocupamos de la tecnología para que vos te enfoques en tu negocio" | No se usa esa construcción ni una equivalente |
| Tienda Online no puede figurar como servicio activo | Aparece únicamente en la estructura de planes generales, marcada "En pausa" y sin llamada a la acción |
| Sin testimonios fabricados | No hay sección de testimonios |
| Segmento activo: sólo abogados y estudios jurídicos | Psicólogos, contadores y corredores no se mencionan. Ante la pregunta por otros rubros, la respuesta indica el foco actual |
| Área de servicio: Córdoba | No hay mensajes de expansión a otras ciudades ni a LATAM |
| MercadoPago y AFIP como parte de la operación | Descritos como forma de operar de PROL Studio, sin prometerlos como funcionalidad técnica del sitio |
| Retainer desacoplado de la propiedad | Presente en diferenciales, en ambos planes del rubro legal, en las preguntas frecuentes y en los términos y condiciones |
| Portfolio ampliable | La nota bajo el proyecto publicado enmarca la ampliación con los sitios del programa de clientes fundadores |

---

## 11. Notas de implementación

- **La firma PROL es autorreferencial en este proyecto.** PROL_PROFESIONAL_v3 exige el isotipo, el
  texto "Infraestructura web por PROL" y el enlace al sitio de PROL en el pie de página. Como este
  es el sitio de PROL Studio, la firma enlaza al propio dominio. Se conservó por ser un requisito
  estricto de la especificación.
- **El teléfono no se publica.** El Production Brief lo marca como *Not Provided*. El sitio ofrece
  WhatsApp Business y correo electrónico.
- **LinkedIn, TikTok, YouTube y Google Business Profile no se publican.** No fueron provistos, y
  PROL_PROFESIONAL prohíbe mostrar marcadores sociales vacíos. Sólo figuran Instagram y Facebook.
- **La `<h2>` de cada grupo del pie de página** organiza el contenido para lectores de pantalla sin
  competir visualmente con el contenido principal.
- El pie usa CSS Grid: 4 columnas en escritorio, 2 en tablet y 1 en móvil, según lo exigido.

---

## 12. Validación realizada

- Todos los enlaces internos y anclas resuelven a destinos existentes.
- Todas las referencias a recursos (`assets/`, favicons, manifest) resuelven a archivos presentes.
- Cada icono referenciado en la hoja de estilos corresponde a un archivo existente de la librería.
- Sin selectores CSS ni recursos sin usar.
- HTML servido y verificado en navegador: sin errores de consola y sin respuestas 404.
- Sin desbordamiento horizontal en 375 px, 768 px y 1440 px.
- Comportamiento verificado: menú móvil, encabezado adherido, acordeón de preguntas frecuentes, año
  dinámico y armado del mensaje de WhatsApp del formulario, incluida la validación de campos
  obligatorios.
- Contraste de color verificado sobre todos los pares en uso.
- JSON-LD verificado como JSON válido en las tres páginas que lo incluyen.

---

*Generado según PROL_BASE_v1.7.3, PROL_PROFESIONAL_v3 e ICON_LIBRARY.md, a partir del Production
Brief de PROL Studio. Agosto de 2026.*
