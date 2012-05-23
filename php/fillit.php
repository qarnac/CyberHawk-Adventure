
<?php 
 //connects to databse and retrives data from table
include "credentials.php";	 //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];//pulls question id from the url 

$query = "SELECT * FROM fillit where qid=$qid";
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
<table>

<script type="text/javascript">
var ques=new Array(<? echo $result['question']; ?>);

var ans=new Array(<? echo $result['answer']; ?>);
if(ans.length==ques.length)
{
	var cont="";
	for(var i=0;i<ans.length;i++)
	{
		cont=cont+"<tr><td>"+ques[i]+"</td><td><input type='text' id='z"+i+"' size='1'/></td></tr>";
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

</table>

<input type="button" value="Submit" onclick="verify();" />

<br />
<?php echo $result['description'];?> 
</center>
