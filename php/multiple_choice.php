
<?php 
/*About
this program generates an activity with mltiple chice question and also it will be having a media like a image or video which is related to the question.
*/
include "credentials.php";	 //dbase credentials + dbase connection

$qid=$_REQUEST['qid'];//pulls question id from the url 

$query = "SELECT * FROM stud_activity where id=$qid";
$ques = mysql_query($query, $dbconnect);
$result=mysql_fetch_array($ques);
?>
<head>
	<link rel=stylesheet href="../style/main.css" type="text/css" />
	  <script type="text/javascript" src="json2.js"></script>
	<script type="text/javascript">
	function video()
	{
					document.getElementById("content").innerHTML="<iframe src='"+alt+"' height='230' width='450'></iframe>" ;	

	}
	var rewardScore = 100;		//assigns value to reward score from database
	
	var ans=JSON.parse('<?php echo $result['choices']?>');
	answer=ans.choices;
	ans.correct=function(){
		for(x in this.choices)
		if(this.choices[x].ans=="true")
		return this.choices[x];
	};
	var correctAnswer = ans.correct();	//assigns the correct answer 
	var marker = window.parent.task.closestMarker;
/* currentPage is used to set and verify the status of the current page.
	 if the value of currrent page = 1 means user havent succedded the activity and its havent been invoked yet,where 2 means activity is already beeen completed 
	*/
	var currentPage = 1;	//default currentpage status which is 1 by default 
	// RACKAUCKAS
	// I changed the alternate to be the interesting url, as it is another media location it seemed like it makes sense.
	var alt="<?php echo $result['interesting_url'];?>"; //This has one more media location which is shown after finishing the activity sucessfully

	function verifyAnswer()
	{
		var radioButtons = document.getElementsByName("select");
		if ( marker.getPageStatus(currentPage) != 2 ) {
			for (var i = 0; i < radioButtons.length; i++) {			
				if ( radioButtons[i].checked ) {			
					//alert(radioButtons[i].value);	
					if ( radioButtons[i].value == correctAnswer.choice ) {
						window.parent.appendMessageToInfoBox("Correct! "+ correctAnswer.content+" . [+ " + rewardScore + " points]", "yes");//retrives the answer and prints it
						window.parent.task.reward(rewardScore);
						marker.addScore(rewardScore);
						marker.setPageStatus(currentPage, 2);
						window.parent.updatePageBar(currentPage);
						window.location.reload();
					} else {
						window.parent.appendMessageToInfoBox("You are getting closer. Try again! ", "hint");
						radioButtons[i].parentNode.innerHTML = "";
						rewardScore -=100/radioButtons.length ;		//displays answer after minimum trys
						if(radioButtons.length<2)
						{
						marker.setPageStatus(currentPage, 2);
						window.parent.updatePageBar(currentPage);
						// RACKAUCKAS: Unfortunately, none of the questions will have a hint.
						window.parent.appendMessageToInfoBox("", "hint");
						window.location.reload();
						
						
						}
					}
					break;
				}
			}
		} else {
			window.parent.appendMessageToInfoBox("", "hint");
	

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
    <? if($result['media']=="image.php")
	{ ?>
   <div id="img"><img src="<?php echo $result['media']."?id=". $result['mid'];?>" class="medium" align="center"/> </div>
    <? }else if($result['media']=="slideshow.php") { ?> <iframe src="<?php echo $result['media']."?id=". $result['mid'];?>" height="350" width="450" seamless></iframe>
		 <? }else{ ?>
         <iframe src="<?php echo $result['media']."?id=". $result['mid'];?>" height="280" width="450" seamless></iframe>
        <? } ?>
        </div>
	</td>
</tr>
<tr>
	<td width="2%"/>
	 
	<td>
		
		<script type="text/javascript">
			if ( marker.getPageStatus(currentPage) != 2 ) {		
				
			var cont1="";
					for(x in answer)
		{
			cont1+="<span id='select"+answer[x].choice+"' > <input type='RADIO' name='select' value='"+answer[x].choice+"'>  "+answer[x].choice+"."+answer[x].content+"<br /> </span>"; 
			}	var content = "<form action='' method=''> <div align='left' style='font-size:12px'>"+cont1+" <input type='BUTTON' onclick='verifyAnswer();' value='Submit' /> </form>";
				document.write(content);
		
			
			
			} else  {
					if(alt.length>3)
				{
				
				document.write("<center><input type='BUTTON' onclick='video();' value='Video' /></center>");
				}
				var content = '<br/><center>'+ correctAnswer.content+'</center>';
				document.write(content);
			
			}
		</script>
						</div> </td>
</tr>
</table>
</body>