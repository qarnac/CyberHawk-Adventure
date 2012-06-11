var uniq=Math.floor((Math.random()*100)+1);
function $(x)
{return document.getElementById(x);}
function ajax(data,url,callback)
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
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    callback(xmlhttp.responseText);
    }
  }
xmlhttp.open("POST",url,true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send(data);
}
function huntsel(x)
{
	$('activity').innerHTML=multiple;
	starter();
}

function compress(file)
{

var img = document.createElement("img");
var reader = new FileReader();  reader.readAsDataURL(file);
reader.onload = function(e){
	img.src = e.target.result;
	
img.onload=function(){
var canvas=$("canvas");
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

var dataurl = canvas.toDataURL("image/jpeg",0.8);
dataurl=dataurl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
var fname=file.name;
dataurl="fname="+fname+"&url="+dataurl;
return dataurl;
}
}
}
//geo requirements
function latlng(lat,lng)
{this.lat=lat;this.lng=lng;}
function georect(dim1,dim2)
{this.topleft=dim1;this.topright=dim2;}

function gpsverify(files) {
    var binary_reader = new FileReader();  
    binary_reader.file = files[0]; //Selects the first file thats been droped or selected
    
    binary_reader.onloadend = function() {
	var jpeg = new JpegMeta.JpegFile(this.result, this.file.name);
	if(jpeg.gps && jpeg.gps.longitude)
	{}
	else
	alert("No location information is found on the Image");
	}
}
