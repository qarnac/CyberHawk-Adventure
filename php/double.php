
<?php 
 /*About
 This double.php creates a html page that a image which can be changed by clciking on it,actually it switches between two images. 
 To its addition it also has title ,subtitle,description which is also pulled from dbase.
 */
 
include "credentials.php";  //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];		//pulls question id from the url 

$query = "SELECT * FROM dualslide where qid=$qid";  
$ques = mysql_query($query, $dbconnect);			//as question id is distinct it pulls only one row from table.
$result=mysql_fetch_array($ques);	
?><head>
	<link rel=stylesheet href="../style/main.css" type="text/css" />
	<script type="text/javascript">
	
	var marker = window.parent.task.closestMarker;	
	
	/* currentPage is used to set and verify the status of the current page.
	 if the value of currrent page = 1 means user havent succedded the activity and its havent been invoked yet,where 2 means activity is already beeen completed 
	*/
	var currentPage = <?php echo $result['currentpage'];?>;		//default currentpage status which is 1 by default
	if ( marker.getPageStatus(currentPage) != 2 ) {
		marker.setPageStatus(currentPage, 2);
		window.parent.updatePageBar(currentPage);				// when the activity is suceeded this changes status of the activity to completed
	}

	var id = 0;				 //this variable is used to switch images onclick .
	function showOutline()
	{
				id = !id;	// id value is being changed whenever click even occurs on the image
		var path;			//used to store the path of image
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

