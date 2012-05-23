
<?php 
 /*About
 This double.php creates a html page that a image which can be changed by clciking on it,actually it switches between two images. 
 To its addition it also has title ,subtitle,description which is also pulled from dbase.
 */
 
include "credentials.php";  //dbase credentials + dbase connection

$id=$_REQUEST['id'];		//pulls question id from the url 

$query = "SELECT * FROM dualimage where id=$id";  
$ques = mysql_query($query, $dbconnect);			//as question id is distinct it pulls only one row from table.
$result=mysql_fetch_array($ques);	
?>
	
	<script type="text/javascript">
	
	

	var id = 0;				 //this variable is used to switch images onclick .
	function showOutline()
	{
				id = !id;	// id value is being changed whenever click even occurs on the image
		var path;			//used to store the path of image
		if ( id == 0 ) path = "<?php echo $result['img1'];?>";	//loads the img location from dbase
		if ( id == 1 ) path = "<?php echo $result['img2'];?>";	//loads the img location from dbase
		document.getElementById("photo").src=path;
	}

	</script>

<img id="photo" src="<?php echo $result['img1'];?>" height="260" width="430" onClick="showOutline();"/> 


