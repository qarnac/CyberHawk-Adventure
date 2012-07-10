var map;
function createmap(position,z)
{
	if(!z)
	z=11;
	currentloc();
	$('activity').innerHTML="";
		var myOptions = {
		center :new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
		zoom : z,
		mapTypeId : google.maps.MapTypeId.TERRAIN
	};
	 map = new google.maps.Map($("activity"), myOptions);
	
}
function searchlocation(keyword)
{

	  var request = {
    location:map.getCenter() ,
    radius: '50000',
    query: keyword
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, queryresults);
	

}

function queryresults(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      
    }
  }
}
function currentloc()
{
	if (navigator.geolocation) 
    navigator.geolocation.getCurrentPosition(createmap, errorFunction);

}
function createhunt () {
	currentloc();
  
}

function errorFunction(e)
{ 
	var x=new Object();
	x.coords=new Object();
	x.coords.latitude=39.828175; 
	x.coords.longitude=-98.5795;
	createmap(x,4);
}
