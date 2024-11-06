<?php
    include_once __DIR__.'/database.php';
    $data = array();

    // SE VERIFICA HABER RECIBIDO EL ID
    if( isset($_POST['id']) ) {
        $id = $_POST['id'];
        // SE REALIZA LA QUERY DE BÚSQUEDA
        $sql = "select * from productos where id = {$id}";
        $result = $conexion->query($sql);
        if ($result->num_rows > 0) {
            $data = $result->fetch_assoc();
        } else {
            $data = array('error' => 'No product found with the given ID');
        }
        /*$json = array(
            'id'=> $row['id'],
            'nombre' => $row['nombre'],
            'marca'=> $row['marca'],
            'modelo'=> $row['modelo'],
            'precio'=> $row['precio'],
            'detalles'=> $row['detalles'],
            'unidades'=> $row['unidades'],
            'imagen'=> $row['imagen'],
        );*/



		$conexion->close();
    } 
    
    // SE HACE LA CONVERSIÓN DE ARRAY A JSON
    echo json_encode($data, JSON_PRETTY_PRINT);