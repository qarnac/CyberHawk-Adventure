
<?php 
 //connects to databse and retrives data from table
include "credentials.php";  //dbase credentials
if(!$dbconnect = mysql_connect($host, $user, $pass)) {  //connects to dbase host
   echo "Connection failed to the host";
   exit;
} // if
if (!mysql_select_db('cyberhawk')) {//selects dbase
   echo "Cannot connect to database 'test'";
   exit;
} // if
$qid=$_REQUEST['qid'];//get realltime question id

$query = "SELECT * FROM dualslide where qid=$qid";  // sql query to select the table for this activity
$ques = mysql_query($query, $dbconnect);	//sends the query to the server
$result=mysql_fetch_array($ques);	//converts to array of data
?><head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	// void when page refresh
	
	
	var marker = window.parent.task.closestMarker;	
	var currentPage = <?php echo $result['currentpage'];?>;		//current page status
	if ( marker.getPageStatus(currentPage) != 2 ) {
		marker.setPageStatus(currentPage, 2);
		window.parent.updatePageBar(currentPage);
	}

	var id = 0;
	function showOutline()
	{
				id = !id;
		var path;
		if ( id == 0 ) path = "<?php echo $result['img1'];?>";	//loads the img location from dbase
		if ( id == 1 ) path = "<?php echo $result['img2'];?>";	//loads the img location from dbase
		document.getElementById("photo").src=path;
	}

	</script>
</head>

<center> <!---All the information about the activity is loaded -->
<h3> <?php echo $result['title'];?>	 </h3>
<?php echo $result['description'];?>	
<br />
<h3> <?php echo $result['title2'];?> </h3>
<img id="photo" src="<?php echo $result['img1'];?>" class="large" onclick="showOutline();"/> <br />

</center>

