<?php
session_start();
if(isset($_SESSION['login'])==true)
logged();
else {
		header("Location: ../user");
}
function logged()
{
	include '../php/credentials.php';
	
?>
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
				<h4>Welcome <? echo $_SESSION['firstname']; ?> </h4>
				<span>
					<select>
  					<option value="null">Select</option>
  					<?
  					$result=query("SELECT * FROM hunt WHERE tid='".$_SESSION['tid']."'");
  					if(mysql_num_rows($result)>0)
					{
						while($x=mysql_fetch_assoc($result))
						{
							echo '<option value="'.$x['id'].'">'.$x["title"].'</option>';
						}
					}
  					?>
  					
					</select>
				</span>
			</div>
			</div>
			</body>
			</html>
<?
}
function query($x)
{
	$query=$x;
	$result=mysql_query($query) or die(mysql_error());
	return $result;
}
?>