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
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyB9JU8fk8vwDcneDmPhbnMtp-hcUL0E_tA&sensor=false">
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


var map;
rectangle = new google.maps.Rectangle();
      function initialize()
	   {
		   var lat=37.522859,lng=-98.60681;
		
		  
      	var myLatlng = new google.maps.LatLng(lat,lng);
	  	var myOptions = {
  						zoom: 5,
  						center: myLatlng,
						disableDoubleClickZoom:true,
						
 						 mapTypeId: google.maps.MapTypeId.TERRAIN
						};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
		
		
		addMarker();
		
	
 google.maps.event.addListener(map, 'rightclick', function(event) {
	 
	
	  rectangle.setMap(null);
	 var latlng=new google.maps.LatLng(event.latLng.lat()+0.150,event.latLng.lng()-0.150);
	 
	 var bound=new google.maps.LatLngBounds(latlng,event.latLng);
	
   newquad(bound);

  });
	  }
  function newquad(bound)
	  {
		  
		 var rectOptions = {
      strokeColor: "#000000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#000000",
      fillOpacity: 0.35,
      map: map,
	   editable: true,
      bounds: bound,
	  draggable: true
    };
    rectangle.setOptions(rectOptions);
	update();
	 google.maps.event.addListener(rectangle, 'rightclick', function() {
    rectangle.setMap(null);
	document.getElementById("minlat1").value="";
	document.getElementById("minlng1").value="";
	document.getElementById("maxlat1").value="";
	document.getElementById("maxlng1").value="";
	
  });
   google.maps.event.addListener(rectangle, 'bounds_changed', function() {
	update();
  });
	
		 }
		 function update()
		 {
	var b=rectangle.getBounds();
	document.getElementById("minlat1").value=(b.getNorthEast()).lat();
	document.getElementById("maxlng1").value=(b.getNorthEast()).lng();
	document.getElementById("maxlat1").value=(b.getSouthWest()).lat();
	document.getElementById("minlng1").value=(b.getSouthWest()).lng();
		}

function addMarker()
 {
	var malatlng,milatlng,rectangle;
	
	for(var i=0;i<quadrants.length;i++)
	{
	rectangle = new google.maps.Rectangle();
		milatlng=new google.maps.LatLng(quadrants[i][1],quadrants[i][3]);
		 malatlng=new google.maps.LatLng(quadrants[i][2],quadrants[i][4]);
		 var latLngBounds = new google.maps.LatLngBounds(milatlng,malatlng);
		
		 var rectOptions = {
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: map,
	  clickable:false,
	  
      bounds: latLngBounds
    };
    rectangle.setOptions(rectOptions);

attach(rectangle,i);
	}

	
		
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
  
    <div id="map_canvas" class="maincontent" ></div>
    <form name="quadrant" action="../insert.php" onSubmit="return validateform()" method="post">
   <div class="text1"> 
   <div>
   Min range Lat&nbsp;<input type="number" id="minlat1" name="minlat" readonly="readonly">Lng<input type="number" id="minlng1" name="minlng" readonly="readonly">
    
   </div>
   <div>
   Max range Lat<input type="number" id="maxlat1" name="maxlat" readonly="readonly">Lng<input type="number" id="maxlng1" name="maxlng" readonly="readonly">
   </div>
   Title <input type="text" name="title">
   	<div>	
    <input type="hidden" name="what" value="quadrant">
   <input type="submit" value="Insert Quadrant"></div>
    </form>
  </div>
  </div>
 
  </body>
</html>
