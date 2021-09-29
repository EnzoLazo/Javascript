// Generamos las cards con Jquery
function productosUIjQuery(productos, id){
    $(id).empty()
    for (const producto of productos) {
        $(id).append(`<div class="locationn">
        <img class="ff" src="${producto.imagen}" width="20px" alt="producto">
        <div>
        <h5 class="cardd" >${producto.nombre}</h5>
        <p class="cardd" >$${producto.precio}</p>
        <button class="btn btnflex btn-primary1 btn-compra" id="${producto.id}">Agregar al carrito</button>
        </div>
        </div>`);
    }
    $('.btn-compra').on("click", comprarProducto);
}  
// Creamos la función de compra
function comprarProducto(e){
e.preventDefault();
e.stopPropagation();

const idProducto   = e.target.id;
const seleccionado = carrito.find(p => p.id == idProducto);

if(seleccionado == undefined){
    carrito.push(productos.find(p => p.id == idProducto));
} else {
seleccionado.agregarCantidad(1);
}

//Guardamos la función en el Storage
localStorage.setItem("carrito", JSON.stringify(carrito));


//Iniciamos la salida del carrito de compra
carritoUI(carrito);
}

// Creamos la función para activar el carrito
function carritoUI(productos){
$('#carritoCantidad').html(productos.length);
$('#carritoProductos').empty();
for (const producto of productos) {
    $('#carritoProductos').append(registroCarrito(producto));
}
$("#carritoProductos").append(`<p id="totalCarrito"> TOTAL ${totalCarrito(productos)}</p>`);
$("#carritoProductos").append(`<div id="divConfirmar" class="text-center"><button id="btnConfirmar" class="btn btn-success">CONFIRMAR</button></div>`);

//Asociamos con Jquery las acciones a los botones
$(".btn-add").click(addCantidad);
$(".btn-delete").click(eliminarCarrito);
$(".btn-restar").click(restarCantidad);
$("#btnConfirmar").click(confirmarCompra);
}

// Creamos con jquery el carrito en el HTML
function registroCarrito(producto){
    return `<p> ${producto.nombre} 
            <span class="badge bg-warning"> Pracio unitario: $ ${producto.precio}</span>
            <span class="badge bg-dark"> Cantidad: ${producto.cantidad}</span>
            <span class="badge bg-success"> Precio total: $ ${producto.subtotal()}</span>
            <a id="${producto.id}" class="btn btn-info btn-add">+</a>
            <a id="${producto.id}" class="btn btn-warning btn-restar">-</a>
            <a id="${producto.id}" class="btn btn-danger btn-delete">x</a>
            </p>`
}
// Función para eliminar objetos del carrito
function eliminarCarrito(e) {
    console.log(e.target.id);
    let posicion = carrito.findIndex(p => p.id == e.target.id);
    carrito.splice(posicion, 1);
    console.log(carrito);
    carritoUI(carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para sumar cantidades de objetos en el carrito
function addCantidad() {
let producto = carrito.find(p => p.id == this.id);
    producto.agregarCantidad(1);
    $(this).parent().children()[1].innerHTML = producto.cantidad;
    $(this).parent().children()[2].innerHTML = producto.subtotal();
$("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para restar cantidades de objetos en el carrito
function restarCantidad() {
    let producto = carrito.find(p => p.id == this.id);
    if(producto.cantidad > 1) {
    producto.agregarCantidad(-1);
    let registroUI = $(this).parent().children();
    registroUI[1].innerHTML = producto.cantidad;
    registroUI[2].innerHTML = producto.subtotal();
$("#totalCarrito").html(`Total ${totalCarrito(carrito)}`);
localStorage.setItem("carrito", JSON.stringify(carrito));
}
}

// Función de selector de valores para las categorias
function selectUI(lista, selector){
    $(selector).empty();
lista.forEach(element => {
    $(selector).append(`<option value="${element}">${element}</option>`)
    });
    $(selector).prepend(`<option value="Todos" selected>Todos</option>`);
}
// Función que obtiene el valor total
function totalCarrito(carrito) {
    console.log(carrito);
    let total = 0;
    carrito.forEach(p => total += p.subtotal());
    return total.toFixed(2);
}
// Backend
function confirmarCompra(){

// Se genera el POST
const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
//Declaramos la información a enviar
const DATA = {productos: JSON.stringify(carrito), total: totalCarrito(carrito)}
// Utilizamos AJAX
$.post(URLPOST, DATA, function(respuesta,estado){
    if(estado == 'success'){
        $("#notificaciones").html(`<div class="alert alert-sucess alert-dismissible fade show alerta" role="alert" >
                    <strong>COMPRA CONFIRMADA!</strong> Comprobante Nº ${respuesta.id}.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`).fadeIn().delay(2000);
        carrito.splice(0, carrito.length);
        localStorage.setItem("CARRITO",'[]');
        $('#carritoProductos').empty();
        $('#carritoCantidad').html(0);
        }
    });
}