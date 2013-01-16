<?php
include '../php/credentials.php';
session_start();
$student= mysql_query("SELECT * FROM students WHERE parentHunt=" . $_POST['id']) or die(mysql_error());
$row = mysql_fetch_assoc($student);
echo json_encode($row);
?>