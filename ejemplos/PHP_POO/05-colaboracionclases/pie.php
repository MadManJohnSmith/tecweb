<?php
class pie{
    private $mensaje;
    public function __construct($msj)
    {
        $this->mensaje = $msj;
    }

    public function graficar(){
        $estilo = 'text-align:center';
        echo "<div style='" . $estilo . "'>";
        echo "<h4>" . $this->mensaje . "</h4>";
        echo "</div>";
    }
}