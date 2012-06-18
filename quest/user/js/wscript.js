/*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * verifies all the form data
 * submits the form data and image data to server
 */
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
function check(form,exe)
{
	if(exe)
	{
		
		var contents={};	
		var x=document.getElementsByName('answer');
		for(var i=0;i<x.length;i++)
		{
			if(x[i].checked)
			contents['answer']=x[i].value;
			break;
		}
		var y=new Array("textarea","text","number");
		for(var i=0;i<form.length;i++)
		{
		if(y.has(form[i].type))
			contents[form[i].name]=form[i].value;	
		}
		if(morc && morc.verify())
		{contents['media']=morc;
		contents=JSON.stringify(contents);
		contents="content="+contents;
		ajax(contents,"upload.php",function(x){alert(x)});
	}
	else
	alert("please Select a Image");
	}
	return false;
}

Array.prototype.has=function(v){
for (i=0; i<this.length; i++){
if (this[i]==v) return true;
}
return false;
}