<?php
//scripts starts its execution from here by verifying the post request it received and also the session of the user
if(isset($_POST['content'])&&<isset($_SESSION['login'])==true && $_SESSION['who']=='students')
{
	$studentid=$_SESSION['id'];
	$content=$_POST['content'];
	$content=json_decode($content);
	//decides media id
	mysql_query("INSERT INTO image (images) VALUES ('temp')") or die(mysql_error());
	$mysql_id= mysql_insert_id();
	//
	$path="uploads/".$mysql_id.".jpeg";
	//creates image file
	decodeimage($content->media->file->dataurl, $path);
	mysql_query("UPDATE image SET images='".$path."' WHERE id=$mysql_id") or die(mysql_error());

	mysql_query("INSERT INTO stud_activity (student_id,hunt_id,media,media_id,created,status,lat,lng,aboutmedia,whythis,howhelpfull,yourdoubt,mquestion,choices) VALUES ($studentid,".mysql_escape_string($content->huntid).",'image.php',".$m.",'".date('Y-m-d H:i:s')."','new','".mysql_escape_string($content->media->loc->latlng->lat)."','".mysql_escape_string($content->media->loc->latlng->lng)."','".mysql_escape_string($content->aboutmedia)."','".mysql_escape_string($content->whythis)."','".mysql_escape_string($content->howhelpful)."','".mysql_escape_string($content->yourdoubt)."','".mysql_escape_string($content->mquestion)."','".choic($content)."')") or die(mysql_error());
	
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

//decodes the image to a binary file and finally a jpeg file
function decodeimage($imageData,$outputfile)
{
$fp = fopen($outputfile, 'wb');
$imageData=str_replace(' ','+',$imageData);
fwrite($fp, base64_decode($imageData));
fclose($fp);
}
//converts boolean to string
function btos($x){ return ($x)? "true":"false";}

?>