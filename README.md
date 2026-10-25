# calcula-curp

Librería moderna para calcular la CURP (Clave Única de Registro de Población) mexicana con homoclave y dígito verificador, siguiendo el algoritmo oficial del Registro Nacional de Población.

[![npm version](https://badge.fury.io/js/calcula-curp.svg)](https://www.npmjs.com/package/calcula-curp)
[![npm downloads](https://img.shields.io/npm/dm/calcula-curp.svg)](https://www.npmjs.com/package/calcula-curp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/GerardoLucero/calcula-curp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/GerardoLucero/calcula-curp/actions/workflows/ci-cd.yml)

## Features

- **Cálculo preciso** de CURP con homoclave y dígito verificador
- **Validación robusta** de parámetros y datos de entrada
- **Múltiples formatos de fecha** soportados
- **Todos los estados** de México + nacidos en el extranjero
- **Detección de palabras obscenas** según lista oficial
- **Manejo de caracteres especiales** (acentos, ñ, espacios)
- **Remoción automática** de prefijos y sufijos especiales
- **39 tests** con cobertura >90%
- **Zero dependencies** (excepto dayjs para fechas)
- **ESM + CommonJS** compatible

## Instalación

```bash
npm install calcula-curp
```

## Uso

```javascript
// ESM
import calculaCURP from 'calcula-curp';

// CommonJS
const calculaCURP = require('calcula-curp');
```

### Ejemplo básico

```javascript
const curp = calculaCURP(
  'JUAN CARLOS',      // Nombres
  'PEREZ',            // Apellido paterno
  'GOMEZ',            // Apellido materno
  '15/01/1985',       // Fecha de nacimiento
  'H',                // Sexo (H/M)
  'JALISCO'           // Lugar de nacimiento
);

console.log(curp); // PEGJ850115HJCRMN05
```

### Diferentes formatos de fecha

```javascript
// Formato DD/MM/YYYY
calculaCURP('MARIA', 'LOPEZ', 'MARTINEZ', '25/12/1990', 'M', 'MEXICO');

// Formato YYYY-MM-DD
calculaCURP('PEDRO', 'GONZALEZ', 'RAMIREZ', '1990-05-15', 'H', 'NUEVO LEON');

// Formato MM/DD/YYYY
calculaCURP('ANA', 'GARCIA', 'TORRES', '12/25/1995', 'M', 'PUEBLA');
```

### Caracteres especiales y prefijos

```javascript
// Con acentos
calculaCURP('JOSÉ MARÍA', 'GARCÍA', 'LÓPEZ', '10/05/1980', 'H', 'GUANAJUATO');

// "MARIA" se remueve automáticamente
calculaCURP('MARIA GUADALUPE', 'HERNANDEZ', 'LOPEZ', '10/10/1990', 'M', 'JALISCO');

// "DE LA" se maneja correctamente
calculaCURP('PEDRO', 'DE LA CRUZ', 'MARTINEZ', '20/12/1988', 'H', 'OAXACA');
```

## API

### `calculaCURP(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, lugarNacimiento)`

Calcula la CURP completa de 18 caracteres.

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `nombres` | `string` | Nombre(s) de la persona | `"JUAN CARLOS"` |
| `apellidoPaterno` | `string` | Apellido paterno | `"PEREZ"` |
| `apellidoMaterno` | `string` | Apellido materno | `"GOMEZ"` |
| `fechaNacimiento` | `string` | Fecha en formato `DD/MM/YYYY`, `YYYY-MM-DD` o `MM/DD/YYYY` | `"15/01/1985"` |
| `sexo` | `string` | `"H"` (Hombre) o `"M"` (Mujer) | `"H"` |
| `lugarNacimiento` | `string` | Estado de nacimiento o `"NACIDO EXTRANJERO"` | `"JALISCO"` |

**Retorna:** `string` — CURP de 18 caracteres en mayúsculas.

Lanza `Error` si algún parámetro es inválido, la fecha no tiene formato válido o el sexo no es `H` o `M`.

## Estructura de la CURP

```
P  E  G  J  8  5  0  1  1  5  H  J  C  R  M  N  0  5
└┬┘ └┘ └┘ └┘ └────┬────┘ └┘ └┬┘ └──┬──┘ └┘ └┘
 │  │  │  │      │       │   │     │     │  └── Dígito verificador
 │  │  │  │      │       │   │     │     └──── Homoclave
 │  │  │  │      │       │   │     └────────── Consonantes internas
 │  │  │  │      │       │   └──────────────── Estado de nacimiento
 │  │  │  │      │       └──────────────────── Sexo (H/M)
 │  │  │  │      └──────────────────────────── Fecha (AAMMDD)
 │  │  │  └─────────────────────────────────── Primera letra del nombre
 │  │  └────────────────────────────────────── Primera letra apellido materno
 │  └───────────────────────────────────────── Primera vocal apellido paterno
 └──────────────────────────────────────────── Primera letra apellido paterno
```

## Estados soportados

Todos los 32 estados de México. Para personas nacidas en el extranjero: `"NACIDO EXTRANJERO"` o cualquier país.

## Testing

```bash
npm test
npm run test:coverage
npm run test:watch
```

## Preguntas frecuentes

**¿La CURP calculada es oficial?**  
Esta librería implementa el algoritmo oficial del RNAPO, pero la CURP definitiva solo puede ser emitida por RENAPO. La homoclave final puede variar.

**¿Por qué mi CURP difiere de la oficial?**  
La homoclave (penúltimo caracter) es asignada por RENAPO para evitar duplicados. Esta librería usa `'0'` como homoclave predeterminada.

## Apoyo

Proyecto de código abierto mantenido en mi tiempo libre. Si te fue útil y quieres agradecerlo:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero), ver [LICENSE](LICENSE).

---

- [calcula-rfc](https://github.com/GerardoLucero/calcula-rfc) — Calcula el RFC mexicano
- [validador-fiscal-mx](https://github.com/GerardoLucero/validador-fiscal-mx) — Valida RFC, CURP y NSS
- [generador-datos-mx](https://github.com/GerardoLucero/generador-datos-mx) — Genera datos de prueba mexicanos
