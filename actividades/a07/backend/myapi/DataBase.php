<?php
/* Abstract DataBase Class 
--Debe de ser un clase abstracta
#conexion:mysqli
--Los parametros recibidos en el constructor deben usarse para configurar el acceso a la base de datos
--Su constructor debe inicializar el objeto protegido conexion con los datos de conexion de la base de datos
+DataBase(user: string, pass: string, db: string)
*/

use TECWEB\MYAPI\Productos as Products;
require_once __DIR__. '/myapi/Products.php';

$proObj = new Products('root', '1234', 'marketzone');
$prodObj->list();

echo $prodObj->getData();