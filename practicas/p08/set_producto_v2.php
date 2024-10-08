<?php
$nombre = isset($_POST['nombre']) ? $_POST['nombre'] : 'nombre_producto';
$marca = isset($_POST['marca']) ? $_POST['marca'] : 'marca_producto';
$modelo = isset($_POST['modelo']) ? $_POST['modelo'] : 'modelo_producto';
$precio = isset($_POST['precio']) ? $_POST['precio'] : 1.0;
$detalles = isset($_POST['detalles']) ? $_POST['detalles'] : 'detalles_producto';
$unidades = isset($_POST['unidades']) ? $_POST['unidades'] : 1;

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $imagen_tmp = $_FILES['imagen']['tmp_name'];
    $ruta_rel = "img/{$modelo}." . pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $imagen_destino = "C:\\xampp\\htdocs\\tecweb\\practicas\\p07\\img\\{$modelo}." . pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);

    if (move_uploaded_file($imagen_tmp, $imagen_destino)) {
        echo 'Imagen subida con éxito a: ' . $imagen_destino;
    } else {
        echo 'Error al mover la imagen subida.';
    }
} else {
    echo 'Error al subir la imagen: ' . $_FILES['imagen']['error'];
}

/** SE CREA EL OBJETO DE CONEXION */
@$link = new mysqli('localhost', 'root', '1234', 'marketzone');

/** comprobar la conexión */
if ($link->connect_errno) {
    die('Falló la conexión: ' . $link->connect_error . '<br/>');
    /** NOTA: con @ se suprime el Warning para gestionar el error por medio de código */
}
/** Reiniciar el AUTO_INCREMENT del ID de la tabla productos */
$link->query("ALTER TABLE productos AUTO_INCREMENT = 1");

// Verificar si ya existe un producto con el mismo nombre, marca y modelo
$check_sql = "SELECT * FROM productos WHERE nombre = '{$nombre}' AND marca = '{$marca}' AND modelo = '{$modelo}'";
$result = $link->query($check_sql);

if ($result->num_rows > 0) {
    // Si ya existe, mostrar un mensaje de error
    echo "<br/>Error: Ya existe un producto con el mismo nombre, marca y modelo.";
} else {
    /** Crear una tabla que no devuelve un conjunto de resultados */
    //$sql = "INSERT INTO productos VALUES (null, '{$nombre}', '{$marca}', '{$modelo}', {$precio}, '{$detalles}', {$unidades}, '{$ruta_rel}', 0)";
    $sql = "INSERT INTO productos (nombre, marca, modelo, precio, detalles, unidades, imagen) 
        VALUES ('{$nombre}', '{$marca}', '{$modelo}', {$precio}, '{$detalles}', {$unidades}, '{$ruta_rel}')";
    if ($link->query($sql)) {
        echo '<br/>Producto insertado con ID: ' . $link->insert_id;
        echo "<br/>Nombre: {$nombre}<br/>";
        echo "Marca: {$marca}<br/>";
        echo "Modelo: {$modelo}<br/>";
        echo "Precio: {$precio}<br/>";
        echo "Detalles: {$detalles}<br/>";
        echo "Unidades: {$unidades}<br/>";
        $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
        $nombre_imagen = "{$modelo}.{$extension}";
        // Mostrar la imagen con el estilo especificado
        echo "Imagen: <br/><img src='http://localhost:8080/tecweb/practicas/p07/img/{$nombre_imagen}' style='max-width: 31.25rem;' />";


    } else {
        echo 'El Producto no pudo ser insertado =(';
    }
}

$link->close();
