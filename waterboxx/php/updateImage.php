<?php
/*
updates only the image and the lat/lng.
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
	mysql_query("INSERT INTO image (images) VALUES ('temp')");
	$m= mysql_insert_id();
	$img_filename = $m . ".jpeg";
	

	// writes the image data to a file on disk
	writeImage($content->media->file->dataurl, $GLOBALS->PHP_MEDIA_PATH . $img_filename);
	mysql_query("UPDATE image SET images='" . $img_filename . "' WHERE id=$m");
	mysql_query("UPDATE stud_activity SET " .
		" media_id='" . $m .
		"', lat='" . mysql_escape_string($content->lat) .
		"', lng='" . mysql_escape_string($content->lng) .
		"' WHERE  `id` = " . mysql_escape_string($content->id) . ";") or die(mysql_error());
	echo "true";
}


//decodes the image to a binary file and finally a jpeg file
function writeImage($imageData,$outputfile)
{
	$fp = fopen($outputfile, 'wb');
	$imageData=str_replace(' ','+',$imageData);
	fwrite($fp, base64_decode($imageData));
	fclose($fp);
}

?>
