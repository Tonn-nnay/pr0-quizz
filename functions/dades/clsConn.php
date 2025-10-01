<?php
class clsConn {
    public $conn;

    function __construct($_servername, $_username, $_password, $_db) {
        $this->conn = mysqli_connect($_servername, $_username, $_password, $_db);
        
        if (!$this->conn) {
            die("Connection failed: " . mysqli_connect_error());
        }
    }

    function free() {
        $this->conn->close();
    }

    public function query_cud($sql) {
        if ($this->conn->query($sql) === TRUE) {
            return TRUE;
        } else {
            return "Error: " . $sql . "<br>" . $this->conn->error;
        }
    }

    public function query_r($sql) {
        $data = $this->conn->query($sql);
        if ($data) {
            $result = [];
            while ($row = $data->fetch_assoc()) {
                $result[] = $row;
            }
            return $result;
        } else {
            return null;
        }
    }
}
?>
