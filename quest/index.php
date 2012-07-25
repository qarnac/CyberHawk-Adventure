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
// else give them the log in form.
else {
include dirname(__FILE__) . '/html/log_in_form.html';
}
?>
<!-- Don't really know why the div's get closed down here.  Will look into changing this later.  But for now, the div and the script are included down here. -->
<!-- I think this is something that I'd want to get rid of soon, but i'm just not sure where I'd move it to. -->
    	</div>
		</div>
		<script src="js/script.js"></script>
	</body>
</html>
