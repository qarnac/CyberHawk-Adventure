
<?php
if(isset($_POST['url']))
decodeimage($_POST['url'],"uploads/".$_POST['fname']);


function decodeimage($imageData,$outputfile)
{

$fp = fopen($outputfile, 'wb');
$imageData=str_replace(' ','+',$imageData);
fwrite($fp, base64_decode($imageData));
fclose($fp);
echo "Compressed file saved sucessfully ";
}
function disp($img_string)
{header("Content-type: image/jpeg");
$img_string=str_replace(' ','+',$img_string);
echo base64_decode($img_string); }
?>



