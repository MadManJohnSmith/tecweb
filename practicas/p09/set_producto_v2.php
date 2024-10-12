<?php
$nombre = isset($_POST['nombre']) ? $_POST['nombre'] : 'nombre_producto';
$marca = isset($_POST['marca']) ? $_POST['marca'] : 'marca_producto';
$modelo = isset($_POST['modelo']) ? $_POST['modelo'] : 'modelo_producto';
$precio = isset($_POST['precio']) ? $_POST['precio'] : 1.0;
$detalles = isset($_POST['detalles']) ? $_POST['detalles'] : 'detalles_producto';
$unidades = isset($_POST['unidades']) ? $_POST['unidades'] : 1;

// Obtener la ruta de la imagen predeterminada desde el formulario
$ruta_rel = isset($_POST['imagen_predeterminada']) ? $_POST['imagen_predeterminada'] : 'img/default.jpeg';

// Verificar si se ha subido una imagen
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $imagen_tmp = $_FILES['imagen']['tmp_name'];
    $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $ruta_rel = "img/{$modelo}.{$extension}";
    $imagen_destino = "C:\\xampp\\htdocs\\tecweb\\practicas\\p07\\img\\{$modelo}.{$extension}";

    if (move_uploaded_file($imagen_tmp, $imagen_destino)) {
        echo 'Imagen subida con éxito a: ' . $imagen_destino;
    } else {
        echo 'Error al mover la imagen subida.';
    }
} else {
    echo 'No se subió ninguna imagen. Se utilizará la imagen por defecto.';
}

// Conexión a la base de datos
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
    echo "</br></br><a href='formulario_productos_v2.php'>Regresar a Productos</a><br>";
} else {
    // Insertar el nuevo producto en la base de datos
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

        // Mostrar la imagen (sea la subida o la predeterminada)
        $nombre_imagen = basename($ruta_rel);
        echo "Imagen: <br/><img src='http://localhost:8080/tecweb/practicas/p07/{$ruta_rel}' style='max-width: 31.25rem;' />";
        echo "</br></br><a href='formulario_productos_v2.php'>Regresar a Productos</a><br>";
    } else {
        echo 'El Producto no pudo ser insertado =(';
        echo "</br></br><a href='formulario_productos_v2.php'>Regresar a Productos</a><br>";
    }
}

// Cerrar la conexión
$link->close();
