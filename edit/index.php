<?php
include "../php/credentials.php";
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
	background:url(../images/head.jpg);}
	   #wrapper { width:920px; margin:0 auto; margin-top:30px;  }
		.maincontent { float:left; background:#fff; width:920px; }
.style2 {background-color:#ffcccc;}
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


var map;
rectangle = new google.maps.Rectangle();
      function initialize()
	   {
		   var lat=39.542035,lng=-102.052155;
		
		  
      	var myLatlng = new google.maps.LatLng(lat,lng);
	  	var myOptions = {
  						zoom: 5,
  						center: myLatlng,
						
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
  });
   google.maps.event.addListener(rectangle, 'bounds_changed', function() {
	update();
  });
	
		 }
		 function update()
		 {
	var b=rectangle.getBounds();
	document.getElementById("min").innerHTML=b.getNorthEast();
	document.getElementById("max").innerHTML=b.getSouthWest();
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
      bounds: latLngBounds
    };
    rectangle.setOptions(rectOptions);
	var lat=(quadrants[i][2]+quadrants[i][1])/2;
	var lng=(quadrants[i][4]+quadrants[i][3])/2
	malatlng=new google.maps.LatLng(lat,lng);
attach(rectangle,i,malatlng);
	}

	
		
 }
 function attach(marker, number,loc) {
 
 var image = '../images/img.php?text='+quadrants[number][0]+'&size=2';
 
  var beachMarker = new google.maps.Marker({
      position: loc,
      map: map,
      icon: image
  });
	

  
}

	
    </script>
  </head>
  <body onload="initialize()">
  <div id="wrapper">
  <div id="example">
  <div class="text">
   <h3 >Welcome to CyberHawk</h3>
   <h4>Here you can create new quadrants,add locations and also activities .!</h4>
  </div>
 
  </div>
    <div id="map_canvas" class="maincontent" ></div>
   <div class="text1"> <h4>Min range</h4>
    <h4 id="min"></h4>
    <h4>Max range</h4>
    <h4 id="max"></h4>
  </div>
  </div>
  </body>
</html>