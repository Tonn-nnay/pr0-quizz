<?php
session_start();

// Validaciones básicas
if (!isset($_SESSION['respostes'])) {
    echo json_encode(['error' => "No s'ha rebut les respostes correctes"]);
    exit;
}

if (!isset($_SESSION['quantitat'])){
    echo json_encode(['error' => "No s'ha rebut la quantitat de preguntes"]);
    exit;
}

// Leemos el JSON enviado por JS
$respostes_user = json_decode(file_get_contents('php://input'), true);

if (!is_array($respostes_user) || !isset($respostes_user['respostesUsuari'])) {
    echo json_encode(['error' => "No s'ha rebut les respostes de l'usuari"]);
    exit;
}

// Inicializaciones
$respostes_correctes = 0;
$respostes_totals = $_SESSION['quantitat'];
$respostes_correctes_sessio = $_SESSION['respostes']; // array normal de IDs correctos
$iteracio_valida = 0;

// Recorremos solo las respuestas que el usuario ha contestado
foreach ($respostes_user['respostesUsuari'] as $id_pregunta => $id_resposta_usuari) {

    // Ignoramos respuestas vacías o indefinidas
    if ($id_resposta_usuari === null || $id_resposta_usuari === '' || $id_resposta_usuari === 'undefined') {
        continue;
    }

    // Si el ID de respuesta del usuario está en el array de correctas
    if (in_array($id_pregunta, $respostes_correctes_sessio)) {
        if ($id_respsota_usuari == $respostes_correctes_sessio[$iteracio_valida]){
            $respostes_correctes++;
        }
        $iteracio_valida ++;
    }
}

// Construimos la respuesta JSON
$json = [
    'respostes_totals' => $respostes_totals,
    'respostes_correctes' => $respostes_correctes,
    'temps_total' => $respostes_user['tempsTotal'] ?? 0
];

// Devolvemos JSON al frontend
echo json_encode($json);
?>

