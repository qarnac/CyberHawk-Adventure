

<?php 
 //connects to databse and retrives data from table
include "credentials.php";
if(!$dbconnect = mysql_connect($host, $user, $pass)) {
   echo "Connection failed to the host";
   exit;
} // if
if (!mysql_select_db('cyberhawk')) {
   echo "Cannot connect to database 'test'";
   exit;
} // if
$qid=$_REQUEST['qid'];//get realltime question id

$query = "SELECT * FROM mletters where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
<link rel=stylesheet href="style/main.css" type="text/css" />
<style type="text/css">
	#letter {font-size: 200%}
</style>
<script type="text/javascript">
	var marker = window.parent.task.closestMarker;
	//hardcode page 1 in the getPageStatus call because the page does not know its order related to other pages
	var currPage = <?php echo $result['currentpage'];?>;
var reward = <?php echo $result['reward'];?>;
	//Ouyang: Randomize the order of letters. Automatically called every time the page is refreshed.
	var oriletters= "<?php echo $result['origletters'];?>";
	
	var letters =oriletters.split('');

	for (var i = 0; i < letters.length; i++) {
		var pos1 = parseInt((letters.length)*Math.random());
		var pos2 = parseInt((letters.length)*Math.random());
		var temp = letters[pos1];
		letters[pos1] = letters[pos2];
		letters[pos2] = temp;
	}
	
	function verifyAnswer()
	{
		//Ouyang: window.parent refer to index.html
		var answer = document.getElementById("textAnswer").value.toUpperCase();
		// status 3 means the quesiton has been solved and a new question is set for player		
		// similar to status 2, but changed a different icon in tab bar
		if ( marker.getPageStatus(currPage) != 3) {
			if ( answer == oriletters ) {
				window.parent.appendMessageToInfoBox("Nice Work.  <?php echo $result['appreciate'];?>;!", "yes");
				marker.setPageStatus(currPage, 3);
				marker.addScore(reward);
				
				window.parent.task.reward(reward);
				window.parent.updatePageBar(currPage);
				window.location.href=window.location.href;
//				alert("Nice Work.  It is Igneous Rocks! A new question is prepared for you.");				
			} else {
				window.parent.appendMessageToInfoBox(" You are very close. Try again.", "hint");
				window.location.href=window.location.href;
			}
		} else {
			window.parent.appendMessageToInfoBox("You've answered this question", "hint");
		}
	}
	
	function nextQuestion() {
		window.parent.document.getElementById("myframe").src="<?php echo $result['nextpage'];?>";
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
		<img src="<?php echo $result['image'];?>" class="embedded" align="center"/>
	</td>
</tr>
<tr>
	<td width="2%"/>
	 
	<td>
		<br/>
		<p>
<?php echo $result['description'];?>
			<br />
		</p>
		<div id="letter" align="center">
			<script type="text/javascript">
				//Ouyang: Display the permutated letters
				if ( marker.getPageStatus(currPage) < 2 ) {
					for (var i = 0; i < letters.length; i++) {
						document.write(letters[i] + " ");
					}
				} else {
					document.write('<span style="color:blue">');
					for (var i = 0; i < oriletters.length; i++) {
						document.write(oriletters[i] + " ");
					}				
					document.write('</span>');
				}
			
			</script>
		</div>
		<script type="text/javascript">
			if ( marker.getPageStatus(currPage) < 2 ) {				
				var content = '<br/> \
				<p> \
					Click on the "Submit" button when you are done. \
				</p> \
				<div id="answerBoard"> \
				<form> \
				<center> \
					<input type="TEXT" id="textAnswer" /> &nbsp;&nbsp; \
					<button type="button" onclick="verifyAnswer();">Submit</button> \
				</center> \
				</form> \
				</div> \
				';
				document.write(content);
			} else {
				var content = '<br/> \
				<center> \
					<button type="button" onclick="nextQuestion();">Next question</button> \
				</center>';
				document.write(content);			
			}
		</script>
	</td>
</tr>
</table>

</body>



