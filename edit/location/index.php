<?php
include "../../php/credentials.php";
$table_id = 'quadrants'; //this table has the information about all the quadrants
$query = "SELECT * FROM $table_id ";
$quadrants = mysql_query($query, $dbconnect);
?>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <style type="text/css">
    
	html { height: 100% }
  
  	body { height: 100%; margin: 0; background-color:#222 }
    
	#map_canvas { height:420px;width:600px;
		  margin-top:30px;
		  padding-left:160px;
		  padding-right:160px;
	   }
	   #locs{
		   color:#FFF;
		   padding:20px;
	   
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
	
	.maincontent { float:left; background:#221; width:920px; }
	
	.style2 {background-color:#ffcccc;}


/* Tool tip */

* {font-family:Verdana, Arial, Helvetica, sans-serif; font-size:11px; }

a:hover {background:#ffffff; text-decoration:none;} /*BG color is a must for IE6*/

a.tooltip span {display:none; padding:2px 3px; margin-left:8px; width:150px;}

a.tooltip:hover span{display:inline; position:absolute; border:1px solid #cccccc; background:#ffffff; color:#6c6c6c;}




    </style>
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDSwGeMX946SO8b3_sZqqAbCzM5eloG-os&sensor=false">
    </script>
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
  
echo "];";?>
var map,mark=[],exe=true,newmarker=[];
// Ajax
var locat=[];
function getloc(what,id)
{
var xmlhttp;


if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function ()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
  	var a;
	a=xmlhttp.responseText;
	a = a.split(','); 
	var result=[];
	while(a[0]) 
	{
	result.push(a.splice(0,4));
	}
	locat=result;
	var marker,loc;
	for(var i=0;i<locat.length;i++)
	{
		loc=new google.maps.LatLng(locat[i][1],locat[i][2]);
	 marker = new google.maps.Marker({
      position: loc,
      map: map,
      title:locat[i][0]
  		});
		mark.push(marker);
	}
	
    }
  }
xmlhttp.open("GET","../ajax.php?what="+what+"&id="+id,true);
xmlhttp.send();

//return location;
}
//



      function initialize()
	   {
		  var lat=37.522859,lng=-98.60681;
		
		  
      	var myLatlng = new google.maps.LatLng(lat,lng);
		  
	  	var myOptions = {
  						zoom: 5,
  						center:myLatlng ,
						disableDoubleClickZoom:true,
 						 mapTypeId: google.maps.MapTypeId.TERRAIN
						};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
		
		
		
		 	
		
	  }
	  function rem()
	  {
		  for(var i=0;i<mark.length;i++)
		  mark[i].setMap(null);
		 
		  mark=[];
		  for(var i=0;i<newmarker.length;i++)
		  newmarker[i].setMap(null);
		 
		 
		 if(newmarker.length>0)
		 {
		  newmarker=[];
		  update();
		 }
	}
	  
	  function setmap(val)
	  {
		 	rem(); 
		   val=(val/10)-1;
		   var qmin=new google.maps.LatLng(quadrants[val][1],quadrants[val][3]);
		   var qmax=new google.maps.LatLng(quadrants[val][2],quadrants[val][4]);
		   var qbound=new google.maps.LatLngBounds(qmin,qmax);
		   map.setCenter(qbound.getCenter());
		   map.setZoom(10);
		   boundary(qbound,val);
		   getloc("location",(val+1)*10);
	  }
	  function getti(loc)
	  {
		  var hi =document.getElementById("ti").value;
		  var check=true;
		  if(newmarker.length==0)
		  check=true;
		  else
		  {
			 
			  for(var i=0;i<newmarker.length;i++)
			  {
				  if(newmarker[i].custom==hi||(newmarker[i].position.lat()==loc.lat() && newmarker[i].position.lng()==loc.lng() ))
					  check=false;
			  }
			 
	  		}
		   if(/^[a-z A-Z]*$/.test(hi) && hi!=null && hi.replace(/\s/g,"") != "" && check)
		  {exe =true;
		  document.getElementById("ti").value="";
		  
		   return hi;
		   
		   }
		   else
		   exe=false;
		   return false;
		 
		 }
		 function update()
		 {
			 var temp="";
			 for(var i=0;i<newmarker.length;i++)
			 {
				 temp=temp+newmarker[i].title+"<br>";
				 }
				 document.getElementById("locs").innerHTML=temp;
			 }
		   
  function newquad(loc)
	  { 
	 
	 var title=getti(loc);
	 
	
	  var marker;
	  if(exe)
	  {
	 	  marker = new google.maps.Marker({
      		position: loc,
     		 map: map,
	  		animation:google.maps.Animation.DROP,
	  		icon:"../../images/dicon.png",
	  		custom:title,
      		title:title+" "+loc
  		});
		newmarker.push(marker);
		update();
		
		google.maps.event.addListener(marker, 'rightclick', function(event) {
			marker.setMap(null);
			newmarker.splice(newmarker.indexOf(marker), 1);
			update();
			exe=true;
		});
		exe=false;
		
	  }
	  else
	  {
		  alert("Please enter the title before selecting location & Please no duplicates");
		  
	  }
	}
		

function boundary(qbound,i)
 {
	var rectangle =new google.maps.Rectangle();
	

		 var rectOptions = {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.15,
      map: map,
      bounds: qbound
    };
    rectangle.setOptions(rectOptions);


	
google.maps.event.addListener(rectangle, 'rightclick', function(event) {
	
   newquad(event.latLng);

  });
	 mark.push(rectangle);
	attach(rectangle,i);
 }
 function attach(marker, number,loc) {
 
 var image = '../../images/img.php?text='+quadrants[number][0]+'&size=2';
 
  var Marker = new google.maps.Marker({
      position: (marker.getBounds()).getCenter(),
      map: map,
      icon: image
	 
  });
	

  
}
//----validation
function updateloc(what)
{
  if(newmarker.length>0)
  {
	var xmlhttp;
	var qid=document.getElementById("quadrant").value;
	if (window.XMLHttpRequest)
  	{// code for IE7+, Firefox, Chrome, Opera, Safari
  		xmlhttp=new XMLHttpRequest();
  	}	
	else
  	{// code for IE6, IE5
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
	xmlhttp.onreadystatechange=function ()
  	{
  		if (xmlhttp.readyState==4 && xmlhttp.status==200)
    	{
  			var a;
			a=xmlhttp.responseText;
			alert(a);
    	}
  	}
	xmlhttp.open("POST","../insert.php",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	var lat1="",lng1="",title="";
	for(var i=0;i<newmarker.length;i++)
	{
		lat1=lat1+newmarker[i].position.lat()+",";
		lng1=lng1+newmarker[i].position.lng()+",";
		title=title+newmarker[i].custom+",";
	}
	lat1=lat1.substr(0,(lat1.length-1));
	lng1=lng1.substr(0,(lng1.length-1));
	title=title.substr(0,(title.length-1));
	xmlhttp.send("what="+what+"&lat="+lat1+"&lng="+lng1+"&title="+title+"&qid="+qid);
  }

}

	
    </script>
  </head>
  <body onLoad="initialize()">
  <div id="wrapper">
  <div id="example">
  <div class="text">
   <h3 >Welcome to CyberHawk</h3>
   <h4>Here you can create new quadrants,add locations and also activities .!</h4>
   <a href="#"  class="tooltip">Help <span>Right click to create a Quadrant.Right click on the rectangle to delete it.</span></a>
  </div>
 
  </div><div class="text1">  <div>
   <form name="loc"  onsubmit="return false;">
   
  Please select a Quadrant to add a Location:<select onChange="setmap(this.value);" id="quadrant">
  <option value="null">Select</option>
 <script type="application/javascript">
 var content="";
 for(i=0;i<quadrants.length;i++)
 content=content+"<option value="+quadrants[i][5]+">"+quadrants[i][0]+"</option>";
 document.write(content);
 </script>
</select>
  
   
   Title <input type="text" name="title" id="ti"></form>
   	   </div>
    <div id="map_canvas" class="maincontent" ></div>
    <div style="color:#FFF">New Location : <button onClick="updateloc('location')">Update DB</button></div>
 	<div id="locs"></div>
  </div>
 
  </body>
</html>