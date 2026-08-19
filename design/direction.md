# Dirección de arte

Portfolio personal de un dev. Estética coder/hacker en clave clara y
amigable — no el terminal oscuro de siempre. Ejecución nivel motionsites.ai:
scroll orquestado, transiciones deliberadas.

## De dónde sale cada decisión

- **ref1 (daveholloway.uk)** — se toma la idea de personaje ilustrado con
  animación propia y el nivel de acabado (contornos gruesos, escenas
  cuidadas). Se descarta su paleta negro+azul: el brief pide fondo claro.
- **ref2 (motionsites.ai, voxel character)** — es la referencia de
  ejecución citada en el brief: orquestación de scroll simple pero
  deliberada, sin efectos sueltos. No aporta paleta ni tipografía.
- **ref3 (AI/ML portfolio, foto real)** — confirma por la negativa: nada de
  foto real, nada de fondo casi-negro, nada de scroll sin animar.
  (`ref3-3.jpg` no es una referencia de diseño — es una captura de pantalla
  de una conversación de Claude Code sobre conversión de formatos de
  imagen, quedó mezclada por error. La excluí del análisis; avisar si hay
  que reemplazarla.)

## Paleta

Fondo claro. El acento es un azul saturado — el "azul de terminal"
clásico (link visitado, IDEs viejos), no el verde fosforescente de
siempre.

| Nombre       | Hex       | Uso                                              |
| ------------ | --------- | ------------------------------------------------- |
| Papel        | `#F3F5F0` | Fondo base. Blanco roto con un pelo de verde-frío, no crema. |
| Superficie   | `#E7EAE2` | Cards, paneles, fondos de sección alternos.       |
| Tinta        | `#151A14` | Texto principal. Negro suavizado, no `#000`.      |
| Código       | `#2C2CF0` | Acento primario: links, CTA, foco, highlights.    |
| Señal        | `#FF5A36` | Acento secundario, uso escaso: hover, warnings, micro-énfasis. |
| Línea        | `#D6D9CE` | Bordes, divisores, hairlines.                     |

Regla de uso: Código y Señal no compiten — Código es el acento por
defecto, Señal aparece solo en momentos puntuales de énfasis (nunca los
dos en el mismo elemento).

## Tipografía

| Rol     | Familia            | Notas                                                        |
| ------- | ------------------- | ------------------------------------------------------------- |
| Display | Familjen Grotesk     | H1, títulos de sección. Geométrica pero con carácter propio (terminales redondeados) — evita el grotesk genérico de portfolio-tech. Pesos 500–700. |
| Body    | General Sans         | Párrafos, UI, nav. Humanista, buena legibilidad en bio larga. Evita Inter por default. |
| Mono    | Commit Mono          | Etiquetas, timestamps, micro-copy tipo terminal (períodos de experiencia, tags de skill si se usa mono ahí). Diseñada específicamente para código, licencia libre, decisión deliberada — no Fira Code. |

Escala (base 16px, ratio 1.25, con `clamp()` para fluidez mobile→desktop):

| Token    | Tamaño | Uso                        |
| -------- | ------ | --------------------------- |
| mono-xs  | 13px   | Etiquetas mono, timestamps  |
| body-sm  | 14px   | Texto auxiliar, captions    |
| body     | 16px   | Párrafo base                |
| body-lg  | 19px   | Lead / intro de sección     |
| h4       | 24px   | Subtítulos                  |
| h3       | 32px   | Títulos de card             |
| h2       | 44px   | Títulos de sección           |
| h1       | 60px   | Título de página (mobile ~40px) |
| display  | 88px   | Hero (desktop; clamp hacia abajo en mobile) |

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

## Radios

Deliberadamente no uniformes:

| Token | Valor  | Uso                              |
| ----- | ------ | --------------------------------- |
| sharp | 0px    | Bloques de código, elementos técnicos |
| sm    | 6px    | Botones, inputs, badges           |
| md    | 20px   | Cards, paneles                    |
| pill  | 999px  | Toggles, tags, pills              |

## Easings y duraciones

| Token             | Curva / valor                     | Uso                                    |
| ------------------ | ---------------------------------- | ---------------------------------------- |
| ease-out-snap      | `cubic-bezier(0.16, 1, 0.3, 1)`   | Entradas, reveals (GSAP: `power4.out`) |
| ease-in-out-soft   | `cubic-bezier(0.65, 0, 0.35, 1)`  | Hover, micro-interacciones             |
| scroll-linked      | `linear`                           | ScrollTrigger con `scrub` — sigue el scroll 1:1, sin curva extra encima |
| duration-micro     | 150ms                               | Feedback de hover/press                |
| duration-base      | 450ms                               | Reveals de sección, entrada de cards    |
| duration-signature | 900–1400ms                          | El momento firma (ver abajo)            |

## Elemento firma

La capucha bajando sobre la cabeza del personaje en el hero, disparada por
ScrollTrigger (pin + scrub). Es el único lugar donde se gasta audacia —
todo lo demás (reveals de sección, hover states, transiciones de página)
usa `ease-out-snap` / `duration-base` sin sorpresas.

Descartado a propósito: un segundo mecanismo llamativo tipo el toggle
"GOLD" de ref1 (modo claro/oscuro o duotono del personaje). Sumarlo
diluiría la capucha como momento único — si en algún momento se quiere
igual, es una conversación aparte, no un default de este documento.
