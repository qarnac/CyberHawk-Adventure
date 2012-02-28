<?php
//securing the right source expected .doesnt accept request from other server
$from= $_SERVER['HTTP_REFERER'];
$construct="http://". $_SERVER['SERVER_NAME']."/edit/".$_POST['what']."/";
//
if($from==$construct)
{include "../php/credentials.php";
	if($_POST['what']=="quadrant")
	{
		
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
	}
	else if($_POST['what']=="location")
	{
		$lat=explode(",",$_POST['lat']);
		$lng=explode(",",$_POST['lng']);
		$title=explode(",",$_POST['title']);
		$qid=$_POST['qid'];
		$cou=count($lat);
		$table_id="location";
		$query = "SELECT * FROM $table_id WHERE belong=$qid";
		$locations = mysql_query($query, $dbconnect);
		$rowsexist=mysql_num_rows($locations);
		$id=($qid*100)+$rowsexist;
		$icon="http://maps.google.com/mapfiles/kml/paddle/red-circle.png";
		$marker="question";
		$pagedir="./php";
		$count=count($lat);
		$temp="Failed locations because of existence : ";
		for($i=0;$i<$count;$i++)
		{
			if(!exist($locations,$title[$i],$lat[$i],$lng[$i])||$rowsexist==0)
			{
			$id++;
			$query="INSERT INTO $table_id (title,latitude,longitude,belong,synopsis,icon,id,marker,pagedir) VALUES ('$title[$i]','$lat[$i]','$lng[$i]','$qid','$title[$i]','$icon','$id','$marker','$pagedir')";
		 	if (!mysql_query($query,$dbconnect))
  				{
  					die('Error: ' . mysql_error());
  				}
			}
			else
			{
				echo $temp." ".$title[$i];
				$temp="";
			}
		}
		
		echo " Updated";
	}
	
}
function exist($loc,$title,$lat,$lng)
{
	while($row = mysql_fetch_array($loc))
  		{
			if($row['title']==$title || ($row['latitude']==$lat && $row['longitude']==$lng))
			return true;
		}
		return false;
}
?>