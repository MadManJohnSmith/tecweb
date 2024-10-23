<?php
    include('database.php');
    $id = $_POST['id'];
    $query = "SELECT * FROM products WHERE id = $id";
    $result = mysql_query($connection, $query);
    if(!$result) {
        die('Query Failed');
    }

    $json = array();
    while($row = mysql_fetch_array($result)) {
        $json[] = array(
            'name' => $row['name'],
            'description' => $row['description'],
            'id' => $row['id']
        );
    }
    $jsonstring = json_encode($json[0]);
    echo $jsonstring;
