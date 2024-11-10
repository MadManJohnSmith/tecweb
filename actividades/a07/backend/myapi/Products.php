<?php
namespace TECWEB\MYAPI;
use TECWEB\MYAPI\DataBase;
require_once __DIR__ . '/DataBase.php';

class Products extends DataBase
{
    private $data;

    public function __construct($db, $user = 'root', $pass = '1234')
    {
        $this->data = array();
        parent::__construct($db, $user, $pass);
    }

    public function add($jsonOBJ)
    {
        $this->data = array(
            'status' => 'error',
            'message' => 'Ya existe un producto con ese nombre'
        );
        if (isset($jsonOBJ->nombre)) {
            $sql = "SELECT * FROM productos WHERE nombre = '{$jsonOBJ->nombre}' AND eliminado = 0";
            $result = $this->conexion->query($sql);

            if ($result->num_rows == 0) {
                $this->conexion->set_charset("utf8");
                $sql = "INSERT INTO productos VALUES (null, '{$jsonOBJ->nombre}', '{$jsonOBJ->marca}', '{$jsonOBJ->modelo}', {$jsonOBJ->precio}, '{$jsonOBJ->detalles}', {$jsonOBJ->unidades}, '{$jsonOBJ->imagen}', 0)";
                if ($this->conexion->query($sql)) {
                    $this->data['status'] = "success";
                    $this->data['message'] = "Producto agregado";
                } else {
                    $this->data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
                }
            }

            $result->free();
            $this->conexion->close();
        }
    }

    public function delete($id)
    {
        $this->data = array(
            'status' => 'error',
            'message' => 'La consulta falló'
        );
        if (isset($id)) {
            $sql = "UPDATE productos SET eliminado=1 WHERE id = {$id}";
            if ($this->conexion->query($sql)) {
                $this->data['status'] = "success";
                $this->data['message'] = "Producto eliminado";
            } else {
                $this->data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
            }
            $this->conexion->close();
        }
    }

    public function edit($jsonOBJ)
    {
        $this->data = array(
            'status' => 'error',
            'message' => 'La consulta falló'
        );
        if (isset($jsonOBJ->id)) {
            $sql = "UPDATE productos SET nombre='{$jsonOBJ->nombre}', marca='{$jsonOBJ->marca}',";
            $sql .= "modelo='{$jsonOBJ->modelo}', precio={$jsonOBJ->precio}, detalles='{$jsonOBJ->detalles}',";
            $sql .= "unidades={$jsonOBJ->unidades}, imagen='{$jsonOBJ->imagen}' WHERE id={$jsonOBJ->id}";
            $this->conexion->set_charset("utf8");
            if ($this->conexion->query($sql)) {
                $this->data['status'] = "success";
                $this->data['message'] = "Producto actualizado";
            } else {
                $this->data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
            }
            $this->conexion->close();
        }
    }

    public function list()
    {
        if ($result = $this->conexion->query("SELECT * FROM productos WHERE eliminado = 0")) {
            // SE OBTIENEN LOS RESULTADOS
            $rows = $result->fetch_all(MYSQLI_ASSOC);

            if (!is_null($rows)) {
                foreach ($rows as $num => $row) {
                    foreach ($row as $key => $value) {
                        $this->data[$num][$key] = $value;
                    }
                }
            }
            $result->free();
        } else {
            die('Query Error: ' . mysqli_error($this->conexion));
        }
        $this->conexion->close();
    }

    public function search($search)
    {
        if (isset($search)) {
            $sql = "SELECT * FROM productos WHERE (id = '{$search}' OR nombre LIKE '%{$search}%' OR marca LIKE '%{$search}%' OR detalles LIKE '%{$search}%') AND eliminado = 0";
            if ($result = $this->conexion->query($sql)) {
                $rows = $result->fetch_all(MYSQLI_ASSOC);

                if (!is_null($rows)) {
                    foreach ($rows as $num => $row) {
                        foreach ($row as $key => $value) {
                            $this->data[$num][$key] = $value;
                        }
                    }
                }
                $result->free();
            } else {
                die('Query Error: ' . mysqli_error($this->conexion));
            }
            $this->conexion->close();
        }
    }

    public function single($id)
    {
        if (isset($id)) {
            if ($result = $this->conexion->query("SELECT * FROM productos WHERE id = {$id}")) {
                $row = $result->fetch_assoc();

                if (!is_null($row)) {
                    foreach ($row as $key => $value) {
                        $this->data[$key] = $value;
                    }
                }
                $result->free();
            } else {
                die('Query Error: ' . mysqli_error($this->conexion));
            }
            $this->conexion->close();
        }
    }

    public function singleByName($name)
    {
        $name = $_POST['name'];

        $query = "SELECT * FROM productos WHERE nombre = {$name}";
        $result = mysqli_query($this->conexion, $query);

        if ($this->conexion->query($query)) {
            while ($row = mysqli_fetch_array($result)) {
                $this->data = array(
                    'id' => $row['id'],
                    'nombre' => $row['nombre'],
                    'precio' => $row['precio'],
                    'unidades' => $row['unidades'],
                    'modelo' => $row['modelo'],
                    'marca' => $row['marca'],
                    'detalles' => $row['detalles'],
                    'imagen' => $row['imagen']
                );
            }
        } else {
            die('Query Error: ' . mysqli_error($this->conexion));
        }
    }

    public function getData()
    {
        return json_encode($this->data, JSON_PRETTY_PRINT);
    }
}
