<?php
session_start();

if (!isset($_SESSION['respostes'])) {
    echo "No s'ha rebut les respostes correctes";
}

if (!isset($_SESSION['quantitat'])){
    echo "No s'ha rebut la quantitat de preguntes";
}

$respostes_user = json_decode(file_get_contents('php://input'), true);

if (!is_array($respostes_user)){
    echo "No s'ha rebut les respostes de l'usuari";
} else {
    $respostes_correctes = 0;
    $respostes_totals = $_SESSION['quantitat'];
    $return = '';

    foreach($respostes_user as $key => $value){
        if($respostes_user[$key] === $_SESSION['respostes'][$key]){
            $respostes_correctes ++;
        }
    }

    $json = array();
    $json['respostes_totals'] = $respostes_totals;
    $json['respostes_correctes'] = $respostes_correctes;

    $json = json_encode($json);
    echo $json;
}
?>