
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

$query = "SELECT * FROM notes where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;
	// we know this is the 1st page of the marker, so we just hardcode 1 here
	// status 2 means the problem is solved
	var currentPage = <?php echo $result['currentpage'];?>;
	var reward=<?php echo $result['reward'];?>;
	
		function saveBook() {
			if ( marker.getPageStatus(currentPage) != 2 ) {
				marker.setPageStatus(currentPage, 2);				
				window.parent.appendMessageToInfoBox("<?php echo $result['appreciate'];?>", "yes");
				window.parent.task.reward(reward);
				marker.addScore(reward);
				marker.setPageStatus(currentPage, 2);	
				window.parent.updatePageBar(currentPage);			
				var content = document.getElementById("note_content").innerHTML;
				
				window.parent.task.saveItemToBag("Geo note", "", content);	
			} else {
				window.parent.appendMessageToInfoBox("The geo note has been saved to your bag already.", "hint");
			}
		}
	</script>
	
</head>

<body>
<table border="0">
<tr height="20px" valign="middle">
	<th colspan="2"><?php echo $result['title'];?></th>
</tr>

<tr>
	<td width="2%"/>
	 
	<td>
		<br/>
		<div id='note_content'>
<?php echo $result['notes'];?>
		</div>
		<br />
		<center><button onClick="saveBook();">Save to my bag</button></center>
	</td>
</tr>
</table>

</body>
