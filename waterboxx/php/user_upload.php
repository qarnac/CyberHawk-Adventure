<?php
/*
 * gets data from javascript and updates datbase and images
 */
include '../php/credentials.php';
include 'getConstants.php';
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
	$img_filename = $m . ".jpeg";
	

	// writes the image data to a file on disk
	$successful=($content->successful=="Yes")?true:false;
	$is_seed=($content->is_seed=="Seed")?true:false;
	writeImage($content->media->file->dataurl, $GLOBALS->PHP_MEDIA_PATH . $img_filename);
	query("UPDATE image SET images='" . $img_filename . "' WHERE id=$m");
	query("INSERT INTO stud_activity SET ".
		"student_id='" . $studentid . 
		"', hunt_id='" . esc($content->huntid) .
		"', media_id='" . $m .
		"', date_planted=FROM_UNIXTIME(" . $content->date_planted .") " .
		", date_observed=FROM_UNIXTIME(" . $content->date_observed .") " .
		", date_created='" . date('Y-m-d H:i:s') .
		"', status='" . esc($content->status) .
		"', lat='" . esc($content->lat) .
		"', lng='" . esc($content->lng) .
		"', partner_names='" . esc($content->partner_names) .
		"',height='" . esc($content->height) .
		"',site_description='" . esc($content->site_description) .
		"',success_reasons='" . esc($content->success_reasons) .
		"',waterboxx_condition='" . esc($content->waterboxx_condition) . 
		"',other_data='" . esc($content->other_data) .
		"', successful='" . $successful .
		"', is_seed='" . $is_seed .
		"';");
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
function writeImage($imageData,$outputfile)
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
