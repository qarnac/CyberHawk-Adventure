<?php

$username = $_POST['username'];
$email = $_POST['email'];
$title = "CyberHawk note from [$username]";
$note = $_POST['note'];
$certificate = $_POST['certificate'];

$content = "====================\nCertificate: \n====================\n";
$content .= "Name: $username \n";
$content .= $certificate;
$content .= "====================\nNote: \n====================\n";
$content .= $note;

$succ = @mail($email, $title, $content);
if ($succ)
	echo "<BR><BR><BR><center><span style='color:blue'>Your note was sent successfully to $email.</span></center>";
else
	echo "<BR><BR><BR><center><span style='color:red'>Failed to send the mail.</span></center>";
echo '<center><FORM><INPUT TYPE="button" VALUE="Go Back" onClick="history.go(-1);return true;"> </FORM></center>';

?>
