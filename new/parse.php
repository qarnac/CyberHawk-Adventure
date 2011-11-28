<?php
if(isset($_GET["q"])&&isset($_GET["o"]))
{
	keyproc($_GET["q"],$_GET["o"],"ajax");
	}
    function keyproc($keyword,$order,$who)
	{
		
    // set feed URL
    $feedURL = 'https://gdata.youtube.com/feeds/api/videos?q='.$keyword.'&orderby='.$order.'&max-results=50&format=5';
    $dup=$keyword;
    // read feed into SimpleXML object
	
    $sxml = simplexml_load_file($feedURL);
  $count=0;
    // iterate over entries in feed
    foreach ($sxml->entry as $entry) {
		
      // get nodes in media: namespace for media information
      $media = $entry->children('http://search.yahoo.com/mrss/');
      
      // get video player URL
      $attrs = $media->group->player->attributes();
	  $desc=$media->group->description;
	  $desc=substr($desc,0,100);
      $watch = $attrs['url']; 
	  $fir=strpos($watch,"=");
	  $sec=strpos($watch,"&");
	  
	  $vc=substr($watch,$fir+1,$sec-$fir-1);
      
      // get video thumbnail
      $attrs = $media->group->thumbnail[0]->attributes();
      $thumbnail = $attrs['url']; 
	   
            
      // get <yt:duration> node for video length
      $yt = $media->children('http://gdata.youtube.com/schemas/2007');
      $attrs = $yt->duration->attributes();
      $length = $attrs['seconds']; 
      
      // get <yt:stats> node for viewer statistics
      $yt = $entry->children('http://gdata.youtube.com/schemas/2007');
      $attrs = $yt->statistics->attributes();
      $viewCount = $attrs['viewCount']; 
      
      // get <gd:rating> node for video ratings
      $gd = $entry->children('http://schemas.google.com/g/2005'); 
      if ($gd->rating) {
        $attrs = $gd->rating->attributes();
        $rating = $attrs['average']; 
      } else {
        $rating = 0; 
      } 
	  //echo "<br>--".$vc."-------------------";
	      $w[$count]=$watch; //url
		  $t[$count]=$media->group->title; //title
		  $a[$count]=$entry->author->name; //author Name
		  $v[$count]=$viewCount; //view count
		  $r[$count]=$rating;  // rating
		  $l[$count]= round($length/60,2); // length
		  $vc1[$count]=$vc; //video id
		  
		  $des[$count]=trim($desc,"\x22\x27");
		  $thumb[$count]=$thumbnail;
		  $sum[$count]=" Author: ".$a[$count]." ViewCount: ". $v[$count]." Rating: " .$r[$count]." Length: ".$l[$count];
		  $count++;
	}
	if(empty($vc1[0]))
	{
		echo "Sorry Result Not FOund";
	}
	else
	{
		
		if($who=="header")
	{
		$h=1; 
	echo   "	<meta property='fb:app_id' content='87741124305'>
  <meta property='og:url' content='http://www.seedspirit.com/?id=$vc1[0]'>
  <meta property='og:title' content='$t[0]'>
  <meta property='og:description' content='$des[0]'>
  <meta property='og:type' content='video'>
  <meta property='og:image' content='http://i3.ytimg.com/vi/$vc1[0]/default.jpg'>
  <meta property='og:video' content='http://www.youtube.com/v/$vc1[0]?autoplay=1&version=3&amp'>
  <meta property='og:video:type' content='application/x-shockwave-flash'>
    <meta property='og:video:width' content='398'>
    <meta property='og:video:height' content='297'>
  <meta property='og:site_name' content='SeedSpirit'></head><body>";
  echo "<div id='footer'>
	<div id='footer-wrap'>
   
	<p id='legal'>
   
 
 
 <h3 id='social'>Tip: Video Loads for every letter</h3>
    <form id='new'> 
	<font size='+2'><img src='/images/seed.jpg' height='66px' width='172px' />Instant You</font><font face='Comic Sans MS, cursive' color='#FF0000' size='+2'>Tube ~&gt;</font> 
	  <input type='text' class='tb11' value=".$keyword." id='sertext' onkeyup='showHint()'  size='40' height='60px' />
      <span>&nbsp;&nbsp; sort &nbsp;&nbsp; <select name='sorter' id='sort' onChange='showHint()'>
<option value='relevance' selected='selected'>Relevance</option>
<option value='viewCount'>ViewCount</option>
<option value='published'>Published</option>
<option value='rating' >Rating</option>

</select> <font size='-1'>Video Id .?</font> <input type='text' class='tb12'  id='viid'   size='25px' height='60px' />   <button type='button' class='positive' onclick='viid1()'>
        <img src='/images/search.png' alt=''/> 
        Search
    </button>
	</span></form><div class='container'><div id='ajax'>";
	}
	else
	{
		$h=1;}
		
		for($i=0;$i<$count;$i++)
		{
		if($i==0)
			{
				
				
				//main video
			echo "<div id='main_view'>
			<div id='title'><h2>".$t[$i]." </h2></div>
			<iframe id='disp' width='770' height='440' src='http://www.youtube.com/embed/".$vc1[$i]."?autoplay=".$h."&wmode=opaque' frameborder='10' allowfullscreen></iframe>
			<div id='sum'>".$sum[$i]."</div> </div><div style='overflow: auto; width:470px; height: 450px'><ul class='thumb'>";
			//related
			
			}
			else
			{
				$ccc="replace1(this.id,'$sum[$i]',this.name)";
				?>
                <script type="text/javascript">
				document.getElementById("sertext").value=$keyword;
				</script>
    <h3><?php echo $t[$i];?></h3> <li style='z-index: 0; '><img src="<?php echo $thumb[$i];?>" onmouseover='dispt(this.name)' onmouseout='curtitle()' onclick="<?php echo $ccc;?>"  name="<?php echo $t[$i];?>" id="<?php echo $vc1[$i];?>" ></li>
	<?php
	


			}
			
		}
		echo "</div><div><br><font face='Comic Sans MS, cursive'>
<h3 id='reltitle'>&nbsp;&nbsp;&nbsp;&nbsp; Related</h3></font></div>";

		echo "</ul>   Share It  <div id='share'  ><img src='/images/fb.png' onclick='fshare(this.name)' name='$vc1[0]' ></div>
&nbsp; Share Url<input type='text' id='shareurl' value='http://seedspirit.com/?id=$vc1[0]' size='40'/>";

		
		
	}
	}
	?>
	