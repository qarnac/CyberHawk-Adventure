
<?php 
 //connects to databse and retrives data from table
include "credentials.php";	 //dbase credentials
if(!$dbconnect = mysql_connect($host, $user, $pass)) {	 //connects to dbase host
   echo "Connection failed to the host";
   exit;
} // if
if (!mysql_select_db('cyberhawk')) {	//selects dbase
   echo "Cannot connect to database 'test'";
   exit;
} // if
$qid=$_REQUEST['qid'];//pulls question id from the url 

$query = "SELECT * FROM multiple where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="../../style/main.css" type="text/css" />

	<script type="text/javascript">
	function video()
	{
					document.getElementById("content").innerHTML="<iframe src='"+alt+"' height='230' width='450'></iframe>" ;	

	}
	var rewardScore = <?php echo $result['reward'];?>;//assigns value to reward score from database
	var correctAnswer = "<?php echo $result['answer'] ?>";//assigns the correct answer 

	var marker = window.parent.task.closestMarker;
	// hardcode page 1
	var currentPage = <?php echo $result['currentpage'];?>;//assigns what is current page . the arrangement of page
	var alt="<?php echo $result['alt'];?>";

	function verifyAnswer()
	{
		var radioButtons = document.getElementsByName("select");
		if ( marker.getPageStatus(currentPage) != 2 ) {
			for (var i = 0; i < radioButtons.length; i++) {
				if ( radioButtons[i].checked ) {
					//alert(radioButtons[i].value);	
					if ( radioButtons[i].value == correctAnswer ) {
						window.parent.appendMessageToInfoBox("Correct! <?php echo $result[$result['answer']]?> . [+ " + rewardScore + " points]", "yes");//retrives the answer and prints it
						window.parent.task.reward(rewardScore);
						marker.addScore(rewardScore);
						marker.setPageStatus(currentPage, 2);
						window.parent.updatePageBar(currentPage);
						window.location.reload();
					} else {
						window.parent.appendMessageToInfoBox("You are getting closer. Try again! ", "hint");
						radioButtons[i].parentNode.innerHTML = "";
						rewardScore -=<?php echo $result['red'];?>;
						if(radioButtons.length<2)
						{
						marker.setPageStatus(currentPage, 2);
						window.parent.updatePageBar(currentPage);
						window.parent.appendMessageToInfoBox(" <?php echo $result['hint'];?>", "hint");
						window.location.reload();
						
						
						}
					}
					break;
				}
			}
		} else {
			window.parent.appendMessageToInfoBox("<?php echo $result['hint']?>", "hint");
	

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
	<td colspan="2" align="center">	
    <div id ="content">	
    <? if($result['type']=="video")
	{ ?>
    <iframe src="<?php echo $result['img'];?>" height="230" width="450"></iframe>
    <? }else if($result['type']=="img") { ?>
		<div id="img"><img src="<?php echo $result['img'];?>" class="medium" align="center"/> </div>
        <? } ?></div>
	</td>
</tr>
<tr>
	<td width="2%"/>
	 
	<td>
		<p>
        <?php echo $result['description'];//retrives description from db
		?>	</p>
		<script type="text/javascript">
			if ( marker.getPageStatus(currentPage) != 2 ) {		
				
			var content = "<form action='' method=''> \<div align='left' style='font-size:12px'> \
						<?php //all the coices are retrived from db and radio buttons are created
						$array = array('a', 'b', 'c','d', 'e');
foreach ($array as $i => $value)
 {if($result[$value]!="")
	    echo "<span id='select$value' > \<input type='RADIO' name='select' value='$value'>\ $value. $result[$value] <br /> </span>\ "; 

}
				?>
					</div> \<input type='BUTTON' onclick='verifyAnswer();' value='Submit' /> \</form> \	";	
		
				document.write(content);
			} else  {
					if(alt.length>3)
				{
				
				document.write("<center><input type='BUTTON' onclick='video();' value='Video' /></center>");
				}
				var content = '<br/> \
				<center> \
					<?php
					 echo $result[$result['answer']];?>  \
				</center>';
				document.write(content);
			
			}
		</script>
	</td>
</tr>
</table>
</body>