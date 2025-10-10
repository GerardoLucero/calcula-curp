export default calculaCURP;
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
declare function calculaCURP(nombres: string, apellidoPaterno: string, apellidoMaterno: string, fechaNacimiento: string, sexo: string, lugarNacimiento: string): string;
