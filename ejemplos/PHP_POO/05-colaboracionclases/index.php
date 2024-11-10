<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    require_once 'pagina.php';
    $pagina = new pagina('Título de la página', 'left', 5, 'Pie de la página');
    $pagina->insertarCuerpo('Línea 1');

</body>
</html>