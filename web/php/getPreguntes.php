<?php

header('Content-Type: application/json');
session_start();
include("connexioBD.php");
//$jsonData = file_get_contents('../../doc/data.json');
//$questions = json_decode($jsonData, true)['preguntes'];

$sql = "SELECT * FROM preguntes JOIN respostes ON respostes.pregunta_id = preguntes.id";
$resultPreguntes = $conn->query($sql);
var_dump($resultPreguntes);
if ($resultPreguntes->num_rows > 0) {

    while ($rowPregunta = $resultPreguntes->fetch_assoc()) {

        while ($rowResposta = $resultRespostes->fetch_assoc()) {
            if ($rowResposta['correcta'] == 1) {
                $respostaCorrecta = $rowResposta['resposta'];
            }
            $respostes[] = $rowResposta['resposta'];
        }

        $preguntes[] = [
            'pregunta' => $rowPregunta['pregunta'],
            'respostes' => $respostes,
            'resposta_correcta' => $respostaCorrecta,
        ];

    }
}


var_dump($preguntes[0]['pregunta']);

$numPreguntes = isset($_GET['numPreguntes']) ? intval($_GET['numPreguntes']) : 10;
shuffle($preguntes);
$selectedQuestions = array_slice($preguntes, 0, $numPreguntes);
$_SESSION['questions'] = $selectedQuestions;

foreach ($selectedQuestions as &$question) {
    unset($question['resposta_correcta']);
}

echo json_encode($selectedQuestions);
?>