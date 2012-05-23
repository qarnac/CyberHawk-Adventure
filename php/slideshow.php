
<?php 
/*About
This provides an activity which shows slideshow of images with options to stop rolling,start rolling,next image,previous image;

*/

include "credentials.php";	 //dbase credentials + dbase connection

$id=$_REQUEST['id'];		//pulls question id from the url 

$query = "SELECT * FROM slideshow where id='$id'";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
	<link rel=stylesheet href="../style/main.css" type="text/css" />
    <script type="text/javascript" src="json2.js"></script>
	<script type="text/javascript">
	// void when page refresh
	var photos=JSON.parse('<?php echo $result["imagetitle"];?>');

	var photoCount =photos.slides.length;
	
	var id = 0;			//used for executinf slideshow
	var auto = true;	// Bydefalut slideshow is set to start automatically
	
	function setNextPhoto()
	{
		id = (++id)%photoCount;
		var path = photos.slides[id].loc;
		document.getElementById("photo").src=path;
		document.getElementById("photo_title").innerHTML = photos.slides[id].title;
	}
	function setPrevPhoto()
	{
		--id;
		if (id < 0) id = photoCount-1;
		var path = photos.slides[id].loc;
		document.getElementById("photo").src=path;
		document.getElementById("photo_title").innerHTML =photos.slides[id].title;
	}function autoDemo() {
		if (auto) {
			setNextPhoto();
		}
		setTimeout("autoDemo();", 2000);
	}
	function startAuto() {
		auto = true;
	}	function stopAuto() {
		auto = false;
	}

	</script>
</head>
<body onLoad="document.getElementById('photo').src=photos.slides[0].loc;setTimeout('autoDemo();', 2000)">



<h3 id="photo_title"><script>document.write(photos.slides[0].title)</script></h3>
<img id="photo" src="" alt="Image" class="large" /> <br/><br/>
<input type="button" onClick="stopAuto();setPrevPhoto();" value="Prev"/><input type="button" onClick="stopAuto();setNextPhoto();" value="Next"/>
<input type="button" onClick="startAuto();" value="Start rolling" />
<input type="button" onClick="stopAuto();" value="Stop rolling"/>

</body>
</html>