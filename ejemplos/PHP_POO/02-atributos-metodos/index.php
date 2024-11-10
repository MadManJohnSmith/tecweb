<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
    require_once __DIR__ . '/menu.php';

    $menu = new Menu();
    $menu->cargarOpcion('https://www.facebook.com','Facebook');
    $menu->cargarOpcion('https://www.instagram.com','Instagram');
    $menu->cargarOpcion('https://www.outlook.com','Outlook');
    $menu->mostrar();   
    ?>
</body>
</html>