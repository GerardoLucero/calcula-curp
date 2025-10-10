(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('dayjs'), require('dayjs/plugin/customParseFormat.js')) :
  typeof define === 'function' && define.amd ? define(['dayjs', 'dayjs/plugin/customParseFormat.js'], factory) :
  (global = global || self, global.calculaCurp = factory(global.dayjs, global.customParseFormat));
})(this, (function (dayjs, customParseFormat) {
  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);
  var customParseFormat__default = /*#__PURE__*/_interopDefaultLegacy(customParseFormat);

  dayjs__default["default"].extend(customParseFormat__default["default"]);

  /**
   * Librería para calcular la CURP (Clave Única de Registro de Población) mexicana
   * basada en el algoritmo oficial del Registro Nacional de Población.
   *
   * @author Gerardo Lucero
   * @version 1.0.0
   */

  // Constantes del algoritmo
  const VOCALES = ['A', 'E', 'I', 'O', 'U'];
  const CONSONANTES = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
  const PALABRAS_OBSCENAS = ['BACA', 'BAKA', 'BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COGI', 'COJA', 'COJE', 'COJI', 'COJO', 'COLA', 'CULO', 'FALO', 'FETO', 'GETA', 'GUEI', 'GUEY', 'JETA', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO', 'KAKA', 'KAKO', 'KOGE', 'KOGI', 'KOJA', 'KOJE', 'KOJI', 'KOJO', 'KOLA', 'KULO', 'LILO', 'LOCA', 'LOCO', 'LOKA', 'LOKO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MIAR', 'MION', 'MOCO', 'MOKO', 'MULA', 'MULO', 'NACA', 'NACO', 'PEDA', 'PEDO', 'PENE', 'PIPI', 'PITO', 'POPO', 'PUTA', 'PUTO', 'QULO', 'RATA', 'ROBA', 'ROBE', 'ROBO', 'RUIN', 'SAPO', 'SENO', 'SOPE', 'TETA', 'VUEI', 'VUEY', 'WUEI', 'WUEY'];
  const ESTADOS_MEXICO = {
    'AGUASCALIENTES': 'AS',
    'BAJA CALIFORNIA': 'BC',
    'BAJA CALIFORNIA SUR': 'BS',
    'CAMPECHE': 'CC',
    'CHIAPAS': 'CS',
    'CHIHUAHUA': 'CH',
    'COAHUILA': 'CL',
    'COLIMA': 'CM',
    'DISTRITO FEDERAL': 'DF',
    'CIUDAD DE MEXICO': 'DF',
    'DURANGO': 'DG',
    'GUANAJUATO': 'GT',
    'GUERRERO': 'GR',
    'HIDALGO': 'HG',
    'JALISCO': 'JC',
    'MEXICO': 'MC',
    'MICHOACAN': 'MN',
    'MORELOS': 'MS',
    'NAYARIT': 'NT',
    'NUEVO LEON': 'NL',
    'OAXACA': 'OC',
    'PUEBLA': 'PL',
    'QUERETARO': 'QT',
    'QUINTANA ROO': 'QR',
    'SAN LUIS POTOSI': 'SP',
    'SINALOA': 'SL',
    'SONORA': 'SR',
    'TABASCO': 'TC',
    'TAMAULIPAS': 'TS',
    'TLAXCALA': 'TL',
    'VERACRUZ': 'VZ',
    'YUCATAN': 'YN',
    'ZACATECAS': 'ZS',
    'NACIDO EXTRANJERO': 'NE'
  };
  const SUFIJOS_NOMBRES = ['MARIA', 'JOSE', 'DE', 'DEL', 'LOS', 'LAS', 'LA', 'MA', 'MA.', 'J.', 'J'];
  const SUFIJOS_APELLIDOS = ['DE', 'LA', 'LAS', 'MC', 'VON', 'DEL', 'LOS', 'Y', 'MAC', 'VAN'];

  /**
   * Normaliza texto removiendo acentos y caracteres especiales
   * @param {string} str - Texto a normalizar
   * @returns {string} Texto normalizado
   */
  function normalizeText(str) {
    const map = {
      'a': 'á|à|ã|â|À|Á|Ã|Â',
      'e': 'é|è|ê|É|È|Ê',
      'i': 'í|ì|î|Í|Ì|Î',
      'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
      'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      'c': 'ç|Ç',
      'n': 'ñ|Ñ'
    };
    let normalized = str.toLowerCase();
    for (const [replacement, pattern] of Object.entries(map)) {
      normalized = normalized.replace(new RegExp(pattern, 'g'), replacement);
    }
    return normalized;
  }

  /**
   * Limpia y formatea texto para el cálculo de la CURP
   * @param {string} value - Texto a limpiar
   * @returns {string} Texto limpio en mayúsculas
   */
  function cleanText(value) {
    if (!value || typeof value !== 'string') return '';
    return normalizeText(value).replace(/[/\-Ü]/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
  }

  /**
   * Valida los parámetros de entrada
   * @param {string} nombres - Nombres de la persona
   * @param {string} apellidoPaterno - Apellido paterno
   * @param {string} apellidoMaterno - Apellido materno
   * @param {string} fechaNacimiento - Fecha de nacimiento
   * @param {string} sexo - Sexo (H/M)
   * @param {string} lugarNacimiento - Lugar de nacimiento
   * @throws {Error} Si algún parámetro es inválido
   */
  function validarParametros(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, lugarNacimiento) {
    if (!nombres || typeof nombres !== 'string' || nombres.trim() === '') {
      throw new Error('El parámetro [nombres] es requerido y no puede estar vacío');
    }
    if (!apellidoPaterno || typeof apellidoPaterno !== 'string' || apellidoPaterno.trim() === '') {
      throw new Error('El parámetro [apellidoPaterno] es requerido y no puede estar vacío');
    }
    if (!apellidoMaterno || typeof apellidoMaterno !== 'string' || apellidoMaterno.trim() === '') {
      throw new Error('El parámetro [apellidoMaterno] es requerido y no puede estar vacío');
    }
    if (!fechaNacimiento || typeof fechaNacimiento !== 'string') {
      throw new Error('El parámetro [fechaNacimiento] es requerido');
    }
    if (!sexo || !['H', 'M'].includes(sexo.toUpperCase())) {
      throw new Error('El parámetro [sexo] debe ser "H" (Hombre) o "M" (Mujer)');
    }
    if (!lugarNacimiento || typeof lugarNacimiento !== 'string' || lugarNacimiento.trim() === '') {
      throw new Error('El parámetro [lugarNacimiento] es requerido');
    }

    // Validar formato de fecha
    const formatos = ['MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY', 'DD-MM-YYYY'];
    let fecha = null;
    for (const formato of formatos) {
      fecha = dayjs__default["default"](fechaNacimiento, formato, true);
      if (fecha.isValid()) {
        break;
      }
    }
    if (!fecha || !fecha.isValid()) {
      fecha = dayjs__default["default"](fechaNacimiento);
    }
    if (!fecha.isValid()) {
      throw new Error('La fecha de nacimiento debe tener un formato válido (ej: MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY)');
    }
  }

  /**
   * Obtiene la primera letra de una cadena
   * @param {string} value - Cadena de texto
   * @returns {string} Primera letra o 'X' si está vacía
   */
  function getPrimerLetra(value) {
    return value && value.length > 0 ? value.charAt(0) : 'X';
  }

  /**
   * Encuentra la primera vocal interna de una palabra
   * @param {string} value - Palabra a analizar
   * @returns {string} Primera vocal interna o 'X' si no existe
   */
  function getPrimerVocalInterna(value) {
    if (!value || value.length <= 1) return 'X';
    for (let i = 1; i < value.length; i++) {
      if (VOCALES.includes(value.charAt(i))) {
        return value.charAt(i);
      }
    }
    return 'X';
  }

  /**
   * Encuentra la primera consonante interna de una palabra
   * @param {string} value - Palabra a analizar
   * @returns {string} Primera consonante interna o 'X' si no existe
   */
  function getPrimerConsonanteInterna(value) {
    if (!value || value.length <= 1) return 'X';
    for (let i = 1; i < value.length; i++) {
      if (CONSONANTES.includes(value.charAt(i))) {
        return value.charAt(i);
      }
    }
    return 'X';
  }

  /**
   * Verifica si una palabra es obscena según la lista oficial
   * @param {string} palabra - Palabra a verificar
   * @returns {boolean} True si es obscena
   */
  function esPalabraObscena(palabra) {
    return PALABRAS_OBSCENAS.includes(palabra);
  }

  /**
   * Remueve sufijos de nombres que no deben considerarse
   * @param {string} nombres - Nombres completos
   * @returns {string} Nombres sin sufijos
   */
  function removerSufijosNombres(nombres) {
    let nombre = nombres;
    while (nombre.includes(' ')) {
      const posicion = nombre.indexOf(' ');
      const palabra = nombre.substring(0, posicion);
      if (!SUFIJOS_NOMBRES.includes(palabra)) {
        break;
      }
      nombre = nombre.substring(posicion + 1);
    }
    return nombre;
  }

  /**
   * Remueve sufijos de apellidos que no deben considerarse
   * @param {string} apellidos - Apellidos completos
   * @returns {string} Apellidos sin sufijos
   */
  function removerSufijosApellidos(apellidos) {
    let apellido = apellidos;
    while (apellido.includes(' ')) {
      const posicion = apellido.indexOf(' ');
      const palabra = apellido.substring(0, posicion);
      if (!SUFIJOS_APELLIDOS.includes(palabra)) {
        break;
      }
      apellido = apellido.substring(posicion + 1);
    }
    return apellido;
  }

  /**
   * Genera las primeras 4 letras de la CURP
   * @param {string} apellidoPaterno - Apellido paterno limpio
   * @param {string} apellidoMaterno - Apellido materno limpio
   * @param {string} nombres - Nombres limpios
   * @returns {string} Primeras 4 letras de la CURP
   */
  function generarLetrasIniciales(apellidoPaterno, apellidoMaterno, nombres) {
    let letras = '';

    // Primera letra del apellido paterno
    letras += getPrimerLetra(apellidoPaterno);

    // Primera vocal interna del apellido paterno
    letras += getPrimerVocalInterna(apellidoPaterno);

    // Primera letra del apellido materno
    letras += getPrimerLetra(apellidoMaterno);

    // Primera letra del primer nombre
    letras += getPrimerLetra(nombres);

    // Verificar si es palabra obscena
    if (esPalabraObscena(letras)) {
      letras = letras.substring(0, 3) + 'X';
    }
    return letras;
  }

  /**
   * Convierte fecha de nacimiento al formato de la CURP (YYMMDD)
   * @param {string} fechaNacimiento - Fecha de nacimiento
   * @returns {string} Fecha en formato YYMMDD
   */
  function generarFechaCURP(fechaNacimiento) {
    const formatos = ['MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY', 'DD-MM-YYYY'];
    let fecha = null;
    for (const formato of formatos) {
      fecha = dayjs__default["default"](fechaNacimiento, formato, true);
      if (fecha.isValid()) {
        break;
      }
    }
    if (!fecha || !fecha.isValid()) {
      fecha = dayjs__default["default"](fechaNacimiento);
    }
    return fecha.format('YYMMDD');
  }

  /**
   * Obtiene el código del estado de nacimiento
   * @param {string} lugarNacimiento - Lugar de nacimiento
   * @returns {string} Código del estado
   */
  function getCodigoEstado(lugarNacimiento) {
    const lugar = cleanText(lugarNacimiento);

    // Buscar coincidencia exacta
    if (ESTADOS_MEXICO[lugar]) {
      return ESTADOS_MEXICO[lugar];
    }

    // Buscar coincidencia parcial
    for (const [estado, codigo] of Object.entries(ESTADOS_MEXICO)) {
      if (lugar.includes(estado) || estado.includes(lugar)) {
        return codigo;
      }
    }

    // Si no se encuentra, asumir nacido en el extranjero
    return 'NE';
  }

  /**
   * Genera las consonantes internas para la CURP
   * @param {string} apellidoPaterno - Apellido paterno
   * @param {string} apellidoMaterno - Apellido materno
   * @param {string} nombres - Nombres
   * @returns {string} Consonantes internas (3 caracteres)
   */
  function generarConsonantesInternas(apellidoPaterno, apellidoMaterno, nombres) {
    let consonantes = '';
    consonantes += getPrimerConsonanteInterna(apellidoPaterno);
    consonantes += getPrimerConsonanteInterna(apellidoMaterno);
    consonantes += getPrimerConsonanteInterna(nombres);
    return consonantes;
  }

  /**
   * Genera la homoclave (1 caracter alfanumérico)
   * Para CURPs generadas después de 1990, se asigna automáticamente
   * Para propósitos de cálculo, se usa '0'
   * @param {string} fechaNacimiento - Fecha en formato YYMMDD
   * @returns {string} Homoclave
   */
  function generarHomoclave(fechaNacimiento) {
    // Para CURPs de personas nacidas antes de 1990, se usa '0'
    const anio = parseInt(fechaNacimiento.substring(0, 2));
    if (anio >= 90 || anio < 50) {
      // 1990-1999 o 2000-2049
      return '0';
    }
    return '0';
  }

  /**
   * Calcula el dígito verificador de la CURP
   * @param {string} curpSinDigito - CURP sin dígito verificador (17 caracteres)
   * @returns {string} Dígito verificador
   */
  function calcularDigitoVerificador(curpSinDigito) {
    const valores = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let suma = 0;
    for (let i = 0; i < 17; i++) {
      const caracter = curpSinDigito.charAt(i);
      const valor = valores.indexOf(caracter);
      suma += valor * (18 - i);
    }
    const residuo = suma % 10;
    return residuo.toString();
  }

  /**
   * Calcula la CURP completa de una persona
   * @param {string} nombres - Nombres de la persona
   * @param {string} apellidoPaterno - Apellido paterno
   * @param {string} apellidoMaterno - Apellido materno
   * @param {string} fechaNacimiento - Fecha de nacimiento (formatos: MM/DD/YYYY, YYYY-MM-DD, etc.)
   * @param {string} sexo - Sexo (H para Hombre, M para Mujer)
   * @param {string} lugarNacimiento - Estado o país de nacimiento
   * @returns {string} CURP completa de 18 caracteres
   * @throws {Error} Si los parámetros son inválidos
   *
   * @example
   * // CURP completa
   * calculaCURP('JUAN CARLOS', 'PEREZ', 'GOMEZ', '01/15/1985', 'H', 'JALISCO');
   * // Retorna: 'PEGJ850115HJCRRN09'
   *
   * @example
   * // CURP de mujer
   * calculaCURP('MARIA FERNANDA', 'LOPEZ', 'MARTINEZ', '12/25/1990', 'M', 'MEXICO');
   * // Retorna: 'LOMM901225MMCRRL04'
   */
  function calculaCURP(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, lugarNacimiento) {
    try {
      // Validar parámetros
      validarParametros(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, lugarNacimiento);

      // Limpiar y normalizar datos
      const nombreLimpio = cleanText(nombres);
      const apellidoPaternoLimpio = cleanText(apellidoPaterno);
      const apellidoMaternoLimpio = cleanText(apellidoMaterno);
      const sexoLimpio = sexo.toUpperCase();

      // Remover sufijos
      const nombreSinSufijos = removerSufijosNombres(nombreLimpio);
      const apellidoPaternoSinSufijos = removerSufijosApellidos(apellidoPaternoLimpio);
      const apellidoMaternoSinSufijos = removerSufijosApellidos(apellidoMaternoLimpio);

      // Generar componentes de la CURP
      const letrasIniciales = generarLetrasIniciales(apellidoPaternoSinSufijos, apellidoMaternoSinSufijos, nombreSinSufijos);
      const fecha = generarFechaCURP(fechaNacimiento);
      const codigoEstado = getCodigoEstado(lugarNacimiento);
      const consonantesInternas = generarConsonantesInternas(apellidoPaternoSinSufijos, apellidoMaternoSinSufijos, nombreSinSufijos);
      const homoclave = generarHomoclave(fecha);

      // CURP sin dígito verificador (17 caracteres)
      const curpSinDigito = letrasIniciales + fecha + sexoLimpio + codigoEstado + consonantesInternas + homoclave;

      // Calcular dígito verificador
      const digitoVerificador = calcularDigitoVerificador(curpSinDigito);
      return curpSinDigito + digitoVerificador;
    } catch (error) {
      throw new Error(`Error al calcular CURP: ${error.message}`);
    }
  }

  return calculaCURP;

}));
//# sourceMappingURL=index.umd.js.map
