
<?php 
 //connects to databse and retrives data from table
include "credentials.php";	 //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];//pulls question id from the url 

$query = "SELECT * FROM views where qid=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?><head>
	<link rel=stylesheet href="style/main.css" type="text/css" />
	<script type="text/javascript">
	var marker = window.parent.task.closestMarker;	
	var currentPage = <?php echo $result['currentpage'];?> ;		
	
	
	</script>
</head>

<center>
<h3> <?php echo $result['title'];?>  </h3>
<? if($result['type']=="video"){  ?>
<iframe src="<?php echo $result['imgsrc'];?>" height="250" width="450"></iframe>
<? } else if($result['type']=="img") { ?>
<img src="<?php echo $result['imgsrc'];?> " class="<?php echo $result['class'];?> " />
<? }else { ?>
<table>
<tr>
<td>
<img src="<?php echo $result['imgsrc'];?> " class="embedded" />
</td>
<td>
<script type="text/javascript">
var ques=new Array(<? echo $result['question']; ?>);

var ans=new Array(<? echo $result['answer']; ?>);
if(ans.length==ques.length)
{
	var cont="";
	for(var i=0;i<ans.length;i++)
	{
		cont=cont+ques[i]+"</br>";
	}
	document.write(cont+"</td><td>");
	cont="";
	for(var i=0;i<ans.length;i++)
	{
		cont=cont+"<input type='text' id='z"+i+"' size='1'/><br/>";
	}
	document.write(cont);
}
function verify()
{
	if ( marker.getPageStatus(currentPage) != 2 ) {
	
	var t,x=0;;
	for(var i=0;i<ans.length;i++)
	{
		t=document.getElementById("z"+i).value.toUpperCase();
		if(t==ans[i])
		x=x+10;
	}
	alert(x);
	window.parent.appendMessageToInfoBox(" Your Score . [+ " + x + " points]", "yes");//retrives the answer and prints it
						window.parent.task.reward(x);
						marker.addScore(x);
						marker.setPageStatus(currentPage, 2);
						window.parent.updatePageBar(currentPage);
						window.location.reload();
	}
}


</script>
</td>

</tr>
</table>
<input type="button" value="Submit" onclick="verify();" />
<? } ?>
<br />
<?php echo $result['description'];?> 
</center>
