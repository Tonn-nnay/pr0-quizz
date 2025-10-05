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
        $sql = "WITH respuestas_limitadas AS (SELECT r.ID_pregunta, r.ID_resposta, r.Resposta, r.Nom, r.Correcte, ROW_NUMBER() OVER (PARTITION BY r.ID_pregunta ORDER BY r.ID_resposta) AS rn FROM Respostes r) SELECT JSON_ARRAYAGG(JSON_OBJECT('ID_pregunta', p.ID_pregunta, 'Pregunta', p.Pregunta, 'Respostes', (SELECT JSON_ARRAYAGG(JSON_OBJECT('ID_resposta', rl2.ID_resposta, 'Resposta', rl2.Resposta, 'Nom', rl2.Nom, 'Correcte', rl2.Correcte)) FROM respuestas_limitadas rl2 WHERE rl2.ID_pregunta = p.ID_pregunta AND rl2.rn <= 4))) AS preguntas_json FROM Preguntes p;";        
        $result = $conn->query_r($sql);
        $json_bruto = $result[0]['preguntas_json'];
        $json_data = json_decode($json_bruto, 1);
        $conn->free();

////////////////////////////////////////////////////////////////////////////// Creació d'array de respostes i de array preguntes, respostes

        $llistat_ids = array_rand($json_data, $_GET['quantitat']); 
        $llistat_js = array();
        $i = 0;
        
        foreach ($json_data as $index => $pregunta) { 
            if (in_array($index, $llistat_ids)) { 
                $value_id = $pregunta['ID_pregunta'];
                $value_pregunta = $pregunta['Pregunta'];
                $value_respostes_total = array();

                foreach ($pregunta['Respostes'] as $resposta) { 
                    $value_respostes = array($resposta['ID_resposta'], $resposta['Resposta'], $resposta['Nom']);
                    $value_respostes_total[] = $value_respostes;
                    var_dump($resposta['Correcte']);

                    if ($resposta['Correcte'] == true) {
                        $_SESSION['respostes'][$value_id] = $resposta['ID_resposta'];
                    }
                }
                $llistat_js[$i]['id_pregunta'] = $value_id;
                $llistat_js[$i]['pregunta'] = $value_pregunta;
                $llistat_js[$i]['respostes'] = $value_respostes_total;
                $i++;
            }
        }

////////////////////////////////////////////////////////////////////////////////

            echo json_encode($llistat_js);
            var_dump($_SESSION['respostes']);
        }     
?>