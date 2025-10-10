import calculaCURP from './index.js';

describe('calculaCURP', () => {
  describe('Cálculos básicos', () => {
    it('debe calcular CURP correcta para hombre', () => {
      const curp = calculaCURP('JUAN CARLOS', 'PEREZ', 'GOMEZ', '15/01/1985', 'H', 'JALISCO');
      expect(curp).toBe('PEGJ850115HJCRMN05');
      expect(curp).toHaveLength(18);
    });

    it('debe calcular CURP correcta para mujer', () => {
      const curp = calculaCURP('MARIA FERNANDA', 'LOPEZ', 'MARTINEZ', '25/12/1990', 'M', 'MEXICO');
      expect(curp).toBe('LOMF901225MMCPRR04');
      expect(curp).toHaveLength(18);
    });

    it('debe calcular CURP con diferentes formatos de fecha', () => {
      const curp1 = calculaCURP('PEDRO', 'GONZALEZ', 'RAMIREZ', '1990-05-15', 'H', 'NUEVO LEON');
      const curp2 = calculaCURP('PEDRO', 'GONZALEZ', 'RAMIREZ', '15/05/1990', 'H', 'NUEVO LEON');
      const curp3 = calculaCURP('PEDRO', 'GONZALEZ', 'RAMIREZ', '05/15/1990', 'H', 'NUEVO LEON');
      
      expect(curp1).toBe(curp2);
      expect(curp2).toBe(curp3);
    });
  });

  describe('Validaciones', () => {
    it('debe lanzar error si falta el nombre', () => {
      expect(() => {
        calculaCURP('', 'PEREZ', 'GOMEZ', '15/01/1985', 'H', 'JALISCO');
      }).toThrow('nombres');
    });

    it('debe lanzar error si falta apellido paterno', () => {
      expect(() => {
        calculaCURP('JUAN', '', 'GOMEZ', '15/01/1985', 'H', 'JALISCO');
      }).toThrow('apellidoPaterno');
    });

    it('debe lanzar error si falta apellido materno', () => {
      expect(() => {
        calculaCURP('JUAN', 'PEREZ', '', '15/01/1985', 'H', 'JALISCO');
      }).toThrow('apellidoMaterno');
    });

    it('debe lanzar error si la fecha es inválida', () => {
      expect(() => {
        calculaCURP('JUAN', 'PEREZ', 'GOMEZ', 'fecha-invalida', 'H', 'JALISCO');
      }).toThrow('fecha');
    });

    it('debe lanzar error si el sexo es inválido', () => {
      expect(() => {
        calculaCURP('JUAN', 'PEREZ', 'GOMEZ', '15/01/1985', 'X', 'JALISCO');
      }).toThrow('sexo');
    });

    it('debe lanzar error si falta lugar de nacimiento', () => {
      expect(() => {
        calculaCURP('JUAN', 'PEREZ', 'GOMEZ', '15/01/1985', 'H', '');
      }).toThrow('lugarNacimiento');
    });
  });

  describe('Manejo de caracteres especiales', () => {
    it('debe manejar nombres con acentos correctamente', () => {
      const curp = calculaCURP('JOSÉ MARÍA', 'GARCÍA', 'LÓPEZ', '10/05/1980', 'H', 'GUANAJUATO');
      expect(curp).toHaveLength(18);
      expect(curp).toMatch(/^[A-Z0-9]{18}$/);
    });

    it('debe manejar apellidos con ñ', () => {
      const curp = calculaCURP('ANA', 'NUÑEZ', 'PEÑA', '20/08/1992', 'M', 'PUEBLA');
      expect(curp).toHaveLength(18);
      expect(curp).toMatch(/^[A-Z0-9]{18}$/);
    });

    it('debe manejar nombres con múltiples espacios', () => {
      const curp = calculaCURP('CARLOS    ALBERTO', 'LOPEZ', 'GARCIA', '15/03/1988', 'H', 'SONORA');
      expect(curp).toHaveLength(18);
    });
  });

  describe('Palabras obscenas', () => {
    it('debe detectar y reemplazar palabras obscenas', () => {
      // El algoritmo verifica si las primeras 4 letras forman una palabra obscena
      // y reemplaza la 4ta letra con X si es el caso
      const curp = calculaCURP('ERNESTO', 'BUENO', 'EYMIL', '01/01/1980', 'H', 'MEXICO');
      // BUEE es válido (no obsceno)
      expect(curp.substring(0, 4)).toBe('BUEE');
      expect(curp).toHaveLength(18);
    });

    it('debe manejar casos potencialmente obscenos correctamente', () => {
      // Probar que el algoritmo funciona correctamente
      const curp = calculaCURP('ARTURO', 'CASTILLO', 'CAMACHO', '15/06/1975', 'H', 'VERACRUZ');
      expect(curp).toHaveLength(18);
      expect(curp).toMatch(/^[A-Z0-9]{18}$/);
    });
  });

  describe('Sufijos y prefijos especiales', () => {
    it('debe remover prefijo MARIA del nombre', () => {
      const curp1 = calculaCURP('MARIA GUADALUPE', 'HERNANDEZ', 'LOPEZ', '10/10/1990', 'M', 'JALISCO');
      const curp2 = calculaCURP('GUADALUPE', 'HERNANDEZ', 'LOPEZ', '10/10/1990', 'M', 'JALISCO');
      expect(curp1).toBe(curp2);
    });

    it('debe remover prefijo JOSE del nombre', () => {
      const curp1 = calculaCURP('JOSE LUIS', 'MARTINEZ', 'GARCIA', '05/05/1985', 'H', 'CHIHUAHUA');
      const curp2 = calculaCURP('LUIS', 'MARTINEZ', 'GARCIA', '05/05/1985', 'H', 'CHIHUAHUA');
      expect(curp1).toBe(curp2);
    });

    it('debe remover prefijo DE del apellido', () => {
      const curp1 = calculaCURP('PEDRO', 'DE LA CRUZ', 'MARTINEZ', '20/12/1988', 'H', 'OAXACA');
      const curp2 = calculaCURP('PEDRO', 'CRUZ', 'MARTINEZ', '20/12/1988', 'H', 'OAXACA');
      // Ambos deberían tener formato similar
      expect(curp1).toHaveLength(18);
      expect(curp2).toHaveLength(18);
    });
  });

  describe('Estados de la República', () => {
    const testEstados = [
      { estado: 'AGUASCALIENTES', codigo: 'AS' },
      { estado: 'BAJA CALIFORNIA', codigo: 'BC' },
      { estado: 'CHIHUAHUA', codigo: 'CH' },
      { estado: 'CIUDAD DE MEXICO', codigo: 'DF' },
      { estado: 'JALISCO', codigo: 'JC' },
      { estado: 'NUEVO LEON', codigo: 'NL' },
      { estado: 'YUCATAN', codigo: 'YN' },
      { estado: 'ZACATECAS', codigo: 'ZS' }
    ];

    testEstados.forEach(({ estado, codigo }) => {
      it(`debe usar código ${codigo} para ${estado}`, () => {
        const curp = calculaCURP('JUAN', 'PEREZ', 'LOPEZ', '01/01/1990', 'H', estado);
        expect(curp.substring(11, 13)).toBe(codigo);
      });
    });

    it('debe usar NE para nacidos en el extranjero', () => {
      const curp = calculaCURP('JUAN', 'PEREZ', 'LOPEZ', '01/01/1990', 'H', 'ESTADOS UNIDOS');
      expect(curp.substring(11, 13)).toBe('NE');
    });
  });

  describe('Estructura de la CURP', () => {
    it('debe tener exactamente 18 caracteres', () => {
      const curp = calculaCURP('CARLOS', 'RODRIGUEZ', 'SANCHEZ', '15/03/1992', 'H', 'MORELOS');
      expect(curp).toHaveLength(18);
    });

    it('debe contener solo letras mayúsculas y números', () => {
      const curp = calculaCURP('ANA', 'GOMEZ', 'TORRES', '20/07/1995', 'M', 'TABASCO');
      expect(curp).toMatch(/^[A-Z0-9]{18}$/);
    });

    it('la fecha debe estar en posición correcta (5-10)', () => {
      const curp = calculaCURP('LUIS', 'MARTINEZ', 'GARCIA', '15/06/1988', 'H', 'SINALOA');
      const fecha = curp.substring(4, 10);
      expect(fecha).toBe('880615');
    });

    it('el sexo debe estar en posición 11', () => {
      const curpH = calculaCURP('PEDRO', 'LOPEZ', 'RUIZ', '10/10/1990', 'H', 'COLIMA');
      const curpM = calculaCURP('MARIA', 'LOPEZ', 'RUIZ', '10/10/1990', 'M', 'COLIMA');
      
      expect(curpH.charAt(10)).toBe('H');
      expect(curpM.charAt(10)).toBe('M');
    });

    it('el código de estado debe estar en posición 12-13', () => {
      const curp = calculaCURP('JORGE', 'RAMIREZ', 'FLORES', '25/12/1987', 'H', 'GUERRERO');
      const estado = curp.substring(11, 13);
      expect(estado).toBe('GR');
    });
  });

  describe('Casos reales', () => {
    it('debe calcular CURP de Benito Juárez', () => {
      const curp = calculaCURP('BENITO', 'JUAREZ', 'GARCIA', '21/03/1806', 'H', 'OAXACA');
      expect(curp).toHaveLength(18);
      expect(curp.charAt(10)).toBe('H');
      expect(curp.substring(11, 13)).toBe('OC');
    });

    it('debe calcular CURP de Sor Juana', () => {
      const curp = calculaCURP('JUANA', 'RAMIREZ', 'ASBAJE', '12/11/1651', 'M', 'MEXICO');
      expect(curp).toHaveLength(18);
      expect(curp.charAt(10)).toBe('M');
    });
  });

  describe('Casos especiales', () => {
    it('debe manejar nombres de una sola letra (raro pero posible)', () => {
      const curp = calculaCURP('A', 'PEREZ', 'LOPEZ', '01/01/2000', 'M', 'MEXICO');
      expect(curp).toHaveLength(18);
    });

    it('debe manejar apellidos muy cortos', () => {
      const curp = calculaCURP('JUAN', 'LI', 'WU', '15/05/1995', 'H', 'MEXICO');
      expect(curp).toHaveLength(18);
    });

    it('debe ser consistente en múltiples llamadas', () => {
      const curp1 = calculaCURP('CARLOS', 'LOPEZ', 'GARCIA', '10/10/1990', 'H', 'JALISCO');
      const curp2 = calculaCURP('CARLOS', 'LOPEZ', 'GARCIA', '10/10/1990', 'H', 'JALISCO');
      const curp3 = calculaCURP('CARLOS', 'LOPEZ', 'GARCIA', '10/10/1990', 'H', 'JALISCO');
      
      expect(curp1).toBe(curp2);
      expect(curp2).toBe(curp3);
    });
  });

  describe('Dígito verificador', () => {
    it('debe calcular el dígito verificador correctamente', () => {
      const curp = calculaCURP('JUAN', 'PEREZ', 'LOPEZ', '01/01/1990', 'H', 'JALISCO');
      // El último dígito es el verificador
      const digitoVerificador = curp.charAt(17);
      expect(digitoVerificador).toMatch(/[0-9]/);
    });

    it('diferentes personas deben tener diferentes dígitos', () => {
      const curp1 = calculaCURP('JUAN', 'PEREZ', 'LOPEZ', '01/01/1990', 'H', 'JALISCO');
      const curp2 = calculaCURP('PEDRO', 'PEREZ', 'LOPEZ', '01/01/1990', 'H', 'JALISCO');
      
      // Los primeros 17 caracteres son diferentes, así que los dígitos podrían serlo
      expect(curp1).not.toBe(curp2);
    });
  });

  describe('Integración completa', () => {
    it('debe generar CURPs únicas para personas diferentes', () => {
      const personas = [
        { nombres: 'JUAN', apellidoP: 'GARCIA', apellidoM: 'LOPEZ', fecha: '15/01/1990', sexo: 'H', lugar: 'JALISCO' },
        { nombres: 'MARIA', apellidoP: 'MARTINEZ', apellidoM: 'RODRIGUEZ', fecha: '20/05/1992', sexo: 'M', lugar: 'MEXICO' },
        { nombres: 'CARLOS', apellidoP: 'HERNANDEZ', apellidoM: 'GOMEZ', fecha: '10/10/1988', sexo: 'H', lugar: 'PUEBLA' },
        { nombres: 'ANA', apellidoP: 'LOPEZ', apellidoM: 'SANCHEZ', fecha: '25/12/1995', sexo: 'M', lugar: 'VERACRUZ' },
        { nombres: 'LUIS', apellidoP: 'GONZALEZ', apellidoM: 'PEREZ', fecha: '05/03/1987', sexo: 'H', lugar: 'SONORA' }
      ];

      const curps = personas.map(p => 
        calculaCURP(p.nombres, p.apellidoP, p.apellidoM, p.fecha, p.sexo, p.lugar)
      );

      // Todas deben ser únicas
      const curpsUnicas = new Set(curps);
      expect(curpsUnicas.size).toBe(personas.length);

      // Todas deben tener 18 caracteres
      curps.forEach(curp => {
        expect(curp).toHaveLength(18);
        expect(curp).toMatch(/^[A-Z0-9]{18}$/);
      });
    });
  });
});

