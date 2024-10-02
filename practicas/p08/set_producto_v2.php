<?php
$nombre = isset($_POST['nombre']) ? $_POST['nombre'] : 'nombre_producto';
$marca = isset($_POST['marca_producto']) ? $_POST : 'marca_producto';
$modelo = isset($_POST['modelo_producto']) ? $_POST : 'modelo_producto';
$precio = isset($_POST['precio_producto']) ? $_POST : 'precio_producto';
$detalles = isset($_POST['detalles_producto']) ? $_POST : 'detalles_producto';
$unidades = isset($_POST['unidades_producto']) ? $_POST : 'unidades_producto';
$imagen = isset($_POST['img/imagen.png']) ? $_POST : 'img/imagen.png';

/** SE CREA EL OBJETO DE CONEXION */
@$link = new mysqli('localhost', 'root', '1234', 'maketzone');

/** comprobar la conexión */
if ($link->connect_errno) {
    die('Falló la conexión: ' . $link->connect_error . '<br/>');
    /** NOTA: con @ se suprime el Warning para gestionar el error por medio de código */
}
if(){
    /** Crear una tabla que no devuelve un conjunto de resultados */
$sql = "INSERT INTO productos VALUES (null, '{$nombre}', '{$marca}', '{$modelo}', {$precio}, '{$detalles}', {$unidades}, '{$imagen}')";
if ($link->query($sql)) {
    echo 'Producto insertado con ID: ' . $link->insert_id;
} else {
    echo 'El Producto no pudo ser insertado =(';
}
}


$link->close();
