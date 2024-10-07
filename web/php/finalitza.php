<?php

header('Content-Type: application/json');
session_start();

$userAnswers = json_decode(file_get_contents('php://input'), true);

$totalQuestions = count($userAnswers['respostes']);
$correctAnswers = 0;

// Comprobar respuestas
foreach ($userAnswers['respostes'] as $index => $userAnswer) {
    if ($userAnswer['resposta'] == $_SESSION['questions'][$index]['resposta_correcta']) {
        $correctAnswers++;
    }
}

$response = [
    'totalQuestions' => $totalQuestions,
    'correctAnswers' => $correctAnswers,
];

session_destroy();

echo json_encode($response);