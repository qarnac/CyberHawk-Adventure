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
		$count++;
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
      if($count==1){
		  $w1=$watch;
		  $t1=$media->group->title;
		  $a1=$entry->author->name;
		  $v1=$viewCount;
		  $r1=$rating;
		  $l1=$length;
		  $vc1=$vc;
		  
		}
		else
		{
			if($count==2)
			{
				?>
         
                 
                <div class="sidebar">
                <h2>Related</h2>
				 <ul> 
               <? 
                }?>
              
               <li>  
                  </li><li>
                  <?php echo $media->group->title; ?>
        
                
                <img src="<?php echo $thumbnail;?>" height="100" width="116" onClick="replace1('<?php echo $vc; ?>')"/>
                
             </li><li>        Duration: <?php printf('%0.2f', $length/60); ?> 
          min. </li>
                
                
            <?
            
		}
	}
	echo "</ul>		</div>";
		?>	
      <div id="content">
         
        
        
<?php if(empty($vc1))
{
	echo "SOryy No REsullts FoounD";
}
else
{
 echo "<iframe id='disp' width='730' height='400' src='http://www.youtube.com/embed/".$vc1."?autoplay=1' frameborder='0' allowfullscreen></iframe>"; }?>
      
        <p id="tit" ><?php echo $t1; ?><p>
        <p>
          
          <span class="attr">By:</span> <?php echo $a1; ?> <br/>
          <span class="attr">Duration:</span> <?php printf('%0.2f', $l1/60); ?> 
          min. <br/>
          <span class="attr">Views:</span> <?php echo $v1; ?> <br/>
          <span class="attr">Rating:</span> <?php echo $r1; ?> 
        </p>
      </div>      
    
    




  