<?php
    include_once("dades.php");
    include_once("clsConn.php");

    if(!isset($_GET['action'])){
        echo "No s'ha especificat action";
    } else {
        $conn = new clsConn($servername, $username, $password, $db);
        
        switch($_GET['action']){
            case('insert' || 'delete' || 'update'):
                $result = $conn->query_cud($sql);
                break;
            case('read'):
                $sql = `WITH respuestas_limitadas AS (
                            SELECT 
                                r.ID_pregunta,
                                r.ID_resposta,
                                r.Resposta,
                                r.Nom,
                                r.Correcte,
                                ROW_NUMBER() OVER (PARTITION BY r.ID_pregunta ORDER BY r.ID_resposta) AS rn
                            FROM respostes r
                        )
                        SELECT 
                            p.ID_pregunta,
                            p.Pregunta,
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'ID_resposta', rl.ID_resposta,
                                    'Resposta', rl.Resposta,
                                    'Nom', rl.Nom,
                                    'Correcte', rl.Correcte
                                )
                            ) AS Respostes
                        FROM preguntes p
                        JOIN respuestas_limitadas rl 
                            ON p.ID_pregunta = rl.ID_pregunta
                        WHERE rl.rn <= 4
                        GROUP BY p.ID_pregunta, p.Pregunta;'
                        `;
                $result = json_encode($conn->query_r($sql));
                break;
        }

        echo $return;
        $conn->__destruct();
    }


?>