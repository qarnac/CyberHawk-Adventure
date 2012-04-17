<?php
include "../../php/credentials.php";
$table_id = 'quadrants'; //this table has the information about all the quadrants
$query = "SELECT * FROM $table_id ";
$quadrants = mysql_query($query, $dbconnect);
$tables = mysql_list_tables($dbase,$dbconnect);


?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
   
<link rel="stylesheet" type="text/css" media="all" href="style.css" />
    
      
    
    <script type="text/javascript">
	function init()
	{
	document.getElementById("process").style.display="none";
	document.getElementById("darkenBackground").style.display="none";
	}
	<?php echo "var quadrants = [";
$i=0;
 while($row = mysql_fetch_array($quadrants))
  {
	  if($i==0)
	  echo "[";
	  else
	  echo ",[";
  echo "'".$row['title']."',";
  echo $row['minlat'].",";
  echo $row['maxlat'].",";
  echo $row['minlng'].",";
  echo $row['maxlng'].",";
  echo $row['id']."]";
  $i++;
  
  } 
  
echo "];";
$i=0;
echo "var tables=[";
while($row = mysql_fetch_array($tables))
  {
	  if($i==0)
	   echo "'".$row[0]."'";
	   else
	  echo ",'".$row[0]."'";
	  $i++;
  }
  echo "];";

?></script>
  </head>
  <body onLoad="init()" >

 <div id="process" >
   
 </div>
  <div id="wrapper" >
   <div id="darkenBackground" ></div>
  <div id="example">
  <div class="text">
   <h3 >Welcome to CyberHawk</h3>
   <h4>Here you can create new quadrants,add locations and also activities .!</h4>
   <a href="#"  class="tooltip">Help <span>Right click to create a Quadrant.Right click on the rectangle to delete it.</span></a>
  </div>
 
  </div>
  
<div class="maincontent" id="map_canvas" >
 <div id="selection">
  
   Select a Quadrant :  <select onChange="ajax(this.value,'location');" id="quadrant">
  		<option value="null">Select</option>
		 <script type="application/javascript">
 			var content="";
 			for(i=0;i<quadrants.length;i++)
 			content=content+"<option value="+quadrants[i][5]+">"+quadrants[i][0]+"</option>";
 			document.write(content);
 			</script>
		</select>
	Select a Location :
	<select onChange="locsel(this.value)" id="loc" disabled=true>
    <option value="null">Select</option>
    </select>
    Activity :<select onChange="ajax(this.value,'activity')" id="act" disabled=true>
    <option value="null">Select</option>
    </select>

  </div> 
  <div id="activity" >

  </div>
 </div>
    
</div>
  
 <script type="text/javascript" src="allscript.js"></script>
  </body>
</html>