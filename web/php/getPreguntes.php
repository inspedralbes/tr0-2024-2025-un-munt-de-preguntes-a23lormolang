<?php

header('Content-Type: application/json');
session_start();

$jsonData = file_get_contents('../../doc/data.json');
$questions = json_decode($jsonData, true)['preguntes'];


$numPreguntes = isset($_GET['numPreguntes']) ? intval($_GET['numPreguntes']) : 10;
shuffle($questions);
$selectedQuestions = array_slice($questions, 0, $numPreguntes);
$_SESSION['questions'] = $selectedQuestions;

foreach ($selectedQuestions as &$question) {
    $allAnswers = $question['respostes_incorrectes'];
    array_push($allAnswers, $question['resposta_correcta']);
    shuffle($allAnswers);

    // Eliminam la resposta correcta i les respostas incorrectes per enviar al front
    unset($question['resposta_correcta']);
    unset($question['respostes_incorrectes']);

    $question['respostes'] = $allAnswers;
}

echo json_encode($selectedQuestions);
?>