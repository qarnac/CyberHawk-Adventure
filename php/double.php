
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

$query = "SELECT * FROM dualslide where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?><head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	// void when page refresh
	
	
	var marker = window.parent.task.closestMarker;	
	var currentPage = <?php echo $result['currentpage'];?>;		
	if ( marker.getPageStatus(currentPage) != 2 ) {
		marker.setPageStatus(currentPage, 2);
		window.parent.updatePageBar(currentPage);
	}

	var id = 0;
	function showOutline()
	{
				id = !id;
		var path;
		if ( id == 0 ) path = "<?php echo $result['img1'];?>";	
		if ( id == 1 ) path = "<?php echo $result['img2'];?>";	
		document.getElementById("photo").src=path;
	}

	</script>
</head>

<center>
<h3> <?php echo $result['title'];?>	 </h3>
<?php echo $result['description'];?>	
<br />
<h3> <?php echo $result['title2'];?> </h3>
<img id="photo" src="<?php echo $result['img1'];?>" class="large" onclick="showOutline();"/> <br />

</center>

