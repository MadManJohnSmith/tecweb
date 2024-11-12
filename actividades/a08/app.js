// JSON BASE A MOSTRAR EN FORMULARIO
var baseJSON = {
    "precio": 0.0,
    "unidades": 1,
    "modelo": "XX-000",
    "marca": "NA",
    "detalles": "NA",
    "imagen": "img/default.png"
  };

$(document).ready(function(){
    let edit = false;

    let JsonString = JSON.stringify(baseJSON,null,2);
    $('#description').val(JsonString);
    $('#product-result').hide();
    listarProductos();

    function listarProductos() {
        $.ajax({
            url: './backend/product-list.php',
            type: 'GET',
            success: function(response) {
                console.log(response);
                // SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
                const productos = JSON.parse(response);
            
                // SE VERIFICA SI EL OBJETO JSON TIENE DATOS
                if(Object.keys(productos).length > 0) {
                    // SE CREA UNA PLANTILLA PARA CREAR LAS FILAS A INSERTAR EN EL DOCUMENTO HTML
                    let template = '';

                    productos.forEach(producto => {
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
                    // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                    $('#products').html(template);
                }
            }
        });
    }

    $('#search').keyup(function() {
        if($('#search').val()) {
            let search = $('#search').val();
            $.ajax({
                url: './backend/product-search.php?search='+$('#search').val(),
                data: {search},
                type: 'GET',
                success: function (response) {
                    if(!response.error) {
                        // SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
                        const productos = JSON.parse(response);
                        
                        // SE VERIFICA SI EL OBJETO JSON TIENE DATOS
                        if(Object.keys(productos).length > 0) {
                            // SE CREA UNA PLANTILLA PARA CREAR LAS FILAS A INSERTAR EN EL DOCUMENTO HTML
                            let template = '';
                            let template_bar = '';

                            productos.forEach(producto => {
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
                                        <td><a href="#" class="product-item">${producto.nombre}</a></td>
                                        <td><ul>${descripcion}</ul></td>
                                        <td>
                                            <button class="product-delete btn btn-danger">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                `;

                                template_bar += `
                                    <li>${producto.nombre}</il>
                                `;
                            });
                            // SE HACE VISIBLE LA BARRA DE ESTADO
                            $('#product-result').show();
                            // SE INSERTA LA PLANTILLA PARA LA BARRA DE ESTADO
                            $('#container').html(template_bar);
                            // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                            $('#products').html(template);    
                        }
                    }
                }
            });
        }
        else {
            $('#product-result').hide();
        }
    });

    $('#product-form').submit(e => {
        e.preventDefault();

        // SE CONVIERTE EL JSON DE STRING A OBJETO
        let postData = JSON.parse( $('#description').val() );
        // SE AGREGA AL JSON EL NOMBRE DEL PRODUCTO
        postData['nombre'] = $('#name').val();
        postData['id'] = $('#productId').val();


        if (!validarJSON(postData)) {
            return;
        }

        const url = edit === false ? './backend/product-add.php' : './backend/product-edit.php';
        
        $.post(url, postData, (response) => {
            console.log(response);
            // SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
            let respuesta = JSON.parse(response);
            // SE CREA UNA PLANTILLA PARA CREAR INFORMACIÓN DE LA BARRA DE ESTADO
            let template_bar = '';
            template_bar += `
                        <li style="list-style: none;">status: ${respuesta.status}</li>
                        <li style="list-style: none;">message: ${respuesta.message}</li>
                    `;
            // SE REINICIA EL FORMULARIO
            $('#name').val('');
            $('#description').val(JsonString);
            // SE HACE VISIBLE LA BARRA DE ESTADO
            $('#product-result').show();
            // SE INSERTA LA PLANTILLA PARA LA BARRA DE ESTADO
            $('#container').html(template_bar);
            // SE LISTAN TODOS LOS PRODUCTOS
            listarProductos();
            // SE REGRESA LA BANDERA DE EDICIÓN A false
            edit = false;
        });
    });

    $(document).on('click', '.product-delete', (e) => {
        if(confirm('¿Realmente deseas eliminar el producto?')) {
            const element = $(this)[0].activeElement.parentElement.parentElement;
            const id = $(element).attr('productId');
            $.post('./backend/product-delete.php', {id}, (response) => {
                $('#product-result').hide();
                listarProductos();
            });
        }
    });

    $(document).on('click', '.product-item', (e) => {
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(element).attr('productId');
        $.post('./backend/product-single.php', {id}, (response) => {
            // SE CONVIERTE A OBJETO EL JSON OBTENIDO
            let product = JSON.parse(response);
            // SE INSERTAN LOS DATOS ESPECIALES EN LOS CAMPOS CORRESPONDIENTES
            $('#name').val(product.nombre);
            // EL ID SE INSERTA EN UN CAMPO OCULTO PARA USARLO DESPUÉS PARA LA ACTUALIZACIÓN
            $('#productId').val(product.id);
            // SE ELIMINA nombre, eliminado E id PARA PODER MOSTRAR EL JSON EN EL <textarea>
            delete(product.nombre);
            delete(product.eliminado);
            delete(product.id);
            // SE CONVIERTE EL OBJETO JSON EN STRING
            let JsonString = JSON.stringify(product,null,2);
            // SE MUESTRA STRING EN EL <textarea>
            $('#description').val(JsonString);
            
            // SE PONE LA BANDERA DE EDICIÓN EN true
            edit = true;
        });
        e.preventDefault();
    });    
});
function requerido(x, y) {
	const element = document.getElementById(x);
    const elError = document.getElementById(y);
	if (element.value.length < 1) {
		elError.removeAttribute("hidden");
		elError.innerHTML = "El campo es obligatorio.";
		return false;
	}
	elError.setAttribute("hidden", true);
	return true;
}
function largo(x, y, largo) {
	const element = document.getElementById(x);
    const elError = document.getElementById(y);
	if (element.value.length > largo) {
		elError.removeAttribute("hidden");
		elError.innerHTML =
			"No debe superar los " + largo + " caracteres.";
		return false;
	}
	elError.setAttribute("hidden", true);
	return true;
}
function validarNombre(x, y, maximo) {
    if (requerido(x, y) && largo(x, y, maximo)) {
        return true;
    }
    return false;
}
function alpha(x, y) {
    const element = document.getElementById(x);
    const pattern = /^[a-zA-Z0-9\s]+$/;
    if (!pattern.test(element.value)&& element.value.length > 0) {
        document.getElementById(y).removeAttribute("hidden");
        document.getElementById(y).innerHTML = "Solo se permiten caracteres alfanuméricos.";
        return false;
    }
    document.getElementById(y).setAttribute("hidden", true);
    return true;
}
function validarModelo(x, y, maximo) {
    if (requerido(x, y) && largo(x, y, maximo) && alpha(x, y)) {
        return true;
    }
    return false;

}
function valor(x, y, min) {
    const element = document.getElementById(x);
    if (parseFloat(element.value) < min) {
        document.getElementById(y).removeAttribute("hidden");
        document.getElementById(y).innerHTML = "El valor debe ser mayor a " + min + ".";
        return false;
    }
    document.getElementById(y).setAttribute("hidden", true);
}
function validarPrecio(x, y, min) {
    if (requerido(x, y) && valor(x, y, min)) {
        return true;
    }
    return false;
}
function validarUnidades(x, y, min){
    if(requerido(x, y) && valor(x, y, min)){
        return true;
    }
    return false;
}
function defImg(imgPath) {
    const defaultPath = "img/default.jpeg";
    return imgPath && imgPath.trim() !== "" ? imgPath : defaultPath;
}
function validarMarca(x, y) {
    const element = document.getElementById(x);
    const elError = document.getElementById(y);

    if (element.value === "Def") {
        elError.removeAttribute("hidden");
        elError.innerHTML = "Debe seleccionar una marca.";
        return false;
    }
    elError.setAttribute("hidden", true);
    return true;
}

function validarFormulario() {
    let esValido = true;
    esValido = validarNombre('form-name', 'error-nombre', 100) && esValido;
    esValido = validarModelo('form-model', 'error-modelo', 25) && esValido;
    esValido = validarPrecio('form-price', 'error-precio', 99.99) && esValido;
    esValido = validarUnidades('form-units', 'error-unidades', 0) && esValido;
    esValido = validarMarca('marca1', 'error-marca') && esValido;
    const formImg = document.getElementById('form-img');
    const hiddenImg = document.getElementById('imagen_predeterminada');
    if (!formImg.value) {
        hiddenImg.value = defImg("");
    }
    return esValido;
}