// JSON BASE A MOSTRAR EN FORMULARIO

var baseJSON = {
	precio: 0.0,
	unidades: 1,
	modelo: "XX-000",
	marca: "NA",
	detalles: "NA",
	imagen: "img/default.png",
};
function buscarProducto(e) {
	e.preventDefault();
	var id = document.getElementById("search").value;
	var client = getXMLHttpRequest();
	client.open("POST", "./backend/read.php", true);
	client.setRequestHeader(
		"Content-Type",
		"application/x-www-form-urlencoded"
	);
	client.onreadystatechange = function () {
		if (client.readyState == 4 && client.status == 200) {
			console.log("[CLIENTE]\n" + client.responseText);
			let productos = JSON.parse(client.responseText);
			if (productos.length > 0) {
				let template = "";
				productos.forEach((producto) => {
					let descripcion = "";
					descripcion += "<li>precio: " + producto.precio + "</li>";
					descripcion +=
						"<li>unidades: " + producto.unidades + "</li>";
					descripcion += "<li>modelo: " + producto.modelo + "</li>";
					descripcion += "<li>marca: " + producto.marca + "</li>";
					descripcion +=
						"<li>detalles: " + producto.detalles + "</li>";
					template += `
                        <tr>
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                        </tr>
                    `;
				});
				document.getElementById("productos").innerHTML = template;
			}
		}
	};
	client.send("id=" + id);
}

// FUNCIÓN CALLBACK DE BOTÓN "Buscar"
function buscarID(e) {
	/**
	 * Revisar la siguiente información para entender porqué usar event.preventDefault();
	 * https://www.geeksforgeeks.org/when-to-use-preventdefault-vs-return-false-in-javascript/
	 */
	e.preventDefault();

	// SE OBTIENE EL ID A BUSCAR
	var id = document.getElementById("search").value;

	// SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
	var client = getXMLHttpRequest();
	client.open("POST", "./backend/read.php", true);
	client.setRequestHeader(
		"Content-Type",
		"application/x-www-form-urlencoded"
	);
	client.onreadystatechange = function () {
		// SE VALIDARICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
		if (client.readyState == 4 && client.status == 200) {
			console.log("[CLIENTE]\n" + client.responseText);

			// SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
			let productos = JSON.parse(client.responseText); // similar a eval('('+client.responseText+')');

			// SE VALIDARICA SI EL OBJETO JSON TIENE DATOS
			if (Object.keys(productos).length > 0) {
				// SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
				let descripcion = "";
				descripcion += "<li>precio: " + productos.precio + "</li>";
				descripcion += "<li>unidades: " + productos.unidades + "</li>";
				descripcion += "<li>modelo: " + productos.modelo + "</li>";
				descripcion += "<li>marca: " + productos.marca + "</li>";
				descripcion += "<li>detalles: " + productos.detalles + "</li>";

				// SE CREA UNA PLANTILLA PARA CREAR LA(S) FILA(S) A INSERTAR EN EL DOCUMENTO HTML
				let template = "";
				template += `
                        <tr>
                            <td>${productos.id}</td>
                            <td>${productos.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                        </tr>
                    `;

				// SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
				document.getElementById("productos").innerHTML = template;
			}
		}
	};
	client.send("id=" + id);
}

// FUNCIÓN CALLBACK DE BOTÓN "Agregar Producto"
function agregarProducto(e) {
	e.preventDefault();

	// SE OBTIENE DESDE EL FORMULARIO EL JSON A ENVIAR
	var productoJsonString = document.getElementById("description").value;
	// SE CONVIERTE EL JSON DE STRING A OBJETO
	var finalJSON = JSON.parse(productoJsonString);
	// SE AGREGA AL JSON EL NOMBRE DEL PRODUCTO
	finalJSON["nombre"] = document.getElementById("name").value;

	if (!validarJSON(finalJSON)) {
		return;
	}

	// SE OBTIENE EL STRING DEL JSON FINAL
	productoJsonString = JSON.stringify(finalJSON, null, 2);

	// SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
	var client = getXMLHttpRequest();
	client.open("POST", "./backend/create.php", true);
	client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	client.onreadystatechange = function () {
		// SE VALIDARICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
		if (client.readyState == 4 && client.status == 200) {
			const response = JSON.parse(client.responseText);
			if (response.status === "success") {
				alert("Producto agregado correctamente.");
			} else {
				alert("Error: " + response.message);
			}
		}
	};
	client.send(productoJsonString);
}

// SE CREA EL OBJETO DE CONEXIÓN COMPATIBLE CON EL NAVEGADOR
function getXMLHttpRequest() {
	var objetoAjax;

	try {
		objetoAjax = new XMLHttpRequest();
	} catch (err1) {
		/**
		 * NOTA: Las siguientes formas de crear el objeto ya son obsoletas
		 *       pero se comparten por motivos historico-académicos.
		 */
		try {
			// IE7 y IE8
			objetoAjax = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (err2) {
			try {
				// IE5 y IE6
				objetoAjax = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (err3) {
				objetoAjax = false;
			}
		}
	}
	return objetoAjax;
}

function init() {
	/**
	 * Convierte el JSON a string para poder mostrarlo
	 * ver: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON
	 */
	var JsonString = JSON.stringify(baseJSON, null, 2);
	document.getElementById("description").value = JsonString;
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
		validarNombre,
		validarMarca,
		validarModelo,
		validarPrecio,
		validarDetalles,
		validarUnidades,
	];
	for (let validar of validaciones) {
		if (!validar(json)) {
			return false;
		}
	}
	return true;
}
