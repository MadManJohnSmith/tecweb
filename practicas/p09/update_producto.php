<?php
/* MySQL Conexion*/
$link = mysqli_connect("localhost", "root", "1234", "marketzone");
// Chequea coneccion
if ($link === false) {
    die("ERROR: No pudo conectarse con la DB. " . mysqli_connect_error());
}
//Ejecuta la actualizacion del registro
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']);
    $nombre = mysqli_real_escape_string($link, $_POST['nombre']);
    $marca = mysqli_real_escape_string($link, $_POST['marca']);
    $modelo = mysqli_real_escape_string($link, $_POST['modelo']);
    $precio = floatval($_POST['precio']);
    $unidades = intval($_POST['unidades']);
    $detalles = mysqli_real_escape_string($link, $_POST['detalles']);
    $tope = isset($_POST['tope']) ? intval($_POST['tope']) : 0;  //Recibe el valor del tope


    $sql = "UPDATE productos 
            SET nombre='$nombre', marca='$marca', modelo='$modelo', precio='$precio', unidades='$unidades', detalles='$detalles' 
            WHERE id=$id";
    if (mysqli_query($link, $sql)) {
        echo "Producto actualizado correctamente.";
        //Aqui regreso al formulario porque get_productos.php no imprime ya datos para evitar duplicidad de tablas
        echo "</br></br><a href='formulario_productos_v2.php?tope=$tope'>Regresar a Productos</a><br>";
    } else {
        echo "ERROR: No se pudo ejecutar la actualización. " . mysqli_error($link);
        echo "</br></br><a href='formulario_productos_v2.php?tope=$tope'>Regresar a Productos</a><br>";
    }
} else {
    echo "ERROR: Datos incompletos o solicitud inválida.";
    echo "</br></br><a href='formulario_productos_v2.php?tope=$tope'>Regresar a Productos</a><br>";
}
// Cierra la conexion
mysqli_close($link);