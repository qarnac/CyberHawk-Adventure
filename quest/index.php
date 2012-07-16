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
// else give them the log in form.
else {
include dirname(__FILE__) . '/html/log_in_form.html';
}
?>
<!-- I don't really know why there's closing tags down here, let alone an include.
I think this is something that I'd want to get rid of soon, but i'm just not sure where I'd move it to. -->
    	</div>

		
		</div>
		<script src="js/script.js"></script>
	</body>
</html>
