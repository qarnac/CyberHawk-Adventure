/**
 * @author sabareesh kkanan subramani
 */
function geocompress(file,type)
{
	this.file=compress(file,type);
	this.loc=gpsverify(file);
	}
function compress(file,type)
{
	
var x=new Object();
var img=new Image();
var reader = new FileReader();
reader.readAsDataURL(file);	
reader.onload=function(e){
			img.src = e.target.result;
		img.onload=function(){
		
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			var MAX_WIDTH = 450;
			var MAX_HEIGHT = 280;
			var width = img.width;
			var height = img.height;

			if (width > height) {
				if (width > MAX_WIDTH) {
					height *= MAX_WIDTH / width;
					width = MAX_WIDTH;
				}
			} else {
				if (height > MAX_HEIGHT) {
					width *= MAX_HEIGHT / height;
					height = MAX_HEIGHT;
				}
			}
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);
			x.dataurl = canvas.toDataURL("image/jpeg", 0.8);
			//dataurl=dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
			}

		}
return x;
}

function latlng(lat,lng)
{this.lat=parseFloat(lat);this.lng=parseFloat(lng);}
function georect(dim1,dim2)
{this.topleft=dim1;this.bottomright=dim2;}
function checkloc(rect,loc)
{
	return rect.topleft.lat<loc.lat && rect.bottomright.lat>loc.lat && rect.topleft.lng<loc.lng && rect.bottomright.lng>loc.lng;
}
function gpsverify(file) {
	var loc=new Object();
    var binary_reader = new FileReader();  
    binary_reader.readAsBinaryString(file); 
    
    binary_reader.onloadend = function(e) {
	var jpeg = new JpegMeta.JpegFile(e.target.result, file.name);
	if(jpeg.gps && jpeg.gps.longitude)
	{
		var x=new latlng(jpeg.gps.latitude.value,jpeg.gps.longitude.value);
		if(checkloc(huntboundary,x))
		{	loc.latlng=new latlng(jpeg.gps.latitude.value,jpeg.gps.longitude.value);
		loc.from="Native";}else
		{alert("not inside the boundary");}
	
	}
	else
	{	
		alert("No location information is found on the Image Please select Image location from the map");
		map(true);
		gmaps();
}
	}
	return loc;
}
function rectcenter(x)
{
	
	return new latlng((x.topleft.lat+x.bottomright.lat)/2,(x.topleft.lng+x.bottomright.lng)/2);
	
}
   function gmaps() {
   	var center=rectcenter(huntboundary);
        var myOptions = {
          center: new google.maps.LatLng(center.lat, center.lng),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map($("map_canvas"),
            myOptions);
      }
      function map(x)
      {if(x)
      	{	
      		$('map_canvas').style.display='block';
      		$('contents').style.display='none';
      	}
      	else
      	{$('map_canvas').style.display='none';
      		$('contents').style.display='block';}
      }
