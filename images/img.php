<?php
function sendimagetext($text,$font_size) {
  // Set font size
  

  $ts=explode(" ",$text);
  $width=0;
  foreach ($ts as $k=>$string) { //compute width
    $width=max($width,strlen($string));
  }

  // Create image width dependant on width of the string
  $width  = imagefontwidth($font_size)*$width;
  // Set height to that of the font
  $height = imagefontheight($font_size)*count($ts);
  $el=imagefontheight($font_size);
  $em=imagefontwidth($font_size);
  // Create the image pallette
  $img = imagecreatetruecolor($width,$height);
  // Dark red background
  $bg = imagecolorallocate($img, 255, 0, 0);
  imagefilledrectangle($img, 0, 0,$width ,$height , $bg);
  // White font color
  $color = imagecolorallocate($img, 255, 255, 255);

  foreach ($ts as $k=>$string) {
    // Length of the string
    $len = strlen($string);
    // Y-coordinate of character, X changes, Y is static
    $ypos = 0;
    // Loop through the string
    for($i=0;$i<$len;$i++){
      // Position of the character horizontally
      $xpos = $i * $em;
      $ypos = $k * $el;
      // Draw character
      imagechar($img, $font_size, $xpos, $ypos, $string, $color);
      // Remove character from string
      $string = substr($string, 1);      
    }
  }
  // Return the image
  header("Content-Type: image/png");
  imagepng($img);
  // Remove image
  imagedestroy($img);
}

sendimagetext($_REQUEST['text'],$_REQUEST['size']);
?>

