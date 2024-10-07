<?php

try {
    require_once("connexioBD.php");

    $data = json_decode(file_get_contents('php://input'), true);
    $idP = $data['idP'];
    //Eliminar Pregunta
    $sql = "DELETE FROM preguntes WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idP);
    $stmt->execute();

    $stmt->close();

} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}
?>