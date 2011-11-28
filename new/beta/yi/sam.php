<?php

$curl_handle=curl_init();
$search="love";
curl_setopt($curl_handle,CURLOPT_URL,'http://www.youtube.com/results?search_query='.$search.'&search_sort=video_view_count');
curl_setopt($curl_handle,CURLOPT_CONNECTTIMEOUT,2);
curl_setopt($curl_handle,CURLOPT_RETURNTRANSFER,1);
$buffer = curl_exec($curl_handle);
curl_close($curl_handle);

if (empty($buffer))
{
    print "Sorry, example.com are a bunch of poopy-heads.<p>";
}
else
{
    print $buffer;
}
echo "<iframe width='560' height='345' src='http://www.youtube.com/embed/uelHwf8o7_U?autoplay=1' frameborder='0' allowfullscreen></iframe>";
?>
