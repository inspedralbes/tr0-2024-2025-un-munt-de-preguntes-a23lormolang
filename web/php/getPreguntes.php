<?php

header('Content-Type: application/json');
session_start();
include("connexioBD.php");
//$jsonData = file_get_contents('../../doc/data.json');
//$questions = json_decode($jsonData, true)['preguntes'];

$sql = "SELECT * FROM preguntes";
$resultPreguntes = $conn->query($sql);

if ($resultPreguntes->num_rows > 0) {
    $preguntes = [];
    while ($rowPregunta = $resultPreguntes->fetch_assoc()) {
        $sql = "SELECT resposta,correcta FROM respostes WHERE pregunta_id = ?";
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
            $respostes[] = $rowResposta['resposta'];
        }
        $preguntes[] = [
            'pregunta' => $rowPregunta['pregunta'],
            'respostes' => $respostes,
            'resposta_correcta' => $respostaCorrecta,
        ];
    }
}

$numPreguntes = isset($_GET['numPreguntes']) ? intval($_GET['numPreguntes']) : 10;
shuffle($preguntes);
$selectedQuestions = array_slice($preguntes, 0, $numPreguntes);
$_SESSION['questions'] = $selectedQuestions;

foreach ($selectedQuestions as &$question) {
    unset($question['resposta_correcta']);
}

echo json_encode($selectedQuestions);
?>