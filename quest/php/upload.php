<?php
/*
 * Updates the Status of the activity.
 * Used by Ajax request from wscript.js
 */
include '../php/credentials.php';
session_start();
//scripts starts its execution from here by verifying the post request it received and also the session of the user
if (isset($_SESSION['who']) == 'teacher') {
	if (isset($_POST['content'])) {
		process($_POST['content']);
	} else//if there is unexpected request from the client
		echo "unexpectedrequest";
} else {//if session doesnt exist this commands client to redirect to loginpage
	echo "sessionfail";
}

//scripts starts its execution from here by verifying the post request it received and also the session of the user
else if(isset($_POST['content'])&&isset($_SESSION['login'])==true && $_SESSION['who']=='students')
{
	$studentid=$_SESSION['id'];
	$content=$_POST['content'];
	$content=json_decode($content);
	//decides media id
	mysql_query("INSERT INTO image (images) VALUES ('temp')") or die(mysql_error());
	$m= mysql_insert_id();
	//
	$path="uploads/".$m.".jpeg";
	//creates image file
	decodeimage($content->media->file->dataurl, $path);
	mysql_query("UPDATE image SET images='".$path."' WHERE id=$m") or die(mysql_error());

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

//Processes the data sent from the client to upload it to the Database
function process($x) {
	$content = json_decode(x);
	$x = array_keys(get_object_vars($content));
	for ($i = 0; $i < count($x); $i++)
		mysql_query("UPDATE stud_activity SET status='" . mysql_escape_string($content -> $x[$i] -> grant) . "',comments='" . mysql_escape_string($content -> $x[$i] -> comment) . "' WHERE id='" . $x[$i] . "' ") or die("mysqlfailed");
	echo "sucess";
}
?>

