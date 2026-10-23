# Wasted — Design System

Referencia única de marca para el proyecto. Todo lo visual sale de aquí.

---

## 1. Logos

Dos piezas, dos usos. No hay más versiones.

| Archivo | Qué es | Cuándo se usa |
|---|---|---|
| `Wasted_Logo.svg` | Lockup completo: isótipo + "asted" | Portadas, encabezados, cualquier lugar donde se lea el nombre por primera vez |
| `Wasted_Icon.svg` | Isótipo solo (el bote-W) | Favicon, app icon, avatar, marcas de página, espacios cuadrados o menores a 120 px |
| `Wasted_Logo_Inverse.svg` | Lockup para fondo oscuro: bote `#7FB84F`, palabra `#ECF39E` | Cualquier cosa sobre `#132A13` |

**El concepto:** la W es el bote. El cuerpo del bote se angosta hacia abajo igual que las diagonales de la W, así que la letra y el objeto son el mismo trazo. Arriba lleva tapa y agarradera.

### Especificaciones

- `Wasted_Logo.svg` — viewBox `0 0 339 116`, relación 2.92:1
- `Wasted_Icon.svg` — viewBox `0 0 72 78`, relación 0.92:1
- **Sobre claro** el logo va todo en `#132A13`.
- **Sobre `#132A13`** la palabra va en `--lime` y el bote en `--sprout` (`#7FB84F`, 6.48 de contraste). Sprout es `--moss` aclarado con el mismo tono (OKLCH 0.68 · 0.14 · 133), así que es de la misma familia que los avisos pero resalta sobre forest. Solo vive en el bote.

### Reglas de uso

- **Aire mínimo:** el ancho de la tapa del bote por los cuatro lados.
- **Tamaño mínimo:** lockup 120 px de ancho; isótipo 24 px de ancho.
- **Fondo:** blanco o `--mist` con el logo normal; `--forest` con el invertido.
- **Nunca:** estirarlo, rotarlo, ponerle sombra o degradado, usar sprout fuera del bote o poner el bote en otro color, meterlo en una caja de color que no sea de la paleta, ni redibujar la W con otra tipografía.

### Nota de accesibilidad

**El logo siempre necesita texto alternativo** (`alt="Wasted"`) y nunca se usa como si fuera un párrafo. El isótipo, cuando acompaña a un título que ya dice el nombre, va como decorativo (`alt=""`).

---

## 2. Paleta

Seis tonos para la interfaz, un solo eje: verde, más `--sprout` reservado para el logo. Cada superficie tiene **un solo juego de colores de texto**, siempre el mismo en toda la app.

| Token | Hex | Rol |
|---|---|---|
| `--forest` | `#132A13` | Texto principal y superficie oscura |
| `--pine` | `#31572C` | Texto secundario sobre claro, hover de botones oscuros |
| `--moss` | `#4F772D` | Solo fondo de avisos |
| `--mist` | `#EEF2E4` | Superficie clara: tiles, campos, listas, pasos |
| `--lime` | `#ECF39E` | Texto e íconos sobre forest; acentos chicos (chips, nav activa, barra de confianza) |
| `--paper` | `#FFFFFF` | Fondo de página, diálogos, botones blancos |
| `--sprout` | `#7FB84F` | Solo el bote del logo invertido. Nunca en la interfaz |

### CSS listo para copiar

```css
:root {
  --forest: #132a13;
  --pine:   #31572c;
  --moss:   #4f772d;
  --mist:   #eef2e4;
  --lime:   #ecf39e;
  --paper:  #ffffff;
  --sprout: #7fb84f; /* solo logo */
}
```

### Combinaciones (las únicas permitidas)

| Superficie | Texto e íconos | Contraste | Dónde |
|---|---|---|---|
| `--paper` | `--forest`, secundario `--pine` | 15.35 / 8.30 | Página, diálogos, botones blancos, barra de navegación |
| `--mist` | `--forest`, secundario `--pine` | 13.49 / 7.29 | Tiles, campos, elementos de lista, pasos |
| `--forest` | `--lime`, sin excepción | 13.07 | Hero, tile oscuro, visor de cámara, botón principal |
| `--lime` | `--forest` | 13.07 | Chips, ítem activo de la navegación, relleno de la barra |
| `--moss` | `--paper` | 5.24 | Avisos |

Reglas:

- **Sobre forest todo es lime.** Títulos, texto secundario, íconos, bordes del visor. La jerarquía sale del tamaño y el peso, no de otro verde.
- **Lime nunca es fondo grande.** Cansa la vista; solo piezas chicas.
- **Hover:** los botones claros (blanco o mist) pasan a forest + lime; el botón forest pasa a pine + lime (7.07).
- **Foco:** anillo `--forest` de 3 px con separación de 3 px.
- Las sombras usan forest con transparencia; no cuentan como color.

---

## 3. Tipografía

**Satoshi** (Fontshare, pesos 400 / 500 / 700). Fallback: `"Helvetica Neue", Arial, sans-serif`.

| Uso | Tamaño | Peso | Tracking |
|---|---|---|---|
| Título de portada | logo SVG | — | — |
| H2 de sección | 36 px / 20 pt impreso | 700 | -0.04em |
| Párrafo de entrada | 20 px / 13 pt | 400 | 0 |
| Cuerpo | 17 px / 11 pt | 400 | 0 |
| Referencias | 12 px | 400 | 0 |

Interlineado de cuerpo: 1.7 en pantalla, 1.62 impreso.

---

## 4. Aplicación de referencia

**Eslogan:** *throw it right*. Va en `--lime` sobre `--forest`, nunca sobre fondo claro.

**Card de cierre:** bloque `--forest` con esquinas de 28 px, sombra suave y todo centrado, del ancho completo de la columna de contenido (las dos columnas de la retícula, `grid-column: 1 / -1`). Dentro va el lockup invertido y el eslogan. En impresión pierde la sombra y baja a 7 mm de radio.

`../entregables/html design/wasted_FixedProposal.html` es la implementación viva del sistema: portada con el lockup, isótipo como marca en cada sección, entradas con filete `--pine`, citas sobre `--mist` y ligas en `--pine`. Cualquier pieza nueva copia esos patrones antes de inventar otros.
