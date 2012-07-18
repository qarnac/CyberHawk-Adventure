/**
 * @author sabareesh kkanan subramani
 * This script is used by index.php this helps in login the user
 */
 
 var PHP_FOLDER_LOCATION="http://ouyangdev.cs.csusm.edu/cyberhawk/quest/php/";
//passes user info to server to check credentials
function verify()
{
	var user=$('username').value;
	var pwd=$('password').value;
	var who=$('who').value;
	var data="user="+user+"&pwd="+pwd+"&who="+who;
	ajax(data, PHP_FOLDER_LOCATION + "login.php",check);
	return false;
}
function $(x)
{return document.getElementById(x);}
//ajax implementation POST
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
//reacts according to the verification of credentials. if correct just refresh the page that will redirect to different page which has user functionalities
function check(x)
{
	if(x=="true")
	window.location.reload();
	else if(x=="false")
	alert("Username or Password is not correct");
	}
