function $(x) { return document.getElementById(x); }
function dragEnterHandler(e) { e.preventDefault(); }
function dragOverHandler(e) { e.preventDefault(); }
function dropHandler(e) {
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
}



function loadFiles(files) {
    var binary_reader = new FileReader();  
    binary_reader.file = files[0]; //Selects the first file thats been droped or selected
    
    binary_reader.onloadend = function() {
	var jpeg = new JpegMeta.JpegFile(this.result, this.file.name);  //Jpegmeta library is used to get the meta data of the image from its binary file. "this.result" has the binary format of the image file . 
	
	if(jpeg.gps)
	{

var lat1= 33.1397;
var lon1=-117.1702;
var lat2=jpeg.gps.latitude;
var lon2=jpeg.gps.longitude;

$("status").innerHTML=geodist(lat1,lon1,lat2,lon2)+" Miles";
	}
	else
	alert("Your image dont have any location information");

    }
    binary_reader.readAsBinaryString(files[0]);

   
}
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}
//calculates the distance between the two co-ordinates.
function geodist(lat1, lon1, lat2, lon2) {  
    //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
    var R = 3958.7558657440545; // Radius of earth in Miles 
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}