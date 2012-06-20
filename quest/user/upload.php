
<?php
/*
 * gets data from javascript and updates datbase and images
 */
include '../php/credentials.php';
session_start();
if(isset($_POST['content'])&&isset($_SESSION['login'])==true)
{
	$studentid=$_SESSION['id'];
	$content=$_POST['content'];
	$content=json_decode($content);
	$m=mysql_fetch_assoc(query("SELECT id FROM image ORDER BY id DESC"));
	$m=$m['id'];
	$m++;
	$path="uploads/".$m.".jpg";
	decodeimage($content->media->file->dataurl, $path);
	query("INSERT INTO image (id,images) VALUES ($m,'".$path."')");
	query("INSERT INTO stud_activity (student_id,hunt_id,media,media_id,created,status,lat,lng,aboutmedia,whythis,howhelpfull,yourdoubt,mquestion,choices) VALUES ($studentid,".esc($content->huntid).",'image.php',".$m.",'".date('Y-m-d H:i:s')."','new','".esc($content->media->loc->latlng->lat)."','".esc($content->media->loc->latlng->lng)."','".esc($content->aboutmedia)."','".esc($content->whythis)."','".esc($content->howhelpful)."','".esc($content->yourdoubt)."','".esc($content->mquestion)."','".choic($content)."')");
	echo "true";
}
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

function query($x)
{
	$result=mysql_query($x) or die(mysql_error());
	return $result;
}
function esc($x)
{
	return mysql_escape_string($x);
}

function decodeimage($imageData,$outputfile)
{

$fp = fopen($outputfile, 'wb');
$imageData=str_replace(' ','+',$imageData);
fwrite($fp, base64_decode($imageData));
fclose($fp);

}
function btos($x)
{
	if($x)
	return "true";
	else
	return "false";
	}

?>

