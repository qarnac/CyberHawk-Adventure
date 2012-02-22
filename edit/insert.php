<?php
//securing the right source expected .doesnt accept request from other server
$from= $_SERVER['HTTP_REFERER'];
$construct="http://"+ $_SERVER['SERVER_NAME']+"/edit/quadrant/";
//

$what= $_POST['what'];

if($what == "quadrant" && $from==$construct)
{
	include "../php/credentials.php";
$minlat=mysql_real_escape_string($_POST['minlat']);
$minlng=mysql_real_escape_string($_POST['minlng']);
$maxlat=mysql_real_escape_string($_POST['maxlat']);
$maxlng=mysql_real_escape_string($_POST['maxlng']);
$title=mysql_real_escape_string($_POST['title']);
$table_id = 'quadrants'; //this table has the information about all the quadrants
$query = "SELECT * FROM $table_id ";
$quadrants = mysql_query($query, $dbconnect);
$exe=true;
$i=1;
while($row = mysql_fetch_array($quadrants))
  {
	  if($row['title']==$title)
	  {
		  echo "Quadrant with same title already exist";
		  $exe=false;
		}
		$i++;
  }
  if($exe)
  {
	  $k=$i;
	  $i=$i*10;
	  $query="INSERT INTO $table_id (id,title,minlat,maxlat,minlng,maxlng,synopsis,level,heading) VALUES ('$i','$title','$minlat','$maxlat','$minlng','$maxlng','Quadrant $k','3','270')";
	 
	 if (!mysql_query($query,$dbconnect))
  {
  die('Error: ' . mysql_error());
  }
   echo "sucess";
}
mysql_close($dbconnect);
//echo $minlat." ".$minlng." ".$maxlat." ".$maxlng." ".$title;
}
?>