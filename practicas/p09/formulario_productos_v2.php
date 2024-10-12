<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="validacion.js"></script>
    <style>
        .error {
            color: red;
            font-weight: bold;
        }
    </style>
</head>

<body>
    <h1>Ingresar nuevo Producto</h1>

    <form id="formulario_productos" action="http://localhost:8080/tecweb/practicas/p09/set_producto_v2.php"
        method="post" enctype="multipart/form-data" onsubmit="return validarFormulario();">

        <h2>Datos del Producto</h2>

        <fieldset>
            <legend>Datos</legend>
            <ul>
                <li><label>Nombre:</label> <input type="text" name="nombre" id="form-name"
                        oninput="validarNombre('form-name', 'error-nombre', 100)"></li>
                <p class="error" id="error-nombre" hidden></p>
                <li><label>Marca: </label>
                    <select name="marca" id="marca1">
                        <option value="Def">Seleccione:</option>
                        <option value="Xiaomi">CISCO</option>
                        <option value="Samsung">LINKSYS</option>
                        <option value="Apple">TP_LINK</option>
                        <option value="Sony">ASUS</option>
                    </select>
                </li>
                <p class="error" id="error-marca" hidden></p>
                <li><label>Modelo:</label> <input type="text" name="modelo" id="form-model"
                        oninput="validarModelo('form-model', 'error-modelo', 25)"></li>
                <p class="error" id="error-modelo" hidden></p>
                <li><label>Precio: $</label> <input type="number" name="precio" id="form-price"
                        oninput="validarPrecio('form-price', 'error-precio', 99.99)"></li>
                <p class="error" id="error-precio" hidden></p>
                <li><label>Detalles:</label> <input type="text" name="detalles" id="form-details"
                        onchange="largo('form-details', 'error-detalles', 250)"></li>
                <p class="error" id="error-detalles" hidden></p>
                <li><label>Unidades:</label> <input type="number" name="unidades" id="form-units"
                        oninput="validarUnidades('form-units', 'error-unidades', 0)"></li>
                <p class="error" id="error-unidades" hidden></p>
                <li><label>Imagen:</label> <input type="file" name="imagen" id="form-img"
                        accept="image/png, image/jpeg"></li>
                <input type="hidden" name="imagen_predeterminada" id="imagen_predeterminada" value="img/default.jpeg">

            </ul>
        </fieldset>
        <input type="submit" id="submit" value="Ingresar a BD">
    </form>
    <h1>Consulta y Edición de Productos</h1>

    <form id="busquedaTope" action="" method="get">
        <fieldset>
            <legend>Busqueda por unidades:</legend>
            <ul>
                <li>
                    <label>Tope de Unidades:</label>
                    <input type="text" name="tope"
                        value="<?= isset($_GET['tope']) ? htmlspecialchars($_GET['tope']) : '' ?>" required>
                </li>
            </ul>
        </fieldset>
        <p>
            <input type="submit" value="Consultar">
        </p>
    </form>
    <?php
    if (isset($_GET['tope']) && is_numeric($_GET['tope'])) {
        $tope = intval($_GET['tope']);
        include 'get_productos_xhtml_v2.php';

        function mostrar_productos($productos, $titulo)
        {
            echo "<h4>$titulo</h4>";
            if (!empty($productos)) {
                echo "<table border='1'>
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Precio</th>
                            <th>Unidades</th>
                            <th>Detalles</th>
                            <th>Imagen</th>
                            <th>Acción</th>
                        </tr>";
                foreach ($productos as $producto) {

                    echo "<tr>
                            <td>{$producto['id']}</td>
                            <td>{$producto['nombre']}</td>
                            <td>{$producto['marca']}</td>
                            <td>{$producto['modelo']}</td>
                            <td>{$producto['precio']}</td>
                            <td>{$producto['unidades']}</td>
                            <td>{$producto['detalles']}</td>
                            <td><img src='http://localhost:8080/tecweb/practicas/p07/{$producto['imagen']}' style='max-width: 31.25rem;'></td>
                            <td>
                                <form action='' method='post'>
                                    <input type='hidden' name='edit_id' value='{$producto['id']}'>
                                    <input type='submit' name='editar' value='Editar'>
                                </form>
                            </td>
                          </tr>";
                }
                echo "</table>";
            } else {
                echo "<p>No se encontraron productos.</p>";
            }
        }
        mostrar_productos($row, "Todos los Productos");
    }
    // Verificar edicion
    if (isset($_POST['editar']) && isset($_POST['edit_id'])) {
        $id_producto = intval($_POST['edit_id']);
        $tope = isset($_GET['tope']) ? intval($_GET['tope']) : 0;//Para que se envie el valor de tope en update_producto.php
    
        @$link = new mysqli('localhost', 'root', '1234', 'marketzone');
        if ($link->connect_errno) {
            die('Falló la conexión: ' . $link->connect_error);
        }
        $consulta = "SELECT * FROM productos WHERE id = $id_producto";
        if ($result = $link->query($consulta)) {
            $producto_editar = $result->fetch_assoc();
            $result->free();
        }
        $link->close();

        //formulario de edicion
        if ($producto_editar) {
            ?>
            <h3>Editar Producto</h3>
            <form action="update_producto.php" method="post">
                <input type="hidden" name="tope" value="<?= $tope ?>"> <!--tope -->
                <input type="hidden" name="id" value="<?= $producto_editar['id'] ?>">
                <label>Nombre: <input type="text" name="nombre"
                        value="<?= htmlspecialchars($producto_editar['nombre']) ?>"></label><br>
                <label>Marca: <input type="text" name="marca"
                        value="<?= htmlspecialchars($producto_editar['marca']) ?>"></label><br>
                <label>Modelo: <input type="text" name="modelo"
                        value="<?= htmlspecialchars($producto_editar['modelo']) ?>"></label><br>
                <label>Precio: <input type="text" name="precio"
                        value="<?= htmlspecialchars($producto_editar['precio']) ?>"></label><br>
                <label>Unidades: <input type="text" name="unidades"
                        value="<?= htmlspecialchars($producto_editar['unidades']) ?>"></label><br>
                <label>Detalles: <input type="text" name="detalles"
                        value="<?= htmlspecialchars($producto_editar['detalles']) ?>"></label><br>
                <p>
                    <input type="submit" value="Guardar Cambios">
                </p>
            </form>
            <?php
        } else {
            echo "<p>No se encontró el producto.</p>";
        }
    }
    ?>
    <script>
        window.onload = function () {
            window.scrollTo(0, document.body.scrollHeight);
        };
    </script>
</body>

</html>