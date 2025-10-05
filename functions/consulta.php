<?php 
    include_once('dades/dades.php');
    include_once('dades/clsConn.php');

    $conn = new clsConn($servername, $username, $password, $db);

    switch($_GET['action']){
            case('insert' || 'delete' || 'update'):
                $result = $conn->query_cud($sql);
                break;
            case('delete'):
                $result = $conn->query_cud($sql);
                break;
            case('update'):
                $result = $conn->query_cud($sql);
                break;
            default:
                $sql = "WITH respuestas_limitadas AS (SELECT r.ID_pregunta, r.ID_resposta, r.Resposta, r.Nom, r.Correcte, ROW_NUMBER() OVER (PARTITION BY r.ID_pregunta ORDER BY r.ID_resposta) AS rn FROM Respostes r) SELECT JSON_ARRAYAGG(JSON_OBJECT('ID_pregunta', p.ID_pregunta, 'Pregunta', p.Pregunta, 'Respostes', (SELECT JSON_ARRAYAGG(JSON_OBJECT('ID_resposta', rl2.ID_resposta, 'Resposta', rl2.Resposta, 'Nom', rl2.Nom, 'Correcte', rl2.Correcte)) FROM respuestas_limitadas rl2 WHERE rl2.ID_pregunta = p.ID_pregunta AND rl2.rn <= 4))) AS preguntas_json FROM Preguntes p;";        
                $json_data = json_decode($conn->query_r($sql), 1);
                echo $json_data;
                break;
        }

        //tiene que recibir un json donde este la informacion de que caso necesita

    
    
    $conn->free();
?>