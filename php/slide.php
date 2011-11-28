
<?php 
 //connects to databse and retrives data from table
if(!$dbconnect = mysql_connect('localhost', 'root', 'wingrider')) {
   echo "Connection failed to the host 'localhost'.";
   exit;
} // if
if (!mysql_select_db('cyberhawk')) {
   echo "Cannot connect to database 'test'";
   exit;
} // if
$qid=$_REQUEST['qid'];//get realltime question id

$query = "SELECT * FROM slides where qid='$qid'";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	// void when page refresh

	var photoTitles = [
				  <?php echo $result['titles'];?>];
	var photoCount = photoTitles.length;
	
	var id = 0;
	var auto = true;
	
	function setNextPhoto()
	{
		id = (++id)%photoCount;
		var path = "<?php echo $result['imagid'];?>"+(id+1)+".jpg";
		document.getElementById("photo").src=path;
		document.getElementById("photo_title").innerHTML = photoTitles[id];
	}
	
	function setPrevPhoto()
	{
		--id;
		if (id < 0) id = photoCount-1;
		var path = "<?php echo $result['imagid'];?>"+(id+1)+".jpg";
		document.getElementById("photo").src=path;
		document.getElementById("photo_title").innerHTML = photoTitles[id];
	}
	
	function autoDemo() {
		if (auto) {
			setNextPhoto();
		}
		setTimeout("autoDemo();", 2000);
	}
	
	function startAuto() {
		auto = true;
	}
	
	function stopAuto() {
		auto = false;
	}

	</script>
</head>
<body onLoad="setTimeout('autoDemo();', 2000)">
<center>
<h3><?php echo $result['title'];?></h3>
<br />
<h3 id="photo_title"><?php echo $result['description'];?></h3>
<img id="photo" src="<?php echo $result['imagid']."1.jpg";?>" class="large" /> <br />
<button onClick="stopAuto();setPrevPhoto();">Prev</button>
<button onClick="stopAuto();setNextPhoto();">Next</button>
<button onClick="startAuto();">Start rolling</button>
<button onClick="stopAuto();">Stop rolling</button>
</center>
</body>
