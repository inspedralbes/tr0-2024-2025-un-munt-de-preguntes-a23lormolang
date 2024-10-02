<?php

try {
    include("connexioBD.php");

    $insertar = $_GET['pregunta'];
    var_dump($insertar);

    //Insertar Pregunta
    $sql = "INSERT INTO preguntes (pregunta, imatge) VALUES (?, ?)";
    $stmt = $conn->prepare("INSERT INTO preguntes (pregunta, imatge) VALUES (?, ?)");
    $stmt->bind_param("ss", $insertar['pregunta'], $insertar['imatge']);
    $stmt->execute();
    $pregunta_id = $stmt->insert_id;
    for ($i = 0; $i < 4; $i++) {
        $correcta = 0;
        $stmtResposta = $conn->prepare("INSERT INTO respostes (pregunta_id, resposta, correcta) VALUES (?, ?, ?)");
        if($i == $insertar['RespostaC']-1){
            $correcta = 1;
        }
        $stmtResposta->bind_param("isi", $pregunta_id, $insertar[`Resosta$i`], $correcta);
        $stmtResposta->execute();
    }

    $stmt->close();
    $stmtResposta->close();

} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}
?>