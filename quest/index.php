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
include dirname(__FILE__) . '/html/log_in_form.html';
}
?>
<!-- Don't really know why the div's get closed down here.  Will look into changing this later.  But for now, the div and the script are included down here. -->
    	</div>

		
		</div>
		<script src="js/script.js"></script>
	</body>
</html>
