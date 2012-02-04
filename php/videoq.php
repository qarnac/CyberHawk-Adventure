
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
$query = "SELECT * FROM videoq where qid='$qid'";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
if($result['type']=="matchf")
{
	$qid=$result['eid'];
	$query="SELECT * FROM ".$result['type'] ." where eid='$qid'";
	$ques=mysql_query($query);
	$result1=mysql_fetch_array($ques);
}
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
		

		var keywordFound = 0;	
		<?php if($result['type']=="matchf")
		{
			?>
			var user,k=0;
		var ans=new Array(<?php echo $result1['answer']; ?>);
		for(var i=0;i<ans.length;i++)
		{
			user=document.getElementById("m"+i).value;
			
			if(ans[i]==user)
			{
				
				k++;
			}
		}

		if(k==i)
		{
		keywordFound=1;
		}
		
		<?php } else
		{
			?>
			var answer = document.getElementById("textAnswer").value.toLowerCase();
		for (var i = 0; i < keywords.length; i++) {
			if ( answer.indexOf(keywords[i]) != -1 && used[i]==0 ) {
				keywordFound++;
				used[i] = 1;
			}
		}
		
		<? } ?>
		
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
  <div id="obj">
        <iframe height="260" width="425" frameborder="0"   src="<? echo $result['vsrc'];?>"></iframe>
      </div>
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
			
					
					<? if($result['type']=="matchf")
					{ ?>
					
					document.write('<div id="rew"></br> </br><button type="button" onClick="spage()" >Reward </button></div>');
				
					
					<? }else {
						?>
						var content = '<textarea id="textAnswer" rows="1" cols="50"> </textarea><br/><button type="button" onClick="verifyAnswer()">submit</button>';document.write(content);
					<? } ?>
					
					
				} else {
					document.write("<?php echo $result['appreciate'];?>");
				}
						function spage()
					{
						document.getElementById("rew").innerHTML=""; 
					var matcha = new Array(<?php echo $result1['matcha'];?>);
					var matchb = new Array(<?php echo $result1['matchb'];?>);
						var content="<table border='8'>";
					if(matcha.length==matchb.length)
					{
					for(var i=0;i<matcha.length;i++)
					{
					content =content+"<tr><td>"+(i+1)+"."+matcha[i]+"</td><td width='10%' align='center'> <input type='text' size='1' id='m"+i+"'/> </td><td>"+matchb[i]+"</td></tr>";
					}
					content=content+"</table></br><p>Fill in the text box with the correct number</p></br><button type='button' onClick='verifyAnswer()'>submit</button><button type='button' onClick='window.location.reload()'>Video</button>";
					
					}
					document.getElementById("obj").innerHTML=content;
					}
			</script>			
		</center>
        
		</form>
	</td>
</tr>
</table>
</body>

