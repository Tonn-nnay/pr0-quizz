<?php
    session_start();
    $_SESSION['respostes'] = array();

    if(!isset($_GET['quantitat'])){
        echo "no s'ha rebut quantitat";
    } else { //:35
        $_SESSION['quantitat'] = $_GET['quantitat']; 

////////////////////////////////////////////////////////////////////////////// Conseguir el json

        $json = file_get_contents("../rsc/json/data.json");

        if ($json === false) {
            die('No ha cargado del json');
        } else { //:34
            $json_data = json_decode($json, true);

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

            $return = json_encode($llistat_js);
            echo $return;
        }     
    }

?>