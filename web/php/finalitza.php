<?php
// finalitza.php

header('Content-Type: application/json');
session_start();

// Recoger las respuestas enviadas
$userAnswers = json_decode(file_get_contents('php://input'), true);

// Inicializar variables para el recuento de respuestas correctas
$totalQuestions = count($userAnswers[0]);
$correctAnswers = 0;

// Comprobar respuestas
foreach ($userAnswers as $index => $userAnswer) {
    if ($userAnswer[2] == $_SESSION['questions'][$index][2]) {
        $correctAnswers++;
    }
}

foreach ($respostesUsuari['respostes'] as $respostaUsuari) {
    $idPregunta = $respostaUsuari['id'];  // Obtener el índice de la pregunta
    $respostaSeleccionada = $respostaUsuari['resposta'];  // Obtener el índice de la respuesta seleccionada

    // Verificar si el índice de la pregunta existe y si la respuesta es correcta
    if ($respostaSeleccionada == $$_SESSION['questions'][$idPregunta]['resposta_correcta']) {
        $respostesCorrectes++;
    }
}

$response = [
    'totalQuestions' => $totalQuestions,
    'correctAnswers' => $correctAnswers,
];

echo json_encode($response);