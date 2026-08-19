# Dirección de arte

Portfolio personal de un dev. Estética coder/hacker **amigable sobre fondo
oscuro** — cálida y habitable, no el "hacker de película" (nada de verde
matrix, glows, scanlines ni chrome de terminal decorativo). Ejecución nivel
motionsites.ai: scroll orquestado, transiciones deliberadas.

El fondo oscuro es una decisión de tono, no un tema alternativo: no hay
toggle claro/oscuro (ver "Elemento firma").

## De dónde sale cada decisión

- **ref1 (daveholloway.uk)** — se toma la idea de personaje ilustrado con
  animación propia y el nivel de acabado (contornos gruesos, escenas
  cuidadas). Su paleta oscura, antes descartada por el brief claro, ahora
  es referencia válida: sirve para ver cómo un personaje ilustrado se
  sostiene sobre fondo oscuro sin perder contorno.
- **ref2 (motionsites.ai, voxel character)** — referencia de ejecución:
  orquestación de scroll simple pero deliberada, sin efectos sueltos. No
  aporta paleta ni tipografía.
- **ref3 (AI/ML portfolio, foto real)** — confirma por la negativa: nada de
  foto real, nada de scroll sin animar. Su fondo casi-negro ya no es
  contraejemplo, pero sí lo es su falta de calidez: oscuro no significa
  frío ni neutro.

## Paleta

Fondo oscuro **tintado en verde-frío**, no azul-carbón ni `#000`. El acento
primario es el "azul de terminal" clásico (link visitado, IDEs viejos),
levantado en luminosidad para leerse sobre oscuro.

| Nombre      | Hex       | Uso                                                            |
| ----------- | --------- | -------------------------------------------------------------- |
| Papel       | `#151A14` | Fondo base. Casi-negro con tinte verde-frío. Nunca `#000`.     |
| Superficie  | `#1D231B` | Cards, paneles, secciones alternas. Elevación por valor.       |
| Tinta       | `#EAEDE4` | Texto principal. Blanco roto, nunca `#FFF` puro.               |
| Tinta suave | `#9BA394` | Texto secundario, captions, metadata, estados inactivos.       |
| Código      | `#6BA5FF` | Acento primario: links, CTA, foco, highlights.                 |
| Señal       | `#FF6B4A` | Acento secundario, uso escaso: hover, warnings, micro-énfasis. |
| Línea       | `#2C332A` | Bordes, divisores, hairlines.                                  |

**Origen del acento.** El buzo del personaje es `#6787B8`. Código comparte
su tono y sube en luminosidad y croma, para pertenecer al mundo del
personaje sin confundirse con su material.

Tonos, en **OKLCH** (el espacio operativo del proyecto — `index.css` y
Tailwind v4 trabajan en OKLCH; los valores HSL van entre paréntesis solo
como referencia):

| Color                         | OKLCH  | (HSL)  |
| ----------------------------- | ------ | ------ |
| Buzo `#6787B8`                | 258.7° | 216.3° |
| Código `#6BA5FF`              | 258.9° | 216.5° |
| Señal `#FF6B4A`               | 34.1°  | 10.9°  |
| Violáceo descartado `#7B8CFF` | 274.7° | 232.3° |

Buzo y Código quedan a 0.2° de distancia: es el mismo tono, distinta
luminosidad. No usar azules violáceos (~275° OKLCH): a esa distancia leen
como error de coordinación, no como contraste deliberado.

Al escribir tokens, usar siempre OKLCH. Un `217` interpretado en OKLCH da
un cyan, no este azul.

**Reglas de uso**

- Código y Señal no compiten. Código es el acento por defecto; Señal
  aparece solo en momentos puntuales (nunca los dos en el mismo elemento).
- **Elevación por valor y hairline, no por sombra.** En oscuro las sombras
  no se leen. Un panel se separa subiendo a Superficie y/o con un borde
  de Línea a 1px. Prohibido `box-shadow` como recurso de jerarquía.
- Sin glows. Ningún texto ni borde lleva halo de color. Es el tell número
  uno del hacker de película.
- Superficies grandes en Papel; Superficie se usa con moderación, si
  todo está elevado nada lo está.

## Anti-patrones (guardarraíl del fondo oscuro)

El look "fondo casi negro + un acento brillante" es el default al que llega
cualquier generador cuando se le pide dark. Lo que nos saca de ahí:

- El acento primario es **azul**, no verde ácido ni naranja.
- El fondo está **tintado en verde**, no es gris neutro ni azul-carbón.
- Señal (naranja) es raro por definición. Si aparece en más de dos lugares
  por viewport, está mal usado.
- Nada de: scanlines, ruido CRT, cursor parpadeante decorativo, ventana de
  terminal como marco, verde `#00FF00`, texto con `text-shadow` de color.
- Mono se mantiene en su rol acotado (ver Tipografía). En oscuro la
  tentación de monoespaciar todo es más fuerte y es justamente lo que
  convierte "coder amigable" en "película de los 90".

## Tipografía

| Rol     | Familia          | Notas                                                                                                                                                               |
| ------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display | Familjen Grotesk | H1, títulos de sección. Geométrica pero con carácter propio (terminales redondeados) — evita el grotesk genérico de portfolio-tech. Pesos 500–700.                  |
| Body    | General Sans     | Párrafos, UI, nav. Humanista, buena legibilidad en bio larga. Evita Inter por default.                                                                              |
| Mono    | Commit Mono      | Etiquetas, timestamps, micro-copy tipo terminal (períodos de experiencia, tags de skill). Diseñada para código, licencia libre, decisión deliberada — no Fira Code. |

**Ajuste por fondo oscuro (halación).** El texto claro sobre oscuro se
percibe más pesado de lo que es. Compensar:

- Bajar un escalón de peso respecto a la versión clara: donde iría 600, va
  500; los párrafos van 400, nunca 500.
- Sumar `letter-spacing` de `0.01em` en body y `0.02em` en mono-xs.
- Los pesos de Display (500–700) se mantienen: en tamaños grandes la
  halación no molesta y el carácter se necesita.

Escala (base 16px, ratio 1.25, con `clamp()` para fluidez mobile→desktop):

| Token   | Tamaño | Uso                             |
| ------- | ------ | ------------------------------- |
| mono-xs | 13px   | Etiquetas mono, timestamps      |
| body-sm | 14px   | Texto auxiliar, captions        |
| body    | 16px   | Párrafo base                    |
| body-lg | 19px   | Lead / intro de sección         |
| h4      | 24px   | Subtítulos                      |
| h3      | 32px   | Títulos de card                 |
| h2      | 44px   | Títulos de sección              |
| h1      | 60px   | Título de página (mobile ~40px) |
| display | 88px   | Hero (desktop; clamp en mobile) |

## Espaciado

Base 4px:

| Token | Valor |
| ----- | ----- |
| xs    | 4px   |
| sm    | 8px   |
| md    | 16px  |
| lg    | 24px  |
| xl    | 40px  |
| 2xl   | 64px  |
| 3xl   | 96px  |
| 4xl   | 144px |

## Layout

Cuatro medidas. No hay sistema de grilla de columnas: el ancho lo define
el contenedor y el contenido se acomoda con flex/grid según la sección.

| Medida           | Valor               | Qué es                                                           |
| ---------------- | ------------------- | ---------------------------------------------------------------- |
| Contenedor       | `1200px` máx        | Ancho máximo del contenido. Centrado.                            |
| Medida (prosa)   | `68ch` máx          | Ancho máximo de párrafo. Solo texto corrido.                     |
| Gutter           | `md` → `xl` → `2xl` | Aire lateral mínimo: 16px mobile, 40px tablet, 64px desktop.     |
| Ritmo de sección | `3xl` → `4xl`       | Separación vertical entre secciones: 96px mobile, 144px desktop. |

**Contenedor.** `max-width: 1200px; margin-inline: auto;` más el gutter
como `padding-inline`. Todo vive adentro salvo las excepciones full-bleed.

**Medida.** `max-width: 68ch` se aplica a párrafos y bloques de texto
largo (bio, descripciones de proyecto), nunca a grillas de cards ni al
hero. Se mide en `ch`, no en px: si cambia la tipografía, la medida se
ajusta sola.

**Full-bleed.** Una sola excepción por defecto: el hero con el personaje,
que puede ocupar el ancho completo del viewport. Cualquier otra sección
full-bleed es una decisión explícita, no un recurso libre.

## Radios

Deliberadamente no uniformes:

| Token | Valor | Uso                                   |
| ----- | ----- | ------------------------------------- |
| sharp | 0px   | Bloques de código, elementos técnicos |
| sm    | 6px   | Botones, inputs, badges               |
| md    | 20px  | Cards, paneles                        |
| pill  | 999px | Toggles, tags, pills                  |

## Easings y duraciones

| Token              | Curva / valor                    | Uso                                                                     |
| ------------------ | -------------------------------- | ----------------------------------------------------------------------- |
| ease-out-snap      | `cubic-bezier(0.16, 1, 0.3, 1)`  | Entradas, reveals (GSAP: `power4.out`)                                  |
| ease-in-out-soft   | `cubic-bezier(0.65, 0, 0.35, 1)` | Hover, micro-interacciones                                              |
| scroll-linked      | `linear`                         | ScrollTrigger con `scrub` — sigue el scroll 1:1, sin curva extra encima |
| duration-micro     | 150ms                            | Feedback de hover/press                                                 |
| duration-base      | 450ms                            | Reveals de sección, entrada de cards                                    |
| duration-signature | 900–1400ms                       | El momento firma (ver abajo)                                            |

Prohibido bounce y elastic en cualquier rol.

## Elemento firma

La capucha bajando sobre la cabeza del personaje en el hero, disparada por
ScrollTrigger (pin + scrub). Es el único lugar donde se gasta audacia —
todo lo demás (reveals de sección, hover states, transiciones de página)
usa `ease-out-snap` / `duration-base` sin sorpresas.

**El asset:** `alejo-hood-transition.mp4` — H.264, 1220×1186, 24fps,
5.56s, 134 frames, 4.2MB. Fondo negro puro `#000000`, sin canal alfa.
Codificado all-intra: los 134 frames son keyframes, por lo que scrubbea
sin reencodear.

No se reproduce en autoplay: se scrubbea contra el progreso del scroll
(`currentTime` atado a ScrollTrigger con `scrub`). El usuario controla el
gesto en ambas direcciones.

**Composición sobre el fondo:** el negro del video se elimina con
`mix-blend-mode: screen`, no con canal alfa. Screen contra negro devuelve
el color de abajo por definición, así que el fondo del video desaparece
sin recorte, sin WebM y sin la versión HEVC que exigiría Safari. Requiere
que la superficie detrás sea muy oscura — con Papel `#151A14` funciona;
sobre cualquier superficie clara, no.

Verificar en iOS Safari, donde `mix-blend-mode` sobre `<video>` ha tenido
bugs. Fallback: extraer los 134 frames a WebP con `lumakey` y scrubbear
sobre canvas.

**Zonas oscuras del personaje.** El pelo y los anteojos son casi negros y
sobre Papel pueden fundirse con el fondo. Es aceptable y hasta deseable
como efecto de "personaje emergiendo de la oscuridad", pero es una
decisión, no un descuido: si se quiere silueta legible, se resuelve con
rim light en el asset o ubicando al personaje sobre Superficie `#1D231B`.
Lo que no se hace es agregar glow.

Descartado a propósito: un segundo mecanismo llamativo tipo el toggle
"GOLD" de ref1 (modo claro/oscuro o duotono del personaje). Sumarlo
diluiría la capucha como momento único — si en algún momento se quiere
igual, es una conversación aparte, no un default de este documento.
