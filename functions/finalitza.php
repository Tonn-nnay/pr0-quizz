<?php
session_start();

if (!isset($_SESSION['respostes'])) {
    echo "No s'ha rebut les respostes correctes";
}

if (!isset($_SESSION['quantitat'])){
    echo "No s'ha rebut la quantitat de preguntes";
}

if(!isset($_GET['respostes_user'])){
    echo "No s'ha rebut les respostes de l'usuari";
} else {
    $respostes_user = json_decode($_GET['respostes_user']);
}

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
?>