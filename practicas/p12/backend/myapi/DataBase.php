<?php
namespace TECWEB\MYAPI;

abstract class DataBase {
    protected $conexion;

    public function __construct($db='marketzone', $user='root', $pass='1234') {
        $this->conexion = @mysqli_connect(
            'localhost',
            $user,
            $pass,
            $db
        );
    
        /**
         * NOTA: si la conexión falló $conexion contendrá false
         **/
        if(!$this->conexion) {
            die('¡Base de datos NO conextada!');
        }
        /*else {
            echo 'Base de datos encontrada';
        }*/
    }
}
