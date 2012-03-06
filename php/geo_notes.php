
<?php 
/*About
This file used to retive the notes from dbase and print it out to the user.
This also has an additional functionality which allows the user to save this notes into their bag.


*/
include "credentials.php";  //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];		//pulls question id from the url 

  
$query = "SELECT * FROM notes where qid=$qid"; 
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);

?>
<head>
	<link rel=stylesheet href="../style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;
		
	/* currentPage is used to set and verify the status of the current page.
	 if the value of currrent page = 1 means user havent succedded the activity and its havent been invoked yet,where 2 means activity is already beeen completed 
	*/
	var currentPage = <?php echo $result['currentpage'];?>;  	//default currentpage status which is 1 by default 
	var reward=<?php echo $result['reward'];?>;		// reward score
	
		function saveBook() {
			if ( marker.getPageStatus(currentPage) != 2 ) {
				marker.setPageStatus(currentPage, 2);				
				window.parent.appendMessageToInfoBox("<?php echo $result['appreciate'];?>", "yes"); //adds a comment to the page when the activity is completed
				window.parent.task.reward(reward);			// provides the reward score to the user
				marker.addScore(reward);
				marker.setPageStatus(currentPage, 2);	
				window.parent.updatePageBar(currentPage);	// when the activity is suceeded this changes status of the activity to completed		
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
        <? if($result['type']=="geo") { ?>
		<center><button onClick="saveBook();">Save to my bag</button></center>
        <? }else { ?>
        
        <? }  ?>
        
	</td>
</tr>
</table>

</body>
