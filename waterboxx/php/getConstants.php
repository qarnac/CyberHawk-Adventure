<?php
// Loads constants.json, and puts the values into the GLOBALS variable.
$GLOBALS=json_decode(file_get_contents("http://ouyangdev.cs.csusm.edu/cyberhawk/waterboxx/constants.json"))
?>