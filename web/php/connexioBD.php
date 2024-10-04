<?php
$servername = "localhost";
$database = "a23lormolang_a";
$username = "a23lormolang_a";
$password = "Pirineus1";

try {
    $conn = new mysqli($servername, $username, $password, $database);

} catch (PDOException $pe) {
    die("Could not connect to the database $dbname :" . $pe->getMessage());
}