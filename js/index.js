// Funcion Ready
$(document).ready(function(){
    if("carrito" in localStorage) {
      const arrayLiterales = JSON.parse(localStorage.getItem("carrito"));
      for(const literal of arrayLiterales) {
        carrito.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad, literal.imagen,));
      }
      carritoUI(carrito);
    }
    $(".dropdown-menu").click(function(e){
      e.stopPropagation();
    });
  
    // GET para importar datos del JSON
    $.get("../data/producto.json", function(datos, estado){
      console.log(datos);
      console.log(estado);
      if(estado == "success") {
        for(const literal of datos){
          productos.push(new Producto(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad, literal.imagen,));
        }
      }
      console.log(productos);
      productosUIjQuery(productos, '#productosContenedor');
    });
  
  });
  
  selectUI(categorias, "#filtroCategorias");
  
  $('#filtroCategorias').change(function(e) {
    const value = this.value;
  
    $('#productosContenedor').fadeOut(600, function(){
      if(value == 'Todos'){
        productosUIjQuery(productos, '#productosContenedor');
      } else {
        const filtrados = productos.filter(producto => producto.categoria == value);
        productosUIjQuery(filtrados, '#productosContenedor');
      }
      $("#productosContenedor").fadeIn();
    })
  });
  