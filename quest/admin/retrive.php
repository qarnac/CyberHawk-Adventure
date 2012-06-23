<?
if(isset($_POST['id']))
{
	include "../php/credentials.php";
	$x=mysql_query("SELECT * FROM stud_activity WHERE hunt_id='".mysql_escape_string($_POST['id'])."'");
	if(mysql_num_rows($x)==0)
	{echo "false";}
	else {
		$z=array();
		while($m=mysql_fetch_assoc($x))
		array_push($z,$m);
		$z=json_encode($z);
		echo $z;
	}

}
?>