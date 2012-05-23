
<?php 
 //connects to databse and retrives data from table
include "credentials.php";	 //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];//pulls question id from the url 

$query = "SELECT * FROM justview where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?><head>
	<link rel=stylesheet href="../style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;	
	var currentPage = <?php echo $result['currentpage'];?> ;		
	
	
	</script>
</head>

<center>
<h3> <?php echo $result['title'];?>  </h3>
 <? if($result['media']=="image.php")
	{ ?>
   <div id="img"><img src="<?php echo $result['media']."?id=". $result['mid'];?>" class="medium" align="center"/> </div>
    <? }else if($result['media']=="slideshow.php") { ?> <iframe src="<?php echo $result['media']."?id=". $result['mid'];?>" height="350" width="450" seamless></iframe>
		 <? }else{ ?>
         <iframe src="<?php echo $result['media']."?id=". $result['mid'];?>" height="280" width="450" seamless></iframe>
        <? } ?>
        <br />
<?php echo $result['description'];?> 
</center>
