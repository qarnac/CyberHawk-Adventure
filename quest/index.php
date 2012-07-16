<!----
	Login Page 
	Checks for a valid session if exist redirects to welcome.php else ask user to login.
	---->
<?php
include dirname(__FILE__) . '/html/header.html';
session_start();
if(isset($_SESSION['login'])==true )
{
	if($_SESSION['who']=='students')
	header("Location: user/");
	else if($_SESSION['who']=='teacher')
	header("Location: admin/");
}
else {
form();
}
function form()
{$form='<form id="login" onsubmit="return verify();">
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
echo $form;}



?>

    	</div>

		
		</div>
		<script src="js/script.js"></script>
	</body>
</html>
