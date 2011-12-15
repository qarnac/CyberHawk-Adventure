
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
$query = "SELECT * FROM videoq where qid='$qid'";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;
	// hardcode page 2
	var currentPage = <?php echo $result['currentpage'];?> ;
	var reward= <?php echo $result['reward'];?>;

	var solvedThisTime = false;
	var used = new Array();
	var keywords = new Array(<?php echo $result['keys'];?>);
	for(var i =0;i<keywords.length;i++)
	used[i]=0;
	

	function verifyAnswer()
	{
		var answer = document.getElementById("textAnswer").value.toLowerCase();

		var keywordFound = 0;	
		for (var i = 0; i < keywords.length; i++) {
			if ( answer.indexOf(keywords[i]) != -1 && used[i]==0 ) {
				keywordFound++;
				used[i] = 1;
			}
		}
		
		if ( ((marker.getPageStatus(currentPage) != 2) || (marker.getPageStatus(currentPage)==2 &&
						solvedThisTime==true)) ) {
			if ( keywordFound > 0 ) {
				window.parent.appendMessageToInfoBox("good job<?php echo $result['appreciate'];?>", "yes");
				window.parent.task.reward(reward);
				solvedThisTime = true;
				marker.addScore(reward);
				marker.setPageStatus(currentPage, 2);
				window.parent.updatePageBar(currentPage);	
								window.location.href=window.location.href;
			
			} else {
				//window.parent.task.reward(25);
				window.parent.appendMessageToInfoBox("Good Try. <?php echo $result['hint'];?> ", "hint");
			}
		} else {
			window.parent.appendMessageToInfoBox("You've answered this question.", "hint");
		}
	}

	//document.getElementById("textAnswer").focus();
	</script>
</head>

<body>
<h3 align="center"><?php echo $result['title'];?></h3>
<table border="0">
<tr>
	<td colspan="2" align="center">
    <?php if($result['obj']=="obj"){ ?>
    
		<object width="425" height="250"><param name="movie" value="<?php echo $result['vsrc'];?>"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="<?php echo $result['vsrc'];?>" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="425" height="250"></embed></object><? }else { ?>
        <iframe height="260" width="425" frameborder="0"   src="<? echo $result['vsrc'];?>"></iframe>
        <? } ?>
	</td>
</tr>
<tr>
	<td width="2%"/>
	 
	<td>
		<p>
<?php echo $result['description'];?>
		</p>
		
		<form>
		<center>
			<script type="text/javascript">
				if ( marker.getPageStatus(currentPage) != 2 ) {
					var content = '<textarea id="textAnswer" rows="1" cols="50"> </textarea><br/><button type="button" onclick="verifyAnswer()">submit</button>';
					document.write(content);
				} else {
					document.write("<?php echo $result['appreciate'];?>");
				}
			</script>			
		</center>
		</form>
	</td>
</tr>
</table>
</body>

