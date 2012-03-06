
<?php 
/*
This program adds a activity that asks question to the user with the related image which is displayed.

*/
include "credentials.php";	 //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];//pulls question id from the url 

// retives a row that matches qid in table image q
$query = "SELECT * FROM imageq where qid=$qid";  
$ques = mysql_query($query, $dbconnect);	//as question id is distinct it pulls only one row from table.
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="../style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;
	// hardcode page 1
	/* currentPage is used to set and verify the status of the current page.
	 if the value of currrent page = 1 means user havent succedded the activity and its havent been invoked yet,where 2 means activity is already beeen completed 
	*/
	var currentPage = <?php echo $result['currentpage'];?> ;//default currentpage status which is 1 by default 
	var reward= <?php echo $result['reward'];?>;			// reward score
	var check=0,cc=0,k=0;	//check is used to keep track whether the answer is correct .
	// here we are dealing with two types of question. One is just one answer and second one is they have arrange the answer in an order.
	function verifyAnswer()
	{
		var answer = document.getElementById("textAnswer").value.toUpperCase();
answer=" "+answer;
		if ( marker.getPageStatus(currentPage) != 2 ) {
	<? if($result['type']=='order'){ ?> // this deals with the answer that should be in particular order
			
				var ans=new Array(<?php echo $result['c1'];?>)
			
			for(var i=0;i<ans.length;i++)
			{
				if(answer.indexOf(ans[i])>k)//k stores the last correctly ordered word index
				{
				k=answer.indexOf(ans[i]);
				cc++; // keeps track of number of rightly ordered words
				}
				
			}
			
			if(cc==i)
			check=1;
			<? } else { ?>
			
			if ( answer.indexOf("<?php echo $result['c1'];?>") != -1 && answer.indexOf("<?php echo $result['c2'];?>") != -1 ) {check=1;}
<? } ?>
			// hardcode page number 2, we know this is the page 2 of the marker
			// status 2 means question has been solved
			if(check==1)
			{
				window.parent.appendMessageToInfoBox("Nice work.  <?php echo $result['appreciate'];?>. [+50 points]", "yes");
				window.parent.task.reward(reward);
				marker.addScore(reward);
				marker.setPageStatus(currentPage, 2);
				window.parent.updatePageBar(currentPage);
				
			} else 
				window.parent.appendMessageToInfoBox("Good try.  <?php echo $result['hint'];?>.", "hint");
		} else {
			window.parent.appendMessageToInfoBox("You've answered this quesiton", "hint");
		}
	}

	</script>
</head>

<body>
<h2 align="center"><?php echo $result['title'];?></h2>
<table border="0">
<tr height="10px" valign="middle">
</tr>
<tr>
	<td colspan="2" align="center">		
		<img src=" <?php echo $result['image'];?>" class="<?php echo $result['class'];?>" align="center"/>
	</td>
</tr>
<tr>
	<td width="2%"/>
	 
	<td>
		<br/>
		<p>
		 <?php echo $result['description'];?>
		</p>
		<br/>
		<form>
		<center>
			<script type="text/javascript">
				if ( marker.getPageStatus(currentPage) != 2 ) {
					var content = '<input type="TEXT" id="textAnswer" id="textAnswer" size="20"/>&nbsp;&nbsp;<button type="button" onclick="verifyAnswer()">submit</button>';
					document.write(content);
				} else {
					document.write(" <?php echo $result['appreciate'];?>");
				}
			</script>
		</center>
		</form>
	</td>
</tr>
</table>
</body>



