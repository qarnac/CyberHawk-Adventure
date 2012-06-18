/**
 * @author sabareesh kkanan subramani
 * This script is used by index.php this helps in login the user
 */
function verify()
{
	var user=$('username').value;
	var pwd=$('password').value;
	var data="user="+user+"&pwd="+pwd;
	ajax(data,"login.php",check);
}
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
function check(x)
{
	if(x=="true")
	window.location.reload();
	else
	alert(x);
	}
