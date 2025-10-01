<?php
    include_once('dades/dades.php');
    include_once('dades/clsConn.php');
    session_start();
    $sql = '';
    $_SESSION['respostes'] = array();

    if(!isset($_GET['quantitat'])){
        echo "no s'ha rebut quantitat";
    } else {
        $_SESSION['quantitat'] = $_GET['quantitat']; 

////////////////////////////////////////////////////////////////////////////// 

        $conn = new clsConn($servername, $username, $password, $db);
        $sql = "SELECT p.ID_pregunta,p.Pregunta,JSON_ARRAYAGG(JSON_OBJECT('ID_resposta', rl.ID_resposta,'Resposta', rl.Resposta,'Nom', rl.Nom,'Correcte', rl.Correcte)) AS Respostes FROM preguntes p JOIN respuestas_limitadas rl ON p.ID_pregunta = rl.ID_pregunta WHERE rl.rn <= 4 GROUP BY p.ID_pregunta, p.Pregunta";
        $json_data = $conn->query_r($sql);
        $conn->free();

////////////////////////////////////////////////////////////////////////////// Creació d'array de respostes i de array preguntes, respostes

        $llistat_ids = array_rand($json_data['preguntes'], $_GET['quantitat']); 
        $llistat_js = array();
        $i = 0;
        
        foreach ($json_data['preguntes'] as $index => $pregunta) { 
            if (in_array($index, $llistat_ids)) { 
                $value_id = $pregunta['id'];
                $value_pregunta = $pregunta['pregunta'];
                $value_respostes_total = array();

                foreach ($pregunta['respostes'] as $resposta) { 
                    $value_respostes = array($resposta['id'], $resposta['resposta']);
                    $value_respostes_total[] = $value_respostes;

                    if ($resposta['correcta'] === true) {
                        $_SESSION['respostes'][] = $resposta['id'];
                    }
                }
                $llistat_js[$i]['id'] = $value_id;
                $llistat_js[$i]['pregunta'] = $value_pregunta;
                $llistat_js[$i]['respostes'] = $value_respostes_total;
                $i++;
            }
        }

////////////////////////////////////////////////////////////////////////////////

            echo json_encode($llistat_js);
        }     
?>