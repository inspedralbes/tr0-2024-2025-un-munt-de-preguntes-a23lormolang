<?php
$servername = "localhost";
$database = "jocPreguntes";
$username = "lorenzo";
$password = "pirineus";

try {
    $conn = new mysqli($servername, $username, $password, $database);

} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}