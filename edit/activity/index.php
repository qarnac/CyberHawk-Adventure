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
	<form class="activ" name="multiple" onsubmit="return false;"> 
      <div  class="split" style="width:200px;"><label>Tab Title <input type="text" name="name"  c_type="text" c_req="true" /></label></div>  
      <div class="clear"></div>
      	<div class="cent" ><label>Title<input  type="text" name="title" value=""   c_type="text" c_req="true"/></label></div> 
        <div class="clear"></div>                       
         <div class="split" style="width:200px;" ><label  style="width:200px;">Media Type  <select  style="width:200px;" name="type" c_type="select" c_req="true" onChange="s_selmedia(this.value,'fileselect','f2','fileselect')">   <option value="null">Select one</option>   <option value="img">Image</option>   <option value="video">Video</option>    </select> </label>  <input  style="width:200px;" type="text" id="f2" c_type="text" name="img" c_req="false" disabled="true" onBlur="selvid(this.value)"/>   </div>      
        <fieldset style="width:430px"> <legend>HTML File Upload</legend>  <input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="1000000" />  <div> 	<label for="fileselect">Files to upload:</label> 	<input type="file" id="fileselect" name="fileselect" disabled="true"  onChange="img_validate(this)"  accept="image/jpg,image/gif,image/jpeg,image/png"/> 	<div id="filedrag">or drop files here</div> </div>  </fieldset>   
   <div class="split"><label>Description<textarea name="description" c_type="textarea" c_req="true" ></textarea></label></div>  <div  class="split"><label>Points Rewarded <input type="number" name="reward"  c_type="number" c_req="true" /></label></div> <div class="clear"></div>   <div class="split"><label>Choice a <input type="text" name="a" c_type="text" c_req="true" />  <input type="radio" name="answer" value="a" c_req="true"/>  </label></div>  <div  class="split"><label>Choice b <input type="text" name="b" c_type="text"  c_req="true" />  <input type="radio" name="answer" value="b" />  </label> </div>  <div  class="split"><label>Choice c <input type="text" c_type="text" name="c"/><input type="radio" name="answer" value="c" /></label>    </div>  <div  class="split"><label>Choice d <input type="text" c_type="text" name="d"/><input type="radio" name="answer" value="d" /></label></div>  <div  class="split"><label>Choice e <input type="text" c_type="text" name="e"/><input type="radio" name="answer" value="e" /></label></div>     <div  class="split"><label>Points to Deduct <input type="number" c_type="text" name="red"/></label></div>    <div  class="split"><label>Hints <input type="text" name="hint" c_type="text"/></label></div><div class="split"><label>Other media<input type="text" name="alt" c_type="text" /></label></div>     <div class="split"><input type="button" onClick="check(this.form)" c_type="text" value="Submit"/> </div></form> 
  </div>
 </div>
    
</div>
  
 <script type="text/javascript" src="allscript.js"></script>
  </body>
</html>