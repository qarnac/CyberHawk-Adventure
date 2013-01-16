<?php
include '../php/credentials.php';
session_start();
return query("SELECT * FROM students WHERE teacher_id=" . $_POST['id']) or die(mysql_error());
?>