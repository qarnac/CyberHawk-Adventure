<?php 
$default="2012";
if (isset($_GET['id']))
	{
	$viid=$_GET["id"];
		if($viid!="")
		{
			$id=1;
		}
		else
			$id=$default;
	}

else if (isset($_GET['q']))
	{
		 $st=$_GET["q"];
		
		if($st!="")
		{
			$id=2;
		}
		else
			$id=$default;
	
		
	}
	else
	{
			$id=$default;
	}
		include("parse2.php");
		include("parse.php");
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Youtube Videos in RealTime</title>
  <meta name="description" content="Plays and search youtube videos in RealTime  Surfs YouTube Instantly " />
  <meta name="keywords" content="youtube,instant,google instant,videos,videos instant,instantly,videos instantly,seedspirit,youtube instant,realtime,realtime search" />
  <meta http-equiv="content-type" content="text/html; charset=windows-1252" />
  <script type="text/javascript" src="./jq/jquery-latest.js"></script> 
<script type="text/javascript" src="./jq/jscript.js"></script> 
<link href="default.css" rel="stylesheet" type="text/css" />
  <?php
  if($id==1)
  {
	  proc($viid,"header");
	  }else if($id=="2")
	  {
		  keyproc($st,"relevance","header");
		  
	  }
	  else
	  {
		  keyproc($default,"relevance","header");
	  }
  
  
  
  
  
  
  ?>
 


<!-- start header -->

<!-- end header -->


<!-- start page -->

	
	<!-- end content -->
	<!-- start sidebar -->
	
	<!-- end sidebar -->

<!-- end page -->
<!-- start footer -->

</div>    <div id="social"  >
    <br />
    <br />
    
<g:plusone annotation="inline"></g:plusone>

<!-- Place this render call where appropriate -->
<script type="text/javascript">
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
   
 <div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#appId=210617989002570&xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<div class="fb-like" data-href="seedspirit.com" data-send="true" data-width="450" data-show-faces="true"></div>
</div>
</div>
    </p>
	</div>
</div>
<!-- end footer -->



<div style="text-align: center; font-size: 0.75em;"><a href="http://dreampowers.com/">Spirit for You</a>.<a href="https://www.facebook.com/profile.php?id=617596664" >Who Am I.?</a></div>
</body>
</html>
