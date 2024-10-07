<?php

header('Content-Type: application/json');
session_start();
include("connexioBD.php");

$sql = "SELECT * FROM preguntes";
$resultPreguntes = $conn->query($sql);

if ($resultPreguntes->num_rows > 0) {
    $preguntes = [];
    while ($rowPregunta = $resultPreguntes->fetch_assoc()) {
        $sql = "SELECT * FROM respostes WHERE pregunta_id = ?";
        $stmtRespostes = $conn->prepare($sql);
        $stmtRespostes->bind_param("i", $rowPregunta['id']);
        $stmtRespostes->execute();
        $resultRespostes = $stmtRespostes->get_result();

        $respostes = [];
        $respostaCorrecta = null;
        while ($rowResposta = $resultRespostes->fetch_assoc()) {

            if ($rowResposta['correcta'] == 1) {
                $respostaCorrecta = $rowResposta['resposta'];
            }
            $respostes[] = [
                'id' => $rowResposta['id'],
                'resposta' => $rowResposta['resposta'],
            ];
        }
        $preguntes[] = [
            'id' => $rowPregunta['id'],
            'pregunta' => $rowPregunta['pregunta'],
            'respostes' => $respostes,
            'resposta_correcta' => $respostaCorrecta,
            'imatge' => $rowPregunta['imatge'],
        ];
    }
}

echo json_encode($preguntes);
?>