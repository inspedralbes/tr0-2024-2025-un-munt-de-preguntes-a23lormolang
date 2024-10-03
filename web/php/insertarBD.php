<?php

try {
    include("connexioBD.php");

    $insertar = json_decode(file_get_contents('php://input'), true);


    //Insertar Pregunta
    $sql = "INSERT INTO preguntes (pregunta, imatge) VALUES (?, ?)";
    $stmt = $conn->prepare("INSERT INTO preguntes (pregunta, imatge) VALUES (?, ?)");
    $stmt->bind_param("ss", $insertar['Pregunta'], $insertar['Imatge']);
    $stmt->execute();
    $pregunta_id = $stmt->insert_id;
    for ($i = 1; $i < 5; $i++) {
        $correcta = 0;
        $stmtResposta = $conn->prepare("INSERT INTO respostes (pregunta_id, resposta, correcta) VALUES (?, ?, ?)");
        if($i == $insertar['RespostaC']){
            $correcta = 1;
        }
        $stmtResposta->bind_param("isi", $pregunta_id, $insertar['Resposta' . $i], $correcta);
        $stmtResposta->execute();
    }

    $stmt->close();
    $stmtResposta->close();

} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}
?>