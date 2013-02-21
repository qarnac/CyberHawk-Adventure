<?php
	include '../php/credentials.php';
	include '../php/getConstants.php';
	$content=$_POST['contents'];
	$content=json_decode($content);
	mysql_query("UPDATE stud_activity" .
				" SET aboutmedia=" .'"'. mysql_escape_string($content->aboutmedia) .'"' .
				", partner_names=" .'"'. mysql_escape_string($content->partner_names) .'"' .
//				" , whythis=" . '"'.mysql_escape_string($content->whythis) .'"'.
				" , howhelpfull=" . '"'.mysql_escape_string($content->howhelpful).'"' .
				" , yourdoubt=" . '"'.mysql_escape_string($content->yourdoubt) .'"'.
				" , mquestion=" . '"'.mysql_escape_string($content->mquestion) .'"' .
				" , choices=" . '"' . mysql_escape_string(choic($content)) .'"' .
				" , status=" . '"' . mysql_escape_string($content->status) . '"' .
				" WHERE  `id` = " . mysql_escape_string($content->id) . ";") or die(mysql_error());
				
	echo "true";
//decodes the image to a binary file and finally a jpeg file
function writeImage($imageData,$outputfile)
{
	$fp = fopen($outputfile, 'wb');
	$imageData=str_replace(' ','+',$imageData);
	fwrite($fp, base64_decode($imageData));
	fclose($fp);
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

function btos($x)
{
	if($x)
	return "true";
	else
	return "false";
	}
?>