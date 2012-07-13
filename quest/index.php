<!----
	Login Page 
	Checks for a valid session if exist redirects to welcome.php else ask user to login.
	---->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />

		<!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
		Remove this if you use the .htaccess -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

		<title>Welcome</title>
		<meta name="description" content="" />
		<meta name="author" content="sabareesh kkanan subramani" />

		<meta name="viewport" content="initial-scale=1.0" />

		<!-- Replace favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
		<link rel="shortcut icon" href="/favicon.ico" />
		<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
		<link rel="stylesheet" type="text/css" href="style/style.css" />

	</head>

	<body>
		<div>
			<header>
				<h1>Cyber Scavenger</h1>
			</header>
		<div id="main" role="main">
<?php

session_start();
// If the user is already logged in, redirect them to their appropriate form page
if(isset($_SESSION['login'])==true )
{
	if($_SESSION['who']=='students')
		header("Location: user/");
	else if($_SESSION['who']=='teacher')
		header("Location: admin/");
}
// Otherwise, print the login page
else {
	displayLoginForm();
}

function displayLoginForm() {
	$form='<form id="login" onsubmit="return verify();">
    <h1>Log In</h1>
    <fieldset id="inputs">
        <input id="username" type="text" placeholder="Username" autofocus required>
        <input id="password" type="password" placeholder="Password" required>
        <select id="who">
         <option value="students">Student</option>
  <option value="teacher">Teacher</option>
</select>
    </fieldset>
    <fieldset id="actions">
        <input type="submit" id="submit" value="Log in">
        <a href="">Forgot your password?</a>
    </fieldset>
</form>';
	echo $form;
}
?>
    	</div>
		</div>
		<script src="js/script.js"></script>
	</body>
</html>
