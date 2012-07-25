/*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * verifies all the form data
 * submits the form data and image data to server
 */
/*
var multiple='<? echo $metaar[0]['content'];?>';
var hunts=JSON.parse('<? echo $hunts; ?>');
for(x=0;x<hunts.length;x++)
$('selecthunt').options[$('selecthunt').options.length]=new Option(hunts[x]['title'],x);
*/
var hunts;
var multiple;
function wscript_init(x) {
	hunts = JSON.parse(x);
	$('username').innerHTML=hunts[0];

	multiple=hunts[2][0].content;
	hunts=hunts[1];
	for ( x = 0; x < hunts.length; x++)
		$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], x);
		
}					
var uniq=Math.floor((Math.random()*100)+1);
//shortcut to get object with their id
function $(x) {return document.getElementById(x);}

//ajax POST request
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
			if (xmlhttp.responseText == 'sessionfail')
					window.location = '../';
		callback(xmlhttp.responseText);
		}
	  }
	xmlhttp.open("POST",url,true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(data);
}
//this function invoked when student selects a hunt
//function huntsel(x)
function huntselection(x)
{ 
	var hunt=hunts[x];
	// TODO convert huntboundary to a google maps bounds object to delete georect
	huntboundary=new georect(new latlng(hunt['minlat'],hunt['minlng']),new latlng(hunt['maxlat'],hunt['maxlng']));
	$('activity').innerHTML=multiple;
	starter();
}
//has the boundary information of selected hunt
var huntboundary;
//invoked when student submits the form .checks for validity of data and submits the information through ajax
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
		contents['huntid']=hunts[0]['id'];
		contents=JSON.stringify(contents);
		contents="content="+contents;
	
			ajax(contents, PHP_FOLDER_LOCATON + "user_upload.php", function(x) {
				if (x == "true")
					alert("sucess");
				else
					alert(x);
					
			}); 

	}
	else
	alert("please Select a Image");
	}
	return false;
}
// a custom prototype thats been added to array object to find existence of particular value
Array.prototype.has=function(v){
	for (i=0; i<this.length; i++){
		if (this[i]==v) return true;
	}
	return false;
}
