<?php
class clsConn{
    //hay errores pq VisualStudio no entiende que la variable $conn se define en el constructor
        protected $conn;

        function __construct($_servername, $_username, $_password, $_db){
            $conn = mysqli_connect($_servername, $_username, $_password, $_db);
            
            if (!$conn) {
                die("Connection failed: " . mysqli_connect_error());
            } else {
               echo "Connexió oberta.";
            }
        }

        function __destruct(){
            $conn->close();
        }

        public function query_cud($sql){
            if ($conn->query($sql) === TRUE){
                return TRUE;
            } else {
                return "Error: " . $sql . "<br>" . $conn->error;
            }
        }

        public function query_r($sql){
            $data = $conn->query($sql);
            if(isset($data)){
                $result = [];
                while ($row = $data->fetch_assoc()) {
                    $result[] = $row;
                }
                return $result;

/*
WITH respuestas_limitadas AS (
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
GROUP BY p.ID_pregunta, p.Pregunta;
*/
            }
        }
    }
?>