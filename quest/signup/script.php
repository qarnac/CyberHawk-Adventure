<?php
include "../php/credentials.php";
$id=100010060;
$chice='{"choices":[{"choice":"a","content":"Water fall of deepest place","ans":"true"},{"choice":"b","content":"shallow falls","ans":"false"},{"choice":"c","content":"Angel in the falls","ans":"false"},{"choice":"d","content":"largest false","ans":"false"},{"choice":"e","content":"Interrupted Falls","ans":"false"}]}';
for($i=0;$i<29;$i++)
{

mysql_query("INSERT INTO stud_activity (student_id,hunt_id,media,media_id,created,status,lat,lng,aboutmedia,whythis,howhelpfull,yourdoubt,mquestion,choices) VALUES ($id,2,'image.php',7,'".date('Y-m-d H:i:s')."','new',33.38,-116.48,'aboutmedia','whythis','howhelpful','yourdoubt','multiple choice question','".$chice."')");
$id++;	
} 

?>