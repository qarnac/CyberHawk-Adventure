<?php
include "php/credentials.php";
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
	background:url(images/head.jpg);}
	   #wrapper { width:920px; margin:0 auto; margin-top:30px;  }
		.maincontent { float:left; background:#fff; width:920px; }
.style2 {background-color:#ffcccc;}
    </style>
  
    <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDhO5A_ntE4_02AkVzfEerAmBJjVQKy7mk&sensor=false">
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
      function initialize()
	   {
		   var lat=0,lng=0;
		   for(var i=0;i<quadrants.length;i++)
		   {
			   lat=lat+quadrants[i][1];
			   lng=lng+quadrants[i][3];
		   }
		   lat=lat/quadrants.length;
		   lng=lng/quadrants.length;
		   //moving the map little higher
		   lat=lat+0.164;
      	var myLatlng = new google.maps.LatLng(lat,lng);
	  	var myOptions = {
  						zoom:5,
  						center: myLatlng,
						
 						 mapTypeId: google.maps.MapTypeId.TERRAIN
						};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		
		addMarker();
	

	  }
	  /*
	  disableDefaultUI: true,
						disableDoubleClickZoom:true,
						scrollwheel:false,
						panControl: false,
						draggable: false,*/

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

attach(rectangle,i);
	}

	
		
 }
 function attach(marker, number,loc) {
 
 var image = 'images/img.php?text='+quadrants[number][0]+'&size=4';
 
  var beachMarker = new google.maps.Marker({
      position: (marker.getBounds()).getCenter(),
      map: map,
      icon: image
  });
	
    google.maps.event.addListener(marker, 'click', function() {
    document.location="main.php?q="+quadrants[number][5];
  });
  
}

	
    </script>
  </head>
  <body onload="initialize()">
  <div id="wrapper">
  <div id="example">
  <div class="text">
   <h3 >Welcome to CyberHawk</h3>
   <h4>Please select any one of the quadrant below and enjoy your flight</h4>
  </div>
 
  </div>
    <div id="map_canvas" class="maincontent" ></div>
  </div>
  </body>
</html>