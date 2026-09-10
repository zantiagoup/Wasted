# Wasted — Design System

Referencia única de marca para el proyecto. Todo lo visual sale de aquí.

---

## 1. Logos

Dos piezas, dos usos. No hay más versiones.

| Archivo | Qué es | Cuándo se usa |
|---|---|---|
| `Wasted_Logo.svg` | Lockup completo: isótipo + "asted" | Portadas, encabezados, cualquier lugar donde se lea el nombre por primera vez |
| `Wasted_Icon.svg` | Isótipo solo (el bote-W) | Favicon, app icon, avatar, marcas de página, espacios cuadrados o menores a 120 px |
| `Wasted_Logo_Inverse.svg` | Lockup para fondo oscuro: isótipo `#ECF39E`, palabra `#90A955` | Cualquier cosa sobre `#132A13` |

**El concepto:** la W es el bote. El cuerpo del bote se angosta hacia abajo igual que las diagonales de la W, así que la letra y el objeto son el mismo trazo. Arriba lleva tapa y agarradera.

### Especificaciones

- `Wasted_Logo.svg` — viewBox `0 0 339 116`, relación 2.92:1
- `Wasted_Icon.svg` — viewBox `0 0 72 78`, relación 0.92:1
- Colores dentro del SVG: isótipo `#132A13`, palabra "asted" `#90A955`

### Reglas de uso

- **Aire mínimo:** el ancho de la tapa del bote por los cuatro lados.
- **Tamaño mínimo:** lockup 120 px de ancho; isótipo 24 px de ancho.
- **Fondo:** blanco o `#ECF39E`. Sobre fondo oscuro (`#132A13`) se invierte: isótipo en `#ECF39E`, palabra en `#90A955`.
- **Nunca:** estirarlo, rotarlo, ponerle sombra o degradado, cambiar los colores entre sus dos partes, meterlo en una caja de color que no sea de la paleta, ni redibujar la W con otra tipografía.

### Nota de accesibilidad

La palabra "asted" en `#90A955` sobre blanco da 2.63:1, por debajo de WCAG AA. Los logotipos están exentos de esa regla, pero por eso **el logo siempre necesita texto alternativo** (`alt="Wasted"`) y nunca se usa como si fuera un párrafo. El isótipo, cuando acompaña a un título que ya dice el nombre, va como decorativo (`alt=""`).

---

## 2. Paleta

Cinco tonos. Un solo eje: verde. Sin color de apoyo, sin gris neutro que no sea el papel.

| Token | Hex | Nombre | Rol |
|---|---|---|---|
| `--forest` | `#132A13` | Forest | Texto principal, isótipo, fondos oscuros |
| `--pine` | `#31572C` | Pine | Texto secundario, ligas, citas |
| `--moss` | `#4F772D` | Moss | Acentos, marcadores de nota, filetes |
| `--sage` | `#90A955` | Sage | Solo decorativo: reglas, bordes, la palabra del logo |
| `--lime` | `#ECF39E` | Lime | Fondos de resalte, chips, bloques de cita |
| `--paper` | `#FFFFFF` | Paper | Fondo base |

### CSS listo para copiar

```css
:root {
  --forest: #132a13;
  --pine:   #31572c;
  --moss:   #4f772d;
  --sage:   #90a955;
  --lime:   #ecf39e;
  --paper:  #ffffff;
}
```

### Contraste (WCAG 2.1, medido)

| Color | Sobre blanco | Sobre `--lime` | Sobre `--forest` |
|---|---|---|---|
| `--forest` `#132A13` | **15.35** AAA | **13.07** AAA | — |
| `--pine` `#31572C` | **8.30** AAA | **7.07** AAA | 1.85 ✗ |
| `--moss` `#4F772D` | **5.24** AA | 4.46 ✗ | 2.93 ✗ |
| `--sage` `#90A955` | 2.63 ✗ | 2.24 ✗ | **5.84** AA |
| `--lime` `#ECF39E` | 1.17 ✗ | — | **13.07** AAA |

### Combinaciones permitidas

- Texto normal sobre blanco: `--forest`, `--pine`, `--moss`.
- Texto sobre `--lime`: `--forest` o `--pine`. **Moss no**, se queda en 4.46.
- Texto sobre `--forest`: `--lime` o `--sage`.
- `--sage` sobre claro: **nunca para texto**. Filetes, bordes e ilustración únicamente.

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

`../entregables/html design/wasted_FixedProposal.html` es la implementación viva del sistema: portada con el lockup, isótipo como marca en cada sección, entradas con filete `--sage`, citas sobre `--lime` y ligas en `--pine`. Cualquier pieza nueva copia esos patrones antes de inventar otros.
