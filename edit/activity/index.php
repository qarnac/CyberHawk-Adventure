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
    <style type="text/css">
    
	html { height: 100% }
  
  	body { height: 100%; margin: 0; background-color:#222 }
    #activity
	{
		margin-top:10px;
			  border-style:solid;
border-width:2px;}
	#map_canvas {width:880px;
		  margin-top:30px;
		  padding-top:30px;
		  padding-left:20px;
		  padding-right:20px;
		  border-style:solid;
border-width:5px;
	   }
	.text1{
		   color:#E9E9E9;
		   padding:10px;
		   text-align:left;
		   }
	.text{
		   color:#1E1E1E;
		   padding:10px;
		   text-align:right;
		   }
	#example {
		width:920px;
		height:100px;
		-moz-border-radius: 15px;
		border-radius: 15px;
		background:url(../../images/head.jpg);}
	
	#wrapper { width:920px; margin:0 auto; margin-top:30px;  }
	
	.maincontent { float:left; background:#fff; width:920px; }
	
	.style2 {background-color:#ffcccc;}


/* Tool tip */

* {font-family:Verdana, Arial, Helvetica, sans-serif; font-size:11px; }

a:hover {background:#ffffff; text-decoration:none;} /*BG color is a must for IE6*/

a.tooltip span {display:none; padding:2px 3px; margin-left:8px; width:150px;}

a.tooltip:hover span{display:inline; position:absolute; border:1px solid #cccccc; background:#ffffff; color:#6c6c6c;}




    </style>
    <script type="text/javascript">
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

?>
//Ajax

function ajax(id,what)
{
if(id!="null")
	{
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
		var a=xmlhttp.responseText;
		
		
		
					if(what=="location")
		{
			a = a.split(','); 
			var result=[];

			while(a[0]) 
			{
				result.push(a.splice(0,4));
			}
			locload(result);
		}
		else if(what=="activity")
		{
			a = a.split("','"); 
			alert(a);
			actload(a);
		}
    }
  }
xmlhttp.open("GET","../ajax.php?what=activity&get="+what+"&id="+id,true);
xmlhttp.send();
	}
}
//----selction
function locload(quad)
{
	var loc=document.getElementById("loc");
	if(document.getElementById("quadrant").value!="null")
	loc.disabled=false;
	else
	loc.disabled=true;
	
	loc.options.length=1;
	for(var i=0;i<quad.length;i++)
	loc.options[loc.options.length]= new Option(quad[i][0], quad[i][3], false, false);
	
	}
	function locsel(loc)
	{
		var act=document.getElementById("act");
	if(document.getElementById("loc").value!="null")
	act.disabled=false;
	else
	act.disabled=true;
		for(var i=0;i<tables.length;i++)
		act.options[act.options.length]= new Option(tables[i], tables[i], false, false);
		
	}
	function actload(activity)
	{
		
		var content="";
		var temp;
		for(var i=0;i<activity.length;i++)
		{
			temp=activity[i].split(",");
			
		content=content+"<div>"+temp[1]+"</div>";
		}
		document.getElementById("activity").innerHTML=content;
	
		
	}
    
//----validation
function validateform()
{
	var x=[document.forms["quadrant"]["minlat"].value,document.forms["quadrant"]["minlng"].value,document.forms["quadrant"]["maxlat"].value,document.forms["quadrant"]["maxlng"].value];
	
	for(var i=0;i<x.length;i++)
	{
		if(x[i]==null || x[i] =="" || !(x[i]<0 || x[i] >0))
		{
			alert("please select a quadrant");
			return false;
			
		}
	}
	var y=document.forms["quadrant"]["title"].value;
	
	if(y==null || y=="" || y.indexOf("<")>=0 || y.indexOf(">")>=0)
	{
		alert("Enter a valid title");
		return false;
	}
	
}

	
    </script>
  </head>
  <body onload="initialize()">
  <div id="wrapper">
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
  <div id="activity">
 
  </div>
 </div>
    
</div>
  
 
  </body>
</html>