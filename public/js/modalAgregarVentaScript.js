// JavaScript para el modal
function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        setTimeout(function() {
            modal.style.opacity = 1; // Hacer el modal visible de forma gradual
            modal.querySelector('.modal-dialog').style.transform = 'translateY(0)'; // Animación de entrada del modal
            modal.querySelector('.modal-dialog').style.opacity = 1; // Hacer el modal-content visible gradualmente
        }, 50); // Pequeño retraso para asegurar la transición CSS
        document.body.style.overflow = 'hidden'; // Evita el scroll de fondo cuando está abierto el modal
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.style.opacity = 0; // Hacer el modal gradualmente invisible
        modal.querySelector('.modal-dialog').style.transform = 'translateY(-50px)'; // Animación de salida del modal
        modal.querySelector('.modal-dialog').style.opacity = 0; // Hacer el modal-content gradualmente invisible
        setTimeout(function() {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Permite el scroll de nuevo cuando se cierra el modal
        }, 300); // Espera 0.3 segundos (igual a la duración de la transición CSS)
    }
}

/*Selección de archivos, falta agregar la lógica para evitar arrastrar archivos con acceso denegado */
// Función para simular clic en el input file al hacer clic en el botón
function handleFileSelect() {
    document.getElementById('fileInput').click();
}

// Event listener para cuando ya se seleccionó un archivo
document.getElementById('fileInput').addEventListener('change', function() {
    var file = this.files[0]; // Obtener el archivo seleccionado
    if (file) {
        analizarXML(file);
    }
});

// Función para permitir soltar archivos
function allowDrop(event) {
    event.preventDefault();
}

// Event listener para soltar sobre el área
document.getElementById('fileArea').addEventListener('drop', function(event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0]; // Obtener el archivo soltado
    if (file) {
        analizarXML(file);
    }
});

//Lógica para manejar el archivo xml seleccionado
function analizarXML(file) {
    console.log('Archivo seleccionado:', file.name);
    // Aquí puedes agregar más lógica para analizar o procesar el archivo XML según tus necesidades
}

// Función para guardar la venta (ejemplo)
function guardarVenta(modalAgregarVenta) {
    // Aquí puedes agregar lógica para enviar el formulario o realizar otras acciones necesarias
    document.getElementById('formAgregarVenta').submit();
    closeModal(modalAgregarVenta);
}

function toggleOptions(id) {
    var options = document.getElementById(id);
    options.style.display = (options.style.display === 'block') ? 'none' : 'block';
}

// Cerrar opciones si se hace clic fuera
document.addEventListener('click', function(event) {
    var isClickInside = document.getElementById('tecnicoSelect').contains(event.target);
    if (!isClickInside) {
        document.getElementById('tecnicoOptions').style.display = "none";
    }
});

function filterOptions() {
    var input, filter, ul, li, i, txtValue, hasVisibleOptions = false;
    input = document.getElementById('tecnicoInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById('tecnicoOptions');
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        txtValue = li[i].textContent || li[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            hasVisibleOptions = true;
        } else {
            li[i].style.display = "none";
        }
    }

    // Mostrar la lista de opciones si hay coincidencias, ocultarla si no
    ul.style.display = hasVisibleOptions ? "block" : "none";
}

function selectOption(value) {
    var input = document.getElementById('tecnicoInput');
    var options = document.getElementById('tecnicoOptions');

    if (input) {
        input.value = value;
        options.style.display = 'none'; // Ocultar las opciones
    } else {
        console.error('El elemento con id tecnicoInput no se encontró en el DOM');
    }
}
