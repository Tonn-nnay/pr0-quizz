<?php
    include_once("dades.php");
    include_once("clsConn.php");

    if(!isset($_GET['action'])){
        echo "No s'ha especificat action";
    } elseif(!isset($_GET['query'])){
        echo "No s'ha especificat query";
    } else {
        $conn = new clsConn($servername, $username, $password, $db);
        $sql = $_GET['query'];
        
        switch($_GET['action']){
            case('insert'):
                $result = $conn->query_cud($sql);
                break;
            case('delete'):
                $result = $conn->query_cud($sql);
                break;
            case('update'):
                $result = $conn->query_cud($sql);
                break;
            case('read'):
                $result = json_encode($conn->query_r($sql));
                break;
        }

        echo $return;
        $conn->__destruct();
    }


?>