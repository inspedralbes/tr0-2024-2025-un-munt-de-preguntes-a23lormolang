<?php
$servername = "localhost";
$database = "jocPreguntes";
$username = "lorenzo";
$password = "pirineus";

try {
    $conn = new mysqli($servername, $username, $password, $database);

    $json = file_get_contents('../../doc/data.json');
    $data = json_decode($json, true);

    //Comprovaciones tablas create

    $sql = "CREATE TABLE IF NOT EXISTS preguntes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pregunta VARCHAR(255) NOT NULL,
        resposta_correcta VARCHAR(255) NOT NULL,
        imatge VARCHAR(255) DEFAULT NULL
    )";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    //Cargar bd

    $sql = "INSERT INTO preguntes (pregunta, resposta_correcta, imatge) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($data['preguntes'] as $pregunta) {
        $stmt->bind_param(
            "sis",  // Tipos de datos: string, int
            $pregunta['pregunta'],
            $pregunta['resposta_correcta'],
            $pregunta['imatge']
        );
        if (!$stmt->execute()) {
            echo "Error en la inserció: " . $stmt->error . "<br>";
        }
    }

    echo "Connected to $dbname at $host successfully.";

} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}

