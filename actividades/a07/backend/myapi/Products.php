<?php
/*
# Products Class
--Debe de extender de la clase DataBase
-data:string[]
Products(string, string, string)
--Su constructor debe inicializar el atributo response, y ademas usar el constructor de la SuperClase para inicializar la conexion a la BD. El parametro recibido sirve para especificar el nombre de la BD
--El constructor debe usar parametros opcionales(o por defecto)
+add(Object):void
+delete(string):void
--Debe obtener la respuesta a la query realizada a la BD y almacenarla en el atributo response que es un array.
+edit(Object):void
+list():void
--Debe obtener la respuesta a la query realizada a la BD y almacenarla en el atributo response que es un array.
+search(string):void
--Debe obtener la respuesta a la query realizada a la BD y almacenarla en el atributo response que es un array.
+single(string):void
--Debe obtener la respuesta a la query realizada a la BD y almacenarla en el atributo response que es un array.
+singleByName(string):void
--El metodo singleByName() hace una busqueda de producto usando su nombre en lugar de su id
getData():string
--El metodo getData() debe hacer la conversion de array a JSON y devolver el string resultante. Nota que cada metodo podria generar un arreglo distinto
*/
namespace TECWEB\MyApi;
use TECWEB\MYAPI;
require_once __DIR__. 'DataBase.php';

class Products extends DataBase{
    private $data;

    public function __construct($user, $pass, $db){
        $this->data = array();
        parent::__construct($user, $pass, $db);
    }
    public function add($jsonOBJ){

    }
    public function delete($id){

    }
    public function edit($jsonOBJ){

    }
    public function list(){

    }
    public function search($name){

    }
    public function single($id){

    }
    public function singleByName($name){
        
    }
    public function getData(){
        return json_encode($this->data);
    }
}