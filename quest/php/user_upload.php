<?php
/*
 * gets data from javascript and updates datbase and images
 */
include '../php/credentials.php';
session_start();
//scripts starts its execution from here by verifying the post request it received and also the session of the user
if(isset($_POST['content'])&&isset($_SESSION['login'])==true)
{
	$studentid=$_SESSION['id'];
	$content=$_POST['content'];
	$content=json_decode($content);
	//decides media id
	query("INSERT INTO image (images) VALUES ('temp')");
	$m= mysql_insert_id();
	$path="../uploads/".$m.".jpeg";
	//creates image file
	decodeimage($content->media->file->dataurl, $path);
	query("UPDATE image SET images='".$path."' WHERE id=$m");

	query("INSERT INTO stud_activity (student_id,hunt_id,media,media_id,created,status,lat,lng,aboutmedia,whythis,howhelpfull,yourdoubt,mquestion,choices) VALUES ($studentid,".esc($content->huntid).",'image.php',".$m.",'".date('Y-m-d H:i:s')."','new','".esc($content->media->loc->lat)."','".esc($content->media->loc->lng)."','".esc($content->aboutmedia)."','".esc($content->whythis)."','".esc($content->howhelpful)."','".esc($content->yourdoubt)."','".esc($content->mquestion)."','".choic($content)."')");

	echo "true";
}
//converts the choices into json format
function choic($data)
{
	$choic=array("choices"=>array());
	if($data->a!="")
	array_push($choic['choices'],array('choice'=>'a','content'=>$data->a,'ans'=> btos($data->answer=='a')));
	if($data->b!="")
	array_push($choic['choices'],array('choice'=>'b','content'=>$data->b,'ans'=> btos($data->answer=='b')));
	if($data->c!="")
	array_push($choic['choices'],array('choice'=>'c','content'=>$data->c,'ans'=> btos($data->answer=='c')));
	if($data->d!="")
	array_push($choic['choices'],array('choice'=>'d','content'=>$data->d,'ans'=> btos($data->answer=='d')));
	if($data->e!="")
	array_push($choic['choices'],array('choice'=>'e','content'=>$data->e,'ans'=> btos($data->answer=='e')));
	$choic=json_encode($choic);
	return $choic;
}
//dbase query executer
function query($x)
{
	$result=mysql_query($x) or die(mysql_error());
	return $result;
}
//escapes mysql injection
function esc($x)
{
	return mysql_escape_string($x);
}
//decodes the image to a binary file and finally a jpeg file
function decodeimage($imageData,$outputfile)
{

$fp = fopen($outputfile, 'wb');
$imageData=str_replace(' ','+',$imageData);
fwrite($fp, base64_decode($imageData));
fclose($fp);

}
//converts boolean to string
function btos($x)
{
	if($x)
	return "true";
	else
	return "false";
	}

?>
