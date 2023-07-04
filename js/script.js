// Simplificar función mostrar en consola
function log(e) {
    console.log(e);
};

// Permite max. 2 productos antes de proyecto final
function validarCantidad(cantidad) {
    return (
        cantidad !== '' &&  // No debe estar vacío
        !isNaN(cantidad) && // No debe ser una cadena de textos
        parseInt(cantidad) > 0 && // Debe ser un número entero mayor que: 0
        parseInt(cantidad) <= 2 // Debe ser un número entero menor o igual a: 2
    );
};

// Valida si es Precio Neto está vacío o si es un string
function validarPrecioNeto(precioNeto) {
    return (
        precioNeto !== '' &&
        !isNaN(precioNeto) &&
        parseFloat(precioNeto) > 0
    );
};

// Validar monto del descuento >= 0.00 y <= 100.00; y si es en monto o porcentaje
function validarDescuento(descuento) {
    const regexNumPct = /^([0-9]{1,2}(\.[0-9]+)?|100(\.([0-9]+)?)?)%$/;
    const regexPctNum = /^%([0-9]{1,2}(\.[0-9]+)?|100(\.([0-9]+)?)?)$/;
    // Prompt aceptado en blanco ó cancelado, asigna descuento = 0 por defecto
    if (descuento === '' || descuento === null) {
        //? log('Descuento: Vacío o Cancelado.'); //! Borra
        descuento = 0;
        return true;
        // Es monto: número entre 0 y 100
    } else if (!isNaN(descuento) && parseFloat(descuento) >= 0 && parseFloat(descuento) <= 100) {
        //? log('Descuento es: monto'); //! Borra
        return true;
        // Es porcentaje: número entre 0 y 100 que comienza ó termina con el signo: %
    } else if (regexNumPct.test(descuento) || regexPctNum.test(descuento)) {
        //? log('Descuento es: porcentaje (comienza o termina con: %)'); //! Borra
        return true;
    } else {
        // Es un dato inválido
        alert('Dato inválido'); //! Borra
        //return validarDescuento(prompt());
    };
};

// Procesa los montos para el cálculo del total
function calcularTotal(precioNeto, descuento) {
    const iva = 1.19; // IVA en Chile = 19%
    // Si el descuento es aceptado vacío
    if (isNaN(descuento)) {
        //? log('Descuento calculado vacío.');
        const total = precioNeto * iva;
        descuento = 0;
        return total.toFixed(2); // Asegura que el total tenga 2 decimales
        // Si el descuento es en monto
    } else if (!isNaN(descuento)) {
        //? log('Descuento calculado con un monto.');
        const total = (precioNeto - descuento) * iva;
        return total.toFixed(2);
        //? Si el descuento es en porcentaje
    } else {
        const descuentoPorcentaje = parseFloat(descuento.replace('%', '')); // Elimina el signo de % para el cálculo
        const total = (precioNeto * ((100 - descuentoPorcentaje) / 100)) * iva; // Realiza el cálculo con porcentaje
        return total.toFixed(2);
    };
};

// Solicita los datos del o de los productos
function solicitarDatosProducto(numeroProducto) {
    const precioNeto = prompt(`Asigne un Precio Neto\nProducto Nro. ${numeroProducto}`);
    // Si cancela el prompt, el programa se termina
    if (precioNeto === null) {
        alert('Programa terminado.');
        return null;
    };

    if (!validarPrecioNeto(precioNeto)) {
        alert('Debe ingresar un precio.');
        return solicitarDatosProducto(numeroProducto);
    };

    const descuento = prompt(`Descuento Producto Nro. ${numeroProducto}\nMonto o porcentaje %`);
    if (descuento === null) {
        return {
            precioNeto: parseFloat(precioNeto),
            descuento: 0,
        };
    };
    if (!validarDescuento(descuento)) { // ToDo: separar funciones precio y descuento en el futuro para continuar desde el 
        return solicitarDatosProducto(numeroProducto);
    };

    if (descuento.includes("%")) {
        return {
            precioNeto: parseFloat(precioNeto),
            descuento: parseFloat(descuento.replace("%", "")),
            esPorcentaje: true,
        };
    } else {
        return {
            precioNeto: parseFloat(precioNeto),
            descuento: parseFloat(descuento),
            esPorcentaje: false,
        };
    };
};

function iniciar() {
    const cantidadProductos = prompt("Cantidad de productos (recomendamos 2 max.)");

    if (cantidadProductos === null) {
        alert('Programa terminado.');
        return;
    };
    // Pide la cantidad hasta que se válida.
    if (!validarCantidad(cantidadProductos)) {
        iniciar();
        return;
    };

    for (let i = 1; i <= parseInt(cantidadProductos); i++) {
        console.log(`Datos del Producto ${i}:`);

        const datosProducto = solicitarDatosProducto(i);
        if (datosProducto === null) {
            return;
        };

        const { precioNeto, descuento, esPorcentaje } = datosProducto;

        console.log('Monto Imponible:', precioNeto);
        console.log('Descuento:', !isNaN(descuento) ? descuento : 0, esPorcentaje ? '%' : '');
        console.log('Precio Neto:', precioNeto - (!isNaN(descuento) ? descuento : 0));
        console.log('IVA: 19%'); // ToDo: Hay que agregar el iva en monto: (calcularTotal(precioNeto, descuento)-(precioNeto - descuento)).toFixed(2) 
        console.log('Total:', calcularTotal(precioNeto, descuento));
    };
};

let idnro = 0;

class Producto {
    constructor(nombre, precioNeto, existencia) {
        this.id = this.crearID();
        this.nombre = nombre;
        this.precioNeto = parseFloat(precioNeto);
        this.existencia = parseFloat(existencia);
    };
    
    crearID() {
        return ++idnro;
    };

    cantidadProductos() {
        const iva = .19;
      	let ivaMonto = this.precioNeto * iva;
        let precioTotal = this.precioNeto + ivaMonto;
        return (`
        ID: ${this.id}
        Nombre: ${this.nombre}
        Precio Neto: ${this.precioNeto}
        IVA 19%: ${ivaMonto}
        Precio Total: ${precioTotal}
        Existencia: ${this.existencia}
        Total Inventario: ${this.existencia * precioTotal}
        `);
    };

};

class Inventario {
    constructor(nombre) {
        this.nombre = nombre;
        this.productos = [];
    };

    agregarProducto(producto) {
        this.productos.push(producto);
    };

    cantidadProductos() {
        return (`Inventario: ${this.nombre}
        Cantidad de Producto: ${this.productos.length}`);
    };

    verProductos() {
        let datosProductos = "";
        this.productos.forEach(producto => {
            datosProductos += `${producto.cantidadProductos()} \n`;
        });
        return datosProductos;
    };

    verProducto(id) {
        let producto = this.productos.find(producto => producto.id === id);
        if (producto) {
            return producto.cantidadProductos();
        } else {
            return (`Producto ${id} inexistente.`);
        }
    };

    modificarProducto(id, nombre, precioNeto) {
        let producto = this.productos.find(producto => producto.id === id);
        producto.nombre = nombre;
        producto.precioNeto = precioNeto;
    };

    eliminarProducto(id) {
        let producto = this.productos.find(producto => producto.id === id);
        let index = this.productos.indexOf(producto);
        this.productos.splice(index, 1);
    };

};

function gestionarInventario() {
    let inventario = new Inventario("Programación");
    let menu = "";
    let producto = "";
    let id = 0;
    let nombre = "";
    let precioNeto = 0;
    let existencia = 0;
    
    do {
        menu = prompt(`Menú - Maestro de productos
        1. Agregar.
        2. Ver.
        3. Modificar.
        4. Eliminar.
        5. Listar.
        6. Cantidad Productos.
        ===
        7. Vender productos.
        ===
        q. Salir.`);
        switch (menu) {
            case '1': // Agregar
                nombre = prompt('Nombre del producto');
                precioNeto = prompt('Precio Neto');
                existencia = parseInt(prompt('Cantidad de Existencia'));
                producto = new Producto(nombre, precioNeto, existencia);
                inventario.agregarProducto(producto);
                break;
            case '2': // Ver
                id = parseInt(prompt("VER\nProducto con el ID:"));
                alert(inventario.verProducto(id));
                break;
            case '3': // Modificar
                id = parseInt(prompt('MODIFICAR\nProducto con el ID:'));
                nombre = prompt('Nuevo: Nombre');
                precioNeto = parseFloat(prompt('Nuevo: Precio Neto.'));
                inventario.modificarProducto(id, nombre, precioNeto);
                break;
            case '4': // Eliminar
                id = parseInt(prompt('ELIMINAR\nProducto con el ID:'));
                inventario.eliminarProducto(id);
                break;
            case '5': // Listar
                alert(inventario.verProductos());
                break;
            case '6': // Cantidad productos
                alert(inventario.cantidadProducto());
                break;
            case '7': // Programa de venta
                iniciar();
                break;
            case 'q': //Salir
                break;
            default:
                alert('Debe elegir una de las opciones del menú.');
                break;
        };
    } while (menu !== 'q');
};

gestionarInventario();