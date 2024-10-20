<?php
    include_once __DIR__.'/database.php';

    // SE OBTIENE LA INFORMACIÓN DEL PRODUCTO ENVIADA POR EL CLIENTE
    $producto = file_get_contents('php://input');
    if(!empty($producto)) {
        // SE TRANSFORMA EL STRING DEL JASON A OBJETO
        $jsonOBJ = json_decode($producto);

        $query = "SELECT COUNT(*) as total FROM productos WHERE nombre = ? AND eliminado = 0";
        $stmt = $conexion->prepare($query);
        $stmt->bind_param('s', $jsonOBJ->nombre);
        $stmt->execute();
        $resultado = $stmt->get_result()->fetch_assoc();

        if($resultado['total'] > 0) {
            // Si ya existe, devolver mensaje de error
            echo json_encode(['status' => 'error', 'message' => 'Producto ya existe']);
        } else {
            // Si no existe, insertar nuevo producto
            $insertQuery = "INSERT INTO productos (nombre, marca, modelo, precio, detalles, unidades, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conexion->prepare($insertQuery);
            $stmt->bind_param('sssdsis', 
                $jsonOBJ->nombre,
                $jsonOBJ->marca,
                $jsonOBJ->modelo,
                $jsonOBJ->precio,
                $jsonOBJ->detalles,
                $jsonOBJ->unidades,
                $jsonOBJ->imagen
            );

            if($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Producto insertado con éxito']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error al insertar producto']);
            }
        }
        //echo '[SERVIDOR] Nombre: '.$jsonOBJ->nombre;
    }
