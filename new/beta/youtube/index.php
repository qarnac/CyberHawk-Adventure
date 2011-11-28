<form method="post">

<input type="text" name="url" value="" style="width: 300px">

<input type="submit" value="Get Video Link">

</form>



<br />
<hr>
<br />


<?php

if(isset($_POST['url']))
{
  include('curl.php');
  include('youtube.php');
  
  $tube = new youtube();
    
  $links = $tube->get($_POST['url']);
   
  if($links) { ?>
    
    <b>Download Links  ( Same IP Downloading only )</b> :
    <pre>
    <?php
	foreach($links as $lin)
	{
		echo "<a href=".$lin['url']." >".$lin['type']."   ".$lin['ext']."</a>"."</br>";
		//echo $lin['type']."</br>";
		//echo $lin['ext']."</br>";
		 //print_r($links);
		 ?>
		<?}
     
    ?> 
    </pre>
  
  <?php } else {

      echo $tube->error;

  }
  


}

?>
