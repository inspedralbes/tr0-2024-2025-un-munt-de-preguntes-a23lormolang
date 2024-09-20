<?php

header('Content-Type: application/json');
session_start();

// Càrrega del JSON de preguntes
$jsonData = file_get_contents('data.json');
$questions = json_decode($jsonData, true)['preguntes'];


$numPreguntes = isset($_GET['numPreguntes']) ? intval($_GET['numPreguntes']) : 10;

foreach ($questions as &$question) {
    // Combinam les respoestas correctes i incorrectas
    $allAnswers = $question['respostes_incorrectes'];
    array_push($allAnswers, $question['resposta_correcta']);
    shuffle($allAnswers);

    // Eliminam la resposta correcta i les respostas incorrectes per enviar al front
    unset($question['resposta_correcta']);
    unset($question['respostes_incorrectes']);

    // Afegim l'array de respostes
    $question['respostes'] = $allAnswers;
}


shuffle($questions);
$selectedQuestions = array_slice($questions, 0, $numPreguntes);
$_SESSION['questions'] = $selectedQuestions;
// Retornar les preguntes seleccionades com a resposta JSON
echo json_encode($selectedQuestions);
?>