<?php


try {
    require_once("connexioBD.php");

    $json = file_get_contents('../../doc/data.json');
    $data = json_decode($json, true);

    foreach ($data['preguntes'] as $pregunta) {
        $stmtPregunta = $conn->prepare("INSERT INTO preguntes (pregunta, imatge) VALUES (?, ?)");
        $stmtPregunta->bind_param("ss", $pregunta['pregunta'], $pregunta['imatge']);

        if ($stmtPregunta->execute()) {
            // Obtenir l'ID de la pregunta que s'acaba d'inserir
            $pregunta_id = $stmtPregunta->insert_id;

            $stmtResposta = $conn->prepare("INSERT INTO respostes (pregunta_id, resposta, correcta) VALUES (?, ?, ?)");
            $correcta = 1;
            $stmtResposta->bind_param("isi", $pregunta_id, $pregunta['resposta_correcta'], $correcta);
            $stmtResposta->execute();

            $correcta = 0;
            foreach ($pregunta['respostes_incorrectes'] as $resposta_incorrecta) {
                $stmtResposta->bind_param("isi", $pregunta_id, $resposta_incorrecta, $correcta);
                $stmtResposta->execute();
            }
        } else {
            echo "Error inserint la pregunta: " . $pregunta['pregunta'] . "<br>";
        }

        $stmtPregunta->close();
        $stmtResposta->close();

    }



} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}

