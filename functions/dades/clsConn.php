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
            }
        }
    }
/*

*/
?>