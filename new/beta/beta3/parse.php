<?php

    
	$keyword=$_GET["q"];
	
	$order=$_GET["o"];
    // set feed URL
    $feedURL = 'https://gdata.youtube.com/feeds/api/videos?q='.$keyword.'&orderby='.$order.'&max-results=10&format=5';
    
    // read feed into SimpleXML object
	
    $sxml = simplexml_load_file($feedURL);
    ?>
      <h1><?php //echo $sxml->title; 
	  $count=0 ?></h1>
    <?php
    // iterate over entries in feed
    foreach ($sxml->entry as $entry) {
		
      // get nodes in media: namespace for media information
      $media = $entry->children('http://search.yahoo.com/mrss/');
      
      // get video player URL
      $attrs = $media->group->player->attributes();
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
		for($i=0;$i<$count;$i++)
		{
		if($i==0)
			{
				
				
				//main video
			echo "<div id='main_view'>
			<div id='title'><h2>".$t[$i]."</h2></div>
			<iframe id='disp' width='770' height='440' src='http://www.youtube.com/embed/".$vc1[$i]."?autoplay=1' frameborder='10' allowfullscreen></iframe>
			<div id='sum'>".$sum[$i]."</div></div> <ul class='thumb'>";
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
		echo "<div><br><font face='Comic Sans MS, cursive'>
<h3 id='reltitle'>&nbsp;&nbsp;&nbsp;&nbsp; Related</h3></font></div>";

		echo "</ul>";
		
		
	}
	?>
	