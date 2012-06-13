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
	var hunt=hunts[x];
	huntboundary=new georect(new latlng(hunt['minlat'],hunt['minlng']),new latlng(hunt['maxlat'],hunt['maxlng']));
	$('activity').innerHTML=multiple;
	starter();
}
var huntboundary;