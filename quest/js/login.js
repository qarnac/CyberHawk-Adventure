/**
 * @author sabareesh kkanan subramani
 * This script is used by index.php this helps in login the user
 */

//passes user info to server to check credentials
function verify()
{
	var user=$('username').value;
	var pwd=$('password').value;
	var who=$('who').value;
	var parentHunt=0;
	var data="user="+user+"&pwd="+pwd+"&who="+who+"&parent=" +parentHunt;
	ajax(data, GLOBALS.PHP_FOLDER_LOCATION + "login.php",verifyLogin);
	return false;
}

function $(x){return document.getElementById(x);}

//reacts according to the verification of credentials. if correct just refresh the page that will redirect to different page which has user functionalities
function verifyLogin(x)
{
	if(x=="true")
	window.location.reload();
	else if(x=="false")
	alert("Username or Password is not correct");
}
