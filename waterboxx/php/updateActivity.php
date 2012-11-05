<?php
	include '../php/credentials.php';
	include '../php/getConstants.php';
	$content=$_POST['contents'];
	$content=json_decode($content);
	$successful=($content->successful=="Yes")?true:false;
	$is_seed=($content->is_seed=="Seed")?true:false;
	mysql_query("UPDATE stud_activity SET " .
					" `date_planted` =FROM_UNIXTIME(" . $content->date_planted .") " .
					", `date_observed` =FROM_UNIXTIME(" . $content->date_observed .") " .
					", `status` ='" . mysql_escape_string($content->status) .
					"', `partner_names` ='" . mysql_escape_string($content->partner_names) .
					"', `height` ='" . mysql_escape_string($content->height) .
					"', `site_description` ='" . mysql_escape_string($content->site_description) .
					"', `success_reasons` ='" . mysql_escape_string($content->success_reasons) .
					"', `waterboxx_condition` ='" . mysql_escape_string($content->waterboxx_condition) . 
					"', `other_data` ='" . mysql_escape_string($content->other_data) .
					"', `successful` ='" . $successful .
					"', `is_seed` ='" . $is_seed .
					"' WHERE  `id` = " . mysql_escape_string($content->id) . ";") or die(mysql_error());
				
	if(isset($content->media)){
	//decides media id
	mysql_query("INSERT INTO image (images) VALUES ('temp')");
	$m= mysql_insert_id();
	$img_filename = $m . ".jpeg";

	// writes the image data to a file on disk
	writeImage($content->media->file->dataurl, $GLOBALS->PHP_MEDIA_PATH . $img_filename);
	mysql_query("UPDATE image SET images='" . $img_filename . "' WHERE id=$m");
	mysql_query("UPDATE stud_activity SET media_id=" . $m .
				" ,lat='" . mysql_escape_string($content->media->loc->lat) .
				"', lng='" . mysql_escape_string($content->media->loc->lng) .
				"' WHERE  `id` = " . mysql_escape_string($content->id) . ";") or die(mysql_error());
	}
	echo "true";
//decodes the image to a binary file and finally a jpeg file
function writeImage($imageData,$outputfile)
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