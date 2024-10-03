<?php

try {
    include("connexioBD.php");

    $editar = json_decode(file_get_contents('php://input'), true);
    
    //Insertar Pregunta
    $stmt = $conn->prepare("UPDATE preguntes SET pregunta = ?, imatge = ? WHERE id = ?");
    $stmt->bind_param("ssi", $editar['Pregunta'], $editar['Imatge'], $editar['id']);
    $stmt->execute();
    $pregunta_id = $editar['id'];
    for ($i = 1; $i < 5; $i++) {
        $correcta = 0;
        $stmtResposta = $conn->prepare("UPDATE respostes SET pregunta_id = ?, resposta = ?, correcta = ? WHERE id = ?");
        if($i == $editar['RespostaC']){
            $correcta = 1;
        }
        $stmtResposta->bind_param("isii", $pregunta_id, $editar['Resposta' . $i], $correcta, $editar['idR' . $i]);
        $stmtResposta->execute();
    }

    $stmt->close();
    $stmtResposta->close();

} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}
?>