
    <?php
	if(isset($_GET['viid']))
	{
		proc($_GET['viid'],"ajax");
		}
		
	
	
	
    // function to parse a video <entry>
    function parseVideoEntry($entry) {      
      $obj= new stdClass;
  
      // get nodes in media: namespace for media information
      $media = $entry->children('http://search.yahoo.com/mrss/');
      $obj->title = $media->group->title;
      $obj->description = $media->group->description;
      $obj->author=$entry->autor->name;
      // get video player URL
      $attrs = $media->group->player->attributes();
      $obj->watchURL = $attrs['url']; 
	  $watch=$obj->watchURL;
        $fir=strpos($watch,"=");
	  $sec=strpos($watch,"&");
	  
	  $obj->vc=substr($watch,$fir+1,$sec-$fir-1);
      
      // get video thumbnail
      $attrs = $media->group->thumbnail[0]->attributes();
      $obj->thumbnailURL = $attrs['url']; 
            
      // get <yt:duration> node for video length
      $yt = $media->children('http://gdata.youtube.com/schemas/2007');
      $attrs = $yt->duration->attributes();
      $obj->length = $attrs['seconds']; 
      
      // get <yt:stats> node for viewer statistics
      $yt = $entry->children('http://gdata.youtube.com/schemas/2007');
      $attrs = $yt->statistics->attributes();
      $obj->viewCount = $attrs['viewCount']; 
      
      // get <gd:rating> node for video ratings
      $gd = $entry->children('http://schemas.google.com/g/2005'); 
      if ($gd->rating) { 
        $attrs = $gd->rating->attributes();
        $obj->rating = $attrs['average']; 
      } else {
        $obj->rating = 0;         
      }
        

    
      // return object to caller  
      return $obj;      
    } 
	function proc($vid,$who)
	{  
    
    // get video ID from $_GET 
   
    
    // set video data feed URL
    $feedURL = 'http://gdata.youtube.com/feeds/api/videos/' . $vid;

    // read feed into SimpleXML object
    if($entry = simplexml_load_file($feedURL))
	{
		 $video = parseVideoEntry($entry);  
		 $count=0;
		    $w[$count]=$video->watchURL; //url
		  $t[$count]=$video->title; //title
		  $a[$count]=$video->author; //author Name
		  $v[$count]=$video->viewCount; //view count
		  $r[$count]=$video->rating;  // rating
		  $l[$count]= round($video->length/60,2); // length
		  $vc1[$count]=$video->vc; //video id
		  $thumb[$count]=$video->thumbnailURL;
		  $des[$count]=$video->description;
		  $sum[$count]=" Author: ".$a[$count]." ViewCount: ". $v[$count]." Rating: " .$r[$count]." Length: ".$l[$count];
		  $count++;
		 
	 $relatedURL="http://gdata.youtube.com/feeds/api/videos/".$vid."/related";
    if ($relatedURL) {
		
      $relatedFeed = simplexml_load_file($relatedURL);    
      
      foreach ($relatedFeed->entry as $related) {
        $rvideo = parseVideoEntry($related);
		    $w[$count]=$rvideo->watchURL; //url
		  $t[$count]=$rvideo->title; //title
		  $a[$count]=$rvideo->author; //author Name
		  $v[$count]=$rvideo->viewCount; //view count
		  $r[$count]=$rvideo->rating;  // rating
		  $l[$count]= round($rvideo->length/60,2); // length
		  $vc1[$count]=$rvideo->vc; //video id
		  $thumb[$count]=$rvideo->thumbnailURL;
		  $sum[$count]=" Author: ".$a[$count]." ViewCount: ". $v[$count]." Rating: " .$r[$count]." Length: ".$l[$count];
		  $count++;
		
      }
    } 
	}
	else
	{
	die ('ERROR: Video Not Found');
	}
	if($who=="header")
	{
	echo   "	<meta property='fb:app_id' content='87741124305'>
  <meta property='og:url' content='http://www.seedspirit.com/?id=$vc1[0]'>
  <meta property='og:title' content='$t[0]'>
  <meta property='og:description' content='$des[0]'>
  <meta property='og:type' content='video'>
  <meta property='og:image' content='http://i3.ytimg.com/vi/$vc1[0]/default.jpg'>
  <meta property='og:video' content='http://www.youtube.com/v/$vc1[0]?version=3&amp;autohide=1'>
  <meta property='og:video:type' content='application/x-shockwave-flash'>
    <meta property='og:video:width' content='398'>
    <meta property='og:video:height' content='224'>
  <meta property='og:site_name' content='SeedSpirit'></head><body>";
  echo "<div id='footer'>
	<div id='footer-wrap'>
   
	<p id='legal'>
    <div class='container'>
 
 
 <h3 id='social'>Tip: Video Loads for every letter</h3>
    <form> 
	<font size='+2'><img src='/images/seed.jpg' height='66px' width='172px' />Instant You</font><font face='Comic Sans MS, cursive' color='#FF0000' size='+2'>Tube ~&gt;</font> 
	  <input type='text' class='tb11' id='sertext' onkeyup='showHint()' onChange='showHint()' size='40' height='60px' />
      <span>&nbsp;&nbsp; sort &nbsp;&nbsp; <select name='sorter' id='sort' onChange='showHint()'>
<option value='relevance' selected='selected'>Relevance</option>
<option value='viewCount'>ViewCount</option>
<option value='published'>Published</option>
<option value='rating' >Rating</option>

</select> <font size='-1'>Video Id .?</font> <input type='text' class='tb12' value=".$vid." id='viid' size='25px' height='60px' />   <button type='button' class='positive' onclick='viid1()'>
        <img src='/images/search.png' alt=''/> 
        Search
    </button>
	</span></form><div id='ajax'>";
    

    
   

		
		}
	
	for($i=0;$i<$count;$i++)
		{
		if($i==0)
			{
				//main video
			echo "<div id='main_view'>
			<div id='title'><h2>".$t[$i]."</h2></div>
			<iframe id='disp' width='770' height='440' src='http://www.youtube.com/embed/".$vc1[$i]."?autoplay=1' frameborder='10' allowfullscreen></iframe>
			<div id='sum'>".$sum[$i]."</div></div> <div style='overflow: auto; width:470px; height: 450px'><ul class='thumb'>";
			//related
			
			}
			else
			{
				$ccc="replace1(this.id,'$sum[$i]',this.name)";
				?>
     <li style='z-index: 0; '><img src="<?php echo $thumb[$i];?>" onmouseover='dispt(this.name)' onmouseout='curtitle()' onclick="<?php echo $ccc;?>"  name="<?php echo $t[$i];?>" id="<?php echo $vc1[$i];?>" ></li>
	<?php
	


			}
			
		}
		echo "</div><div><br><font face='Comic Sans MS, cursive'>
<h3 id='reltitle'>&nbsp;&nbsp;&nbsp;&nbsp; Related</h3></font></div>";

		echo "</ul>";
	}
   
    ?>