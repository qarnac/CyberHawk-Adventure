<?php
// If the user is logged in, loads the correct html page for that user.  Otherwise, it shows the log in form.
include dirname(__FILE__) . '/html/header.html';
session_start();


if(isset($_SESSION['login'])==true )
{
	if($_SESSION['who']=='students')
		include dirname(__FILE__) . '/html/user.html';
	else if($_SESSION['who']=='teacher')
		include dirname(__FILE__) . '/html/teacher.html';
}
// else give them the public view.
else {
include dirname(__FILE__) . '/html/index.html';
}
?>

</html>
