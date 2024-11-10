<?php
require_once 'cabecera.php';
require_once 'cuerpo.php';
require_once 'pie.php';
class pagina{
    private $cabecera;
    private $cuerpo;
    private $pie;
    public function __construct($titulo, $ubicacion, $lineas, $mensaje)
    {
        $this->cabecera = new cabecera($titulo, $ubicacion);
        $this->cuerpo = new cuerpo();
        $this->pie = new pie($mensaje);
    }
    public function insertarCuerpo($linea)
    {
        $this->cuerpo->insertar_parrafo($linea);
    }
    public function graficar()
    {
        $this->cabecera->graficar();
        $this->cuerpo->graficar();
        $this->pie->graficar();
    }
}