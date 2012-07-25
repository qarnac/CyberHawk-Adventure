<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />

		<!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
		Remove this if you use the .htaccess -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

		<title>Welcome</title>

		<meta name="viewport" content="initial-scale=1.0" />

		<!-- Replace favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
		<link rel="shortcut icon" href="/favicon.ico" />
		<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
		<link rel="stylesheet" type="text/css" href="style/style.css" />

	</head>
	<!-- What is 'what'? Where is it referenced/what is it used for?  Possibly give 'what' a more specific name? -->
	<body>
		<div id="map_canvas"></div>
		<div id="contents">
		<div>
			<header>
			
				<h1>Cyber Scavenger</h1>
			</header>
		<div id="main" role="main">
				<div style="float: left;width: 200px;font-weight:bold">Welcome <? echo $_SESSION['firstname']; ?> <a href="../php/logout.php">Log out</a></div>
				<div style="float: left;width: 200px;">
					<select onchange="huntselection(this.value)" id="selecthunt">
  					<option value="null">Select</option>
  				
  					
					</select>
				</div>
				<div class="clear"></div>
				<div id="activity"></div><div id='thumb'></div><div id='video'></div>
			</div>
			</div>
			</div>
			<script src="../js/wscript.js"></script>
			<script src="../js/dragdrop.js"></script>
			<script src="../js/media.js"></script>
			<script src="../js/jpegmeta.js"></script>
			<script src="../js/geocompress.js"></script>
			<script src="../js/json2.js"></script>
			<script>var multiple='<? echo $metaar[0]['content'];?>';
					var hunts=JSON.parse('<? echo $hunts; ?>');
					for(x=0;x<hunts.length;x++)
					$('selecthunt').options[$('selecthunt').options.length]=new Option(hunts[x]['title'],x);
				</script>
				 <script type="text/javascript"
      src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDSwGeMX946SO8b3_sZqqAbCzM5eloG-os&sensor=false">
    </script>
			</body>
			</html>


