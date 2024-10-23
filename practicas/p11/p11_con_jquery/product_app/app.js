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
					console.log("Response from server:", response);
					if (!response.error) {
						let products = JSON.parse(response);
						//if (Object.keys(products).length > 0) {
						// SE CREA UNA PLANTILLA PARA CREAR LAS FILAS A INSERTAR EN EL DOCUMENTO HTML
						let template = "";
						let template_bar = "";

						products.forEach((producto) => {
							// SE COMPRUEBA QUE SE OBTIENE UN OBJETO POR ITERACIÓN
							//console.log(producto);

							// SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
							let descripcion = "";
							descripcion +=
								"<li>precio: " + producto.precio + "</li>";
							descripcion +=
								"<li>unidades: " + producto.unidades + "</li>";
							descripcion +=
								"<li>modelo: " + producto.modelo + "</li>";
							descripcion +=
								"<li>marca: " + producto.marca + "</li>";
							descripcion +=
								"<li>detalles: " + producto.detalles + "</li>";

							template += `
                                        <tr productId="${producto.id}">
                                            <td>${producto.id}</td>
                                            <td>${producto.nombre}</td>
                                            <td><ul>${descripcion}</ul></td>
                                        </tr>
                                    `;

							template_bar += `
                                        <li>${producto.nombre}</il>
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
$("#product-form").submit(function agregarProducto(e) {
    e.preventDefault();

    // Se obtienen los valores del formulario
    const nombreProducto = $("#name").val();
    const descripcion = JSON.parse($("#description").val());

    // Se prepara el objeto para enviar en el formato correcto
    const postData = {
        nombre: nombreProducto,   // Cambia 'name' a 'nombre' para coincidir con el PHP
        marca: descripcion.marca,
        modelo: descripcion.modelo,
        precio: descripcion.precio,
        detalles: descripcion.detalles,
        unidades: descripcion.unidades,
        imagen: descripcion.imagen,
    };

    // Se envían los datos al servidor
    $.post("./backend/product-add.php", JSON.stringify(postData), function (response) {
        // Se procesa la respuesta
        let template_bar = '';
        template_bar += `
            <li style="list-style: none;">status: ${response.status}</li>
            <li style="list-style: none;">message: ${response.message}</li>
        `;

        // Se hace visible la barra de estado
        $("#product-result").addClass("card my-4 d-block").show();
        $("#container").html(template_bar);

        // Se listan los productos nuevamente
        listarProductos();
        // Se reinicia el formulario
        $("#product-form").trigger("reset");
        $("#description").val(JSON.stringify(baseJSON, null, 2));
    }, 'json'); // Asegúrate de que la respuesta sea interpretada como JSON
});

function listarProductos() {
	$.ajax({
		url: "./backend/product-list.php",
		type: "GET",
		success: function (response) {
			let products = JSON.parse(response);
			let template = "";
			products.forEach((producto) => {
				// SE COMPRUEBA QUE SE OBTIENE UN OBJETO POR ITERACIÓN
				//console.log(producto);

				// SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
				let descripcion = "";
				descripcion += "<li>precio: " + producto.precio + "</li>";
				descripcion += "<li>unidades: " + producto.unidades + "</li>";
				descripcion += "<li>modelo: " + producto.modelo + "</li>";
				descripcion += "<li>marca: " + producto.marca + "</li>";
				descripcion += "<li>detalles: " + producto.detalles + "</li>";

				template += `
                        <tr productId="${producto.id}">
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                            <td>
                                <button class="product-delete btn btn-danger">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `;
			});
			$("#products").html(template);
		},
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
