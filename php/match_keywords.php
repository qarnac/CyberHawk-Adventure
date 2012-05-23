
<?php 
/*About
This is similar to imageq but instead of image this has a video that related to the activity.
*/


include "credentials.php";	 //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];		//pulls question id from the url 
$query = "SELECT * FROM match_keywords where qid='$qid'";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);

?>
<head>
	<link rel=stylesheet href="../style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;
	// hardcode page 2
	var currentPage = <?php echo $result['currentpage'];?> ;	
	/* currentPage is used to set and verify the status of the current page.
	 if the value of currrent page = 1 means user havent succedded the activity and its havent been invoked yet,where 2 means activity is already beeen completed 
	*/
	var reward= <?php echo $result['reward'];?>;	//reward score

	var solvedThisTime = false;
	var used = new Array();
	var keywords = new Array(<?php echo $result['keys'];?>);
	for(var i =0;i<keywords.length;i++)
	used[i]=0;
	

	function verifyAnswer()
	{
		

		var keywordFound = 0;	
		
			var answer = document.getElementById("textAnswer").value.toLowerCase();
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
   <? if($result['media']=="image.php")
	{ ?>
   <div id="img"><img src="<?php echo $result['media']."?id=". $result['mid'];?>" class="medium" align="center"/> </div>
    <? }else if($result['media']=="slideshow.php") { ?> <iframe src="<?php echo $result['media']."?id=". $result['mid'];?>" height="350" width="450" seamless></iframe>
		 <? }else{ ?>
         <iframe src="<?php echo $result['media']."?id=". $result['mid'];?>" height="280" width="450" seamless></iframe>
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
			
					
				
						var content = '<textarea id="textAnswer" rows="1" cols="50"> </textarea><br/><button type="button" onClick="verifyAnswer()">submit</button>';document.write(content);
					
					
					
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

