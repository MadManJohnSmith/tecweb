$(document).ready(function () {
	console.log("JQuery cargado");
	$("#product-result").hide();

	$("#search").keyup(function () {
		if ($("#search").val()) {
			let search = $("#search").val();
			$.ajax({
				url: "./backend/product-search.php",
				type: "POST",
				data: { search },
				success: function (response) {
					if (!response.error) {
						let products = JSON.parse(response);
						let template = "";
                        let template_bar = '';
						products.forEach((product) => {
							template += `
                               <li><a href="#" class="task-item">${product.name}</a></li>
                              `;
						});
						$("#product-result")
							.addClass("card my-4 d-block")
							.show();
						$("#container").html(template_bar);
						$("#products").html(template);
					}
				},
			});
		}
	});
});
function listarProductos() {
    $.ajax({
        url: "./backend/product-list.php",
        type: "GET",
        success: function(response){
            let products = JSON.parse(response);
            let template = '';
            products.forEach(producto => {
                // SE COMPRUEBA QUE SE OBTIENE UN OBJETO POR ITERACIÓN
                //console.log(producto);

                // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                let descripcion = '';
                descripcion += '<li>precio: '+producto.precio+'</li>';
                descripcion += '<li>unidades: '+producto.unidades+'</li>';
                descripcion += '<li>modelo: '+producto.modelo+'</li>';
                descripcion += '<li>marca: '+producto.marca+'</li>';
                descripcion += '<li>detalles: '+producto.detalles+'</li>';
            
                template += `
                    <tr productId="${producto.id}">
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td><ul>${descripcion}</ul></td>
                        <td>
                            <button class="product-delete btn btn-danger" onclick="eliminarProducto()">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });
            $("#products").html(template);
        }
    });
}
// JSON BASE A MOSTRAR EN FORMULARIO
var baseJSON = {
	precio: 0.0,
	unidades: 1,
	modelo: "XX-000",
	marca: "NA",
	detalles: "NA",
	imagen: "img/default.png",
};

function init() {
	/**
	 * Convierte el JSON a string para poder mostrarlo
	 * ver: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON
	 */
	var JsonString = JSON.stringify(baseJSON, null, 2);
	document.getElementById("description").value = JsonString;

	// SE LISTAN TODOS LOS PRODUCTOS
	listarProductos();
}
