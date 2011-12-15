
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

$query = "SELECT * FROM views where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?><head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;	
	var currentPage = <?php echo $result['currentpage'];?> ;		
	if ( marker.getPageStatus(currentPage) != 2 ) {
		marker.setPageStatus(currentPage, 2);
		window.parent.updatePageBar(currentPage);
	}
	</script>
</head>

<center>
<h3> <?php echo $result['title'];?>  </h3>
<img src="<?php echo $result['imgsrc'];?> " class="<?php echo $result['class'];?> " />
<br />
<?php echo $result['description'];?> 
</center>
