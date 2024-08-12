let ventaIntermediadaObject = {};
let idVentaIntermediadaInput = document.getElementById('idVentaIntermediadaInput');
let idTecnicoInput = document.getElementById('idTecnicoInput');
let nombreTecnicoInput = document.getElementById('nombreTecnicoInput');
let tipoCodigoClienteInput = document.getElementById('tipoCodigoClienteInput');
let codigoClienteInput = document.getElementById('idClienteInput');
let nombreClienteInput = document.getElementById('nombreClienteInput');
let fechaHoraEmisionInput = document.getElementById('fechaHoraEmisionVentaIntermediadaInput');
let montoTotalInput = document.getElementById('montoTotalInput');
let puntosGanadosInput = document.getElementById('puntosGanadosInput');

let formInputsArray = [
    idVentaIntermediadaInput, 
    idTecnicoInput, 
    nombreTecnicoInput, 
    tipoCodigoClienteInput,
    codigoClienteInput,
    nombreClienteInput,
    fechaHoraEmisionInput,
    montoTotalInput,
    puntosGanadosInput,
];

let codigoClienteTooltip = document.getElementById("idCodigoClienteTooltip");
let fechaHoraEmisionTooltip = document.getElementById("fechaHoraEmisionTooltip");
let multiMessageError = document.getElementById('multiMessageError2');

function selectOptionAgregarVenta(value, idInput, idOptions) {
    //Colocar en el input la opción seleccionada 
    selectOption(value, idInput, idOptions); 

    // Extraer id y nombre del valor
    const [id, nombre] = value.split(' - ');
    
    // Actualizar los campos ocultos
    if (id && nombre) {
        idTecnicoInput.value = id;
        nombreTecnicoInput.value = nombre;
    } else {
        idTecnicoInput.value = "";
        nombreTecnicoInput.value = "";
    }

    var nuevaVentaMessageError = document.getElementById('nuevaVentaMessageError');
    nuevaVentaMessageError.classList.remove('shown'); 
}

function validateValueOnRealTime(input) {
    var nuevaVentaMessageError = document.getElementById('nuevaVentaMessageError');

    const value = input.value;
    
    // Obtener todos los valores de técnicos
    const allTecnicos = getAllIdNombreTecnicos();
    
    // Comparar el valor ingresado con la lista de técnicos
    const tecnicoEncontrado = allTecnicos.includes(value);

    const [id, nombre] = value.split(' - ');

    if (value === "") {
        console.log("El campo Técnico está vacío");
        nuevaVentaMessageError.classList.remove('shown'); 
        idTecnicoInput.value = "";
        nombreTecnicoInput.value = "";
    } else {
        if (!tecnicoEncontrado) {
            console.log("No se encontró el técnico buscado");
            nuevaVentaMessageError.classList.add('shown'); 
            
            idTecnicoInput.value = "";
            nombreTecnicoInput.value = "";
        } else {
            console.log("Sí se encontró el técnico buscado");
            nuevaVentaMessageError.classList.remove('shown'); 

            // Actualizar los inputs ocultos
            if (id && nombre) {
                idTecnicoInput.value = id;
                nombreTecnicoInput.value = nombre;
            } 
        }
    }
}

function getAllIdNombreTecnicos() {
    // Obtener el elemento UL que contiene todas las opciones
    const ul = document.getElementById('tecnicoOptions');
    
    // Obtener todos los elementos LI dentro de la UL
    const liElements = ul.getElementsByTagName('li');
    
    // Extraer el texto de cada LI y almacenarlo en un array
    let tecnicos = [];
    for (let li of liElements) {
        tecnicos.push(li.textContent.trim());
    }
    
    return tecnicos;
}

function analizarXML(file) {
    /*
    HACER PRUEBA UNITARIA PARA ESTA FUNCIÓN 
    */
    
    const reader = new FileReader();

    reader.onload = function(event) {
        const xmlText = event.target.result;

        // Parsear el contenido XML en un documento DOM
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        // Obtener valores
        const idVentaIntermediada = getElementText(xmlDoc, 'cbc', 'ID');

        const cliente = {
			codigoCliente: getElementText(xmlDoc, 'cbc', 'ID', 'cac:AccountingCustomerParty', 'cac:Party', 'cac:PartyIdentification'),
			nombreCliente: getElementText(xmlDoc, 'cbc', 'RegistrationName', 'cac:AccountingCustomerParty', 'cac:Party', 'cac:PartyLegalEntity')
		};

        const fechaHoraEmision = {
            fecha: getElementText(xmlDoc, 'cbc', 'IssueDate'),
            hora: getElementText(xmlDoc, 'cbc', 'IssueTime')
        };

        const montoTotal = getElementText(xmlDoc, 'cbc', 'PayableAmount');

        // Detectar tipo de código cliente
        const tipoCodigoCliente = detectarTipoCodigoCliente(cliente.codigoCliente);

		// Crear un array con los valores
        ventaIntermediadaObject = {
            idVentaIntermediada: idVentaIntermediada,
            tipoCodigoCliente: tipoCodigoCliente,
            clienteCodigo: cliente.codigoCliente,
            clienteNombre: cliente.nombreCliente,
            fechaEmision: fechaHoraEmision.fecha,
            horaEmision: fechaHoraEmision.hora,
            montoTotal: montoTotal,
            puntosGanados: Math.round(parseFloat(montoTotal)),
        }

		// Imprimir en consola usando Object.entries()
        Object.entries(ventaIntermediadaObject).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });

        if (!idTecnicoInput.value.trim() || !nombreTecnicoInput.value.trim()) {
            console.log("Tiene que rellenar los campos del técnico");
            multiMessageError.classList.add("shown");
            multiMessageError.textContent = "Tiene que rellenar el campo de Técnico primero";
            clearSomeHiddenInputs();
        } else {
            multiMessageError.classList.remove("shown");
            console.log("Sí se rellenó los campos del técnico");
            fillSomeHiddenInputs(ventaIntermediadaObject);
        }
    };

    reader.onerror = function(event) {
        console.error('Error al leer el archivo:', event.target.error);
    };

    reader.readAsText(file);
}

function clearSomeHiddenInputs() {
    formInputsArray.forEach(input => {
        if (input) {
            input.value = "";
        }
    });
}

function fillSomeHiddenInputs(ventaIntermediadaObject) {
    idVentaIntermediadaInput.value = ventaIntermediadaObject.idVentaIntermediada || '';
    tipoCodigoClienteInput.value = ventaIntermediadaObject.tipoCodigoCliente || '';
    codigoClienteInput.value = ventaIntermediadaObject.clienteCodigo || '';
    nombreClienteInput.value = ventaIntermediadaObject.clienteNombre || '';
    fechaHoraEmisionInput.value = ventaIntermediadaObject.fechaEmision + " " + ventaIntermediadaObject.horaEmision || '';
    montoTotalInput.value = ventaIntermediadaObject.montoTotal || '';
    puntosGanadosInput.value = ventaIntermediadaObject.puntosGanados || ''; 
}

function getElementText(xmlDoc, prefix, tagName, ...path) {
    const namespaces = {
        cbc: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
        cac: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2'
    };

    let element = xmlDoc.documentElement;

    // Navegar a través de los elementos
    for (let step of path) {
        const stepPrefix = step.split(':')[0];
        const stepName = step.split(':')[1] || step;
        element = element.getElementsByTagNameNS(namespaces[stepPrefix] || '', stepName)[0];
        if (!element) {
            console.log(`No se encontró el elemento: ${step}`);
            return '';
        }
    }

    // Obtener el elemento final
    const finalElement = element.getElementsByTagNameNS(namespaces[prefix] || '', tagName)[0];
    if (!finalElement) {
        console.log(`No se encontró el elemento final: ${tagName}`);
        return '';
    }

    return finalElement.textContent.trim();
}

function detectarTipoCodigoCliente(codigoCliente) {
    return codigoCliente.length === 8 ? 'DNI' : codigoCliente.length === 11 ? 'RUC' : 'Desconocido';
}

function validateDateTimeManualInput(dateTimeInput) {
    let dateTimeValue = dateTimeInput.value;
    console.log("Valor original:", dateTimeValue);

    // Expresión regular para el formato aaaa-mm-dd hh:mm:ss
    const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

    // Verificar si el valor tiene el formato correcto
    if (dateTimeValue.length >= 19) {
        if (regex.test(dateTimeValue)) {
            const [, year, month, day, hour, minute, second] = dateTimeValue.match(regex);

            // Convertir a números
            const yearNum = parseInt(year, 10);
            const monthNum = parseInt(month, 10);
            const dayNum = parseInt(day, 10);
            const hourNum = parseInt(hour, 10);
            const minuteNum = parseInt(minute, 10);
            const secondNum = parseInt(second, 10);

            // Validar rangos
            if (yearNum >= 1900 && yearNum <= 2100 &&
                monthNum >= 1 && monthNum <= 12 &&
                hourNum >= 0 && hourNum <= 23 &&
                minuteNum >= 0 && minuteNum <= 59 &&
                secondNum >= 0 && secondNum <= 59) {

                // Validar días del mes
                const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
                if (dayNum >= 1 && dayNum <= daysInMonth) {
                    console.log("Fecha y hora válidas");
                    return true;
                }
            }
        }
        // Limpiar el input si es inválido
        dateTimeInput.value = ''; 
        showHideTooltip(fechaHoraEmisionTooltip, "Fecha y hora inválidas");
    }
}

function validatePositiveFloat(input) {
    // Obtener el valor del input
    let value = input.value;
    
    // Eliminar todos los caracteres que no sean dígitos o punto decimal
    let newValue = value.replace(/[^\d.]/g, '');
    
    // Asegurar que solo haya un punto decimal
    let parts = newValue.split('.');
    if (parts.length > 2) {
        parts = [parts[0], parts.slice(1).join('')];
    }
    newValue = parts.join('.');
    
    // Limitar a dos decimales
    if (parts.length > 1) {
        parts[1] = parts[1].slice(0, 2);
        newValue = parts.join('.');
    }
    
    // Remover ceros iniciales innecesarios
    newValue = newValue.replace(/^0+(?=\d)/, '');
    
    // Si el valor es vacío o solo un punto, establecer a cero
    if (newValue === '' || newValue === '.') {
        newValue = '0';
    }
    
    // Actualizar el campo de entrada con el valor filtrado
    if (newValue !== value) {
        input.value = newValue;
        
        // Mover el cursor al final del input
        input.setSelectionRange(newValue.length, newValue.length);
    }
}

function validarCamposFormulario() {
    let allFilled = true;
    formInputsArray.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });
    return allFilled;
}

function validateRealTimeDNIRUCInputLength(numDocumentoInput, idTipoDocumentoInput) {
    const tipoDocumentoInput = document.getElementById(idTipoDocumentoInput).value;
    let numDocumentoInputValue = numDocumentoInput.value;
    
    const limites = {
        DNI: 8,
        RUC: 11
    };

    if (limites[tipoDocumentoInput] !== undefined) {
        if (numDocumentoInputValue.length > limites[tipoDocumentoInput]) {
            numDocumentoInputValue = numDocumentoInputValue.slice(0, limites[tipoDocumentoInput]);
            numDocumentoInput.value = numDocumentoInputValue;
        }
    } else {
        numDocumentoInput.value = "";

         // Mostrar y ocultar el tooltip
        showHideTooltip(codigoClienteTooltip, "Seleccione tipo de documento primero");
    }
}

function guardarModalAgregarVenta(idModal, idForm) {
    if (validarCamposFormulario()) {
        console.log("Enviando formulario correctamente.")
        multiMessageError.textContent = "Enviando formulario correctamente.";
        multiMessageError.classList.remove("shown");
        //guardarModal(idModal, idForm);
    } else {
        console.log("Todos los campos del formulario deben estar rellenados correctamente.")
        multiMessageError.textContent = "Todos los campos del formulario deben estar rellenados correctamente.";
        multiMessageError.classList.add("shown");
    }
}

document.addEventListener('DOMContentLoaded', function() {

    function updatePuntosGanados() {
        // Copia el valor de "Monto total" al campo de "Puntos generados"
        puntosGanadosInput.value = Math.round(parseFloat(montoTotalInput.value));
    }
   
    // Agrega un listener para el evento "input" en "Monto total"
    montoTotalInput.addEventListener('input', updatePuntosGanados);
});

