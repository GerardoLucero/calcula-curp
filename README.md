# 🆔 calcula-curp

[![npm version](https://badge.fury.io/js/calcula-curp.svg)](https://www.npmjs.com/package/calcula-curp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Librería moderna para calcular la **CURP (Clave Única de Registro de Población)** mexicana con homoclave y dígito verificador, siguiendo el algoritmo oficial del Registro Nacional de Población.

## ✨ Características

- 🎯 **Cálculo preciso** de CURP con homoclave y dígito verificador
- 🛡️ **Validación robusta** de parámetros y datos de entrada
- 🔄 **Múltiples formatos de fecha** soportados
- 🌎 **Todos los estados** de México + nacidos en el extranjero
- 🚫 **Detección de palabras obscenas** según lista oficial
- 📝 **Manejo de caracteres especiales** (acentos, ñ, espacios)
- 🎭 **Remoción automática** de prefijos y sufijos especiales
- ✅ **39 tests** con cobertura >90%
- 📦 **Zero dependencies** (excepto dayjs para fechas)
- 🌐 **ESM + CommonJS** compatible

---

## 📥 Instalación

```bash
npm install calcula-curp
```

---

## 🚀 Uso

### Importación

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
// LOMF901225MMCPRR04

// Formato YYYY-MM-DD
calculaCURP('PEDRO', 'GONZALEZ', 'RAMIREZ', '1990-05-15', 'H', 'NUEVO LEON');
// GORP900515HNLNZD06

// Formato MM/DD/YYYY
calculaCURP('ANA', 'GARCIA', 'TORRES', '12/25/1995', 'M', 'PUEBLA');
// GATA951225MPLLRN02
```

### Manejo de caracteres especiales

```javascript
// Con acentos
calculaCURP('JOSÉ MARÍA', 'GARCÍA', 'LÓPEZ', '10/05/1980', 'H', 'GUANAJUATO');
// GALJ800510HGTRRN03

// Con ñ
calculaCURP('ANA', 'NUÑEZ', 'PEÑA', '20/08/1992', 'M', 'PUEBLA');
// NUPA920820MPLLXN09
```

### Prefijos especiales (MARIA, JOSE, DE, etc.)

```javascript
// "MARIA" se remueve automáticamente
calculaCURP('MARIA GUADALUPE', 'HERNANDEZ', 'LOPEZ', '10/10/1990', 'M', 'JALISCO');
// HELG901010MJCRPD01

// "JOSE" se remueve automáticamente
calculaCURP('JOSE LUIS', 'MARTINEZ', 'GARCIA', '05/05/1985', 'H', 'CHIHUAHUA');
// MAGL850505HCHRRS08

// "DE LA" se maneja correctamente
calculaCURP('PEDRO', 'DE LA CRUZ', 'MARTINEZ', '20/12/1988', 'H', 'OAXACA');
// CUMP881220HOCRRR05
```

---

## 📚 API

### `calculaCURP(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, lugarNacimiento)`

Calcula la CURP completa de 18 caracteres.

#### Parámetros

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `nombres` | `string` | Nombre(s) de la persona | `"JUAN CARLOS"` |
| `apellidoPaterno` | `string` | Apellido paterno | `"PEREZ"` |
| `apellidoMaterno` | `string` | Apellido materno | `"GOMEZ"` |
| `fechaNacimiento` | `string` | Fecha en formato `DD/MM/YYYY`, `YYYY-MM-DD` o `MM/DD/YYYY` | `"15/01/1985"` |
| `sexo` | `string` | `"H"` (Hombre) o `"M"` (Mujer) | `"H"` |
| `lugarNacimiento` | `string` | Estado de nacimiento o "NACIDO EXTRANJERO" | `"JALISCO"` |

#### Retorno

- **`string`**: CURP de 18 caracteres en mayúsculas

#### Excepciones

Lanza `Error` si:
- Algún parámetro requerido está vacío
- El sexo no es 'H' o 'M'
- La fecha no tiene un formato válido
- Cualquier parámetro es inválido

---

## 🗺️ Estados soportados

Todos los 32 estados de México:

```
Aguascalientes, Baja California, Baja California Sur, Campeche, Chiapas,
Chihuahua, Coahuila, Colima, Ciudad de México, Durango, Guanajuato,
Guerrero, Hidalgo, Jalisco, México, Michoacán, Morelos, Nayarit,
Nuevo León, Oaxaca, Puebla, Querétaro, Quintana Roo, San Luis Potosí,
Sinaloa, Sonora, Tabasco, Tamaulipas, Tlaxcala, Veracruz, Yucatán, Zacatecas
```

Para personas nacidas en el extranjero, usa: `"NACIDO EXTRANJERO"` o cualquier país.

---

## 🧩 Estructura de la CURP

La CURP tiene 18 caracteres con la siguiente estructura:

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

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

**Cobertura actual**: >90% en todas las métricas

---

## 🛠️ Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/GerardoLucero/calcula-curp.git
cd calcula-curp

# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Lint
npm run lint

# Build
npm run build
```

---

## 📖 Ejemplos adicionales

### Casos especiales

```javascript
// Benito Juárez
calculaCURP('BENITO', 'JUAREZ', 'GARCIA', '21/03/1806', 'H', 'OAXACA');
// JUGB060321HOCRRN08

// Sor Juana Inés de la Cruz
calculaCURP('JUANA', 'RAMIREZ', 'ASBAJE', '12/11/1651', 'M', 'MEXICO');
// RAAJ511112MMCMSN04
```

### Validación de errores

```javascript
try {
  calculaCURP('', 'PEREZ', 'GOMEZ', '15/01/1985', 'H', 'JALISCO');
} catch (error) {
  console.error(error.message);
  // Error al calcular CURP: El parámetro [nombres] es requerido y no puede estar vacío
}

try {
  calculaCURP('JUAN', 'PEREZ', 'GOMEZ', 'fecha-invalida', 'H', 'JALISCO');
} catch (error) {
  console.error(error.message);
  // Error al calcular CURP: La fecha de nacimiento debe tener un formato válido
}
```

---

## ❓ Preguntas Frecuentes

### ¿La CURP calculada es oficial?

Esta librería implementa el algoritmo oficial del Registro Nacional de Población, pero la CURP definitiva solo puede ser emitida por RENAPO. La homoclave final puede variar.

### ¿Por qué mi CURP calculada difiere de la oficial?

La homoclave (penúltimo caracter) es asignada automáticamente por RENAPO para evitar duplicados. Esta librería usa '0' como homoclave predeterminada.

### ¿Soporta CURPs antiguas?

Sí, la librería calcula CURPs para cualquier fecha de nacimiento, incluyendo fechas históricas.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

---

## 💖 Donaciones

Si esta librería te resulta útil, considera hacer una donación:

### GitHub Sponsors
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red?logo=GitHub)](https://github.com/sponsors/GerardoLucero)

### Buy Me a Coffee
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow.svg)](https://www.buymeacoffee.com/gerardolucero)

### PayPal
[![PayPal](https://img.shields.io/badge/PayPal-donate-blue.svg)](https://www.paypal.me/gerardolucero)

---

## 🔗 Enlaces relacionados

- [calcula-rfc](https://github.com/GerardoLucero/calcula-rfc) - Calcula el RFC mexicano
- [validador-fiscal-mx](https://github.com/GerardoLucero/validador-fiscal-mx) - Valida RFC y CURP
- [generador-datos-mx](https://github.com/GerardoLucero/generador-datos-mx) - Genera datos de prueba mexicanos

---

**Hecho con ❤️ en México 🇲🇽**
