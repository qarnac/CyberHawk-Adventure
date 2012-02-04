
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

$query = "SELECT * FROM imageq where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;
	// hardcode page 1
	var currentPage = <?php echo $result['currentpage'];?> ;
	var reward= <?php echo $result['reward'];?>;
	var check=0,cc=0,k=0;

	function verifyAnswer()
	{
		var answer = document.getElementById("textAnswer").value.toUpperCase();
answer=" "+answer;
		if ( marker.getPageStatus(currentPage) != 2 ) {
	<? if($result['type']=='order'){ ?>
			
				var ans=new Array(<?php echo $result['c1'];?>)
			
			for(var i=0;i<ans.length;i++)
			{
				if(answer.indexOf(ans[i])>k)
				{
				k=answer.indexOf(ans[i]);
				cc++;
				}
				alert(cc+" "+k);
			}
			if(cc==i)
			check=1;
			<? } else { ?>
			
			if ( answer.indexOf("<?php echo $result['c1'];?>") != -1 && answer.indexOf("<?php echo $result['c2'];?>") != -1 ) {chceck=1;}
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



