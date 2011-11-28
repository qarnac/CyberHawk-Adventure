
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

$query = "SELECT * FROM multiple where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="../../style/main.css" type="text/css" />

	<script type="text/javascript">
	var rewardScore = <?php echo $result['reward'];?>;//assigns value to reward score from database
	var correctAnswer = "<?php echo $result['answer'] ?>";//assigns the correct answer 

	var marker = window.parent.task.closestMarker;
	// hardcode page 1
	var currentPage = <?php echo $result['currentpage'];?>;//assigns what is current page . the arrangement of page

	function verifyAnswer()
	{
		var radioButtons = document.getElementsByName("select");
		if ( marker.getPageStatus(currentPage) != 2) {
			for (var i = 0; i < radioButtons.length; i++) {
				if ( radioButtons[i].checked ) {
					//alert(radioButtons[i].value);	
					if ( radioButtons[i].value == correctAnswer ) {
						window.parent.appendMessageToInfoBox("Correct! <?php echo $result[$result['answer']]?> . [+ " + rewardScore + " points]", "yes");//retrives the answer and prints it
						window.parent.task.reward(rewardScore);
						marker.addScore(rewardScore);
						marker.setPageStatus(currentPage, 2);
						window.parent.updatePageBar(currentPage);
					} else {
						window.parent.appendMessageToInfoBox("You are getting closer. Try again! ", "hint");
						radioButtons[i].parentNode.innerHTML = "";
						rewardScore -= 25;
					}
					break;
				}
			}
		} else {
			window.parent.appendMessageToInfoBox("You've answered this question", "hint");
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
		<img src="<?php echo $result['img'];?>" class="medium" align="center"/> 
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
			} else {
				var content = '<br/> \
				<center> \
					<?php echo $result[$result['answer']]?>  \
				</center>';
				document.write(content);			
			}
		</script>
	</td>
</tr>
</table>
</body>