let edit = false;

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
		id: $("#productID").val(),
		nombre: nombreProducto, 
		marca: descripcion.marca,
		modelo: descripcion.modelo,
		precio: descripcion.precio,
		detalles: descripcion.detalles,
		unidades: descripcion.unidades,
		imagen: descripcion.imagen,
	};
	let url= edit === false ? './backend/product-add.php' : './backend/product-edit.php';
	if (!validarJSON(postData)) {
		return;
	}
	// Se envían los datos al servidor
	$.post(
		url,
		JSON.stringify(postData),
		function (response) {
			let template_bar = "";
			template_bar += `
            <li style="list-style: none;">status: ${response.status}</li>
            <li style="list-style: none;">message: ${response.message}</li>
        `;
			$("#product-result").addClass("card my-4 d-block").show();
			$("#container").html(template_bar);
			listarProductos();
			// Se reinicia el formulario
			$("#product-form").trigger("reset");
			$("#description").val(JSON.stringify(baseJSON, null, 2));
		},
		"json"
	);
});

$(document).on("click", ".product-delete", function () {
	if (confirm("¿Estás seguro de eliminar este producto?")) {
		let element = $(this)[0].parentElement.parentElement;
		let id = $(element).attr("productId");
		$.get(
			"./backend/product-delete.php",
			{ id },
			function (response) {
				// Se procesa la respuesta
				let template_bar = "";
				template_bar += `
                <li style="list-style: none;">status: ${response.status}</li>
                <li style="list-style: none;">message: ${response.message}</li>
            `;
				$("#product-result").addClass("card my-4 d-block").show();
				$("#container").html(template_bar);
				listarProductos();
			},
			"json"
		);
	}
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
                            <td><a href="#" class="product-item">${producto.nombre}</a></td>
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
$(document).on('click', '.product-item', function() {
    let element = $(this)[0].parentElement.parentElement;
    let id = $(element).attr('productId');
    $.post('./backend/product-single.php', { id }, function(response) {
        const product = JSON.parse(response);
        
        // Crear el nuevo objeto con el formato requerido
        const formattedProduct = {
            precio: product.precio,
            unidades: product.unidades,
            modelo: product.modelo || "",
            marca: product.marca || "",
            detalles: product.detalles || "",
            imagen: product.imagen || ""
        };
        $("#productID").val(product.id);
        $("#name").val(product.nombre);
        $("#description").val(JSON.stringify(formattedProduct, null, 2));
        edit = true;
    });
});

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
	let edit = false;
}
function validarNombre() {
    var nombre = document.getElementById("name").value.trim();
    if (nombre.length === 0) {
        alert("Ingresa un nombre.");
        return false;
    } else if (nombre.length > 100) {
        alert("¿Para que el nombre tan largo?");
        return false;
    }
    return true;
}
function validarMarca(json) {
    var marca = json.marca.trim();
    let marcas = ["Cisco", "D-Link", "Linksys", "Netgear", "TP-Link"];
    if (marca.length === 0) {
        alert("Ingresa una marca.");
        return false;
    } else if (!marcas.includes(marca)) {
        alert("La marca no esta en la lista: 'Cisco', 'D-Link', 'Linksys', 'Netgear', 'TP-Link'.");
        return false;
    }
    return true;
}
function validarModelo(json) {
    var modelo = json.modelo.trim();
    if (modelo.length === 0) {
        alert("Se te olvido el modelo.");
        return false;
    } else if (!/^[A-Za-z0-9 ]+$/.test(modelo)) {
        alert("Se ingreso un caracter invalido.");
        return false;
    } else if (modelo.length > 25) {
        alert("Modelo excede el limite de 25 caracteres.");
        return false;
    }
    return true;
}
function validarPrecio(json) {
    var precio = json.precio;
    var aux = parseFloat(precio);
    if (precio.length === 0) {
        alert("Ingresa un precio.");
        return false;
    } else if (isNaN(aux) || aux < 99.99) {
        alert("El precio debe ser mayor a $99.99.");
        return false;
    }
    return true;
}
function validarDetalles(json) {
    var detalles = json.detalles.trim();
    if (detalles.length > 250) {
        alert("Mucho texto en detalles el limite es de 250 caracteres.");
        return false;
    }
    return true;
}
function validarUnidades(json) {
    var unidades = json.unidades;
    var aux = parseInt(unidades);
    if (unidades.length === 0) {
        alert("¿Cuantas unidades ingreso, joven?");
        return false;
    } else if (isNaN(aux) || aux < 1) {
        alert("El numero de unidades debe ser mayor a 0.");
        return false;
    }
    return true;
}
//Ya hay imagen default en el frontend
function validarJSON(json) {
	const validaciones = [
		() => validarNombre(),
		() => validarMarca(json),
		() => validarModelo(json),
		() => validarPrecio(json),
		() => validarDetalles(json),
		() => validarUnidades(json),
	];
	for (let validar of validaciones) {
		if (!validar()) {
			return false;
		}
	}
	return true;
}
