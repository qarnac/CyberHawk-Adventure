
<?php
//Code to upload the data to DB from front end . Pending not yet completed.
if($_SERVER['REQUEST_METHOD']=="POST")
{
	include "../../php/credentials.php";
	 if(isset($_POST['formdata']))
	 {
		 $data=$_POST['formdata'];
		 
		 $data=json_decode($data);
		 //print_r($data);
		$qid=$data->locid;
		$qid=$qid.rowno("questions","WHERE qbelong=".$data->locid)+1;
		 $type=$data->type;
		 $sno=0;
		 $tfile="";
		switch($type)
		{
			case "null":
			break;
			case "image":
			$tfile="image.php";
			$sno=1+rowno("image","");
			if(isset($data->file[0]))
			{
			$x=$data->file[0];
			$sname="images/".$qid."1.".$x->type;
			if (copy("uploads/".$x->name,"../../php/".$sname)) {
  				unlink("uploads/".$x->name);
				}
			}else if(isset($data->url[0]))
			{
				$sname=$data->url[0]->name;
			}
			$query1="INSERT INTO image (id,images)VALUES ($sno, '$sname')";
			mysql_query($query1);	
			break;
			
			case "dbimg":	
			$tfile="dualimage.php";
			$sno=1+rowno("dualimage","");
			if(isset($data->file[0]))
			{
						
			$x=$data->file[0];
			$sname="images/".$qid."1.".$x->type;
			if (copy("uploads/".$x->name,"../../php/images/".$sname)) {
  				unlink("uploads/".$x->name);
				}
			}else if(isset($data->url[0]))
			{
				$sname=$data->url[0]->name;
			}
			if(isset($data->file[1]))
			{
			$x=$data->file[1];
			$sname1="images/".$qid."2.".$x->type;
			if (copy("uploads/".$x->name,"../../php/images/".$sname1)) {
  				unlink("uploads/".$x->name);
				}
			}else if(isset($data->url[1]))
			{
				$sname1=$data->url[1]->name;
			}
			else if(isset($data->url[0]))
			{
				$sname1=$data->url[0]->name;
			}

			$query1="INSERT INTO dualimage (id,img1,img2)VALUES ($sno, '$sname','$sname1')";
			echo $query1;
			mysql_query($query1);
			break;
			
			case "slide":
			$tfile="slideshow.php";
			 $sno=1+rowno("slideshow","");
			 $i=1;
			 $cont=array("slides"=>array());
			foreach($data->file as $x)
			{
			$sname=$qid.$i.".".$x->type;
			$i++;
			array_push($cont["slides"],array("loc"=>"images/".$sname,"title"=>$x->title));
			
			if (copy("uploads/".$x->name,"../../php/images/".$sname)) {
  				unlink("uploads/".$x->name);
				}
			}
			foreach($data->url as $x)
			{
				array_push($cont["slides"],array("loc"=>$x->name,"title"=>$x->title));
				
				}
			$cont= json_encode($cont);
			$query1="INSERT INTO slideshow (id,imagetitle)VALUES ($sno, '$cont')";
			mysql_query($query1);
			break;
			case "video":
			$tfile="video.php";
			$sno=1+rowno("video","");
			$query1="INSERT INTO video (id,videos)VALUES ($sno, '".$data->video."')";
			mysql_query($query1);
			break;
		}
		
		
		if($data->a_type=="multiple")
		multiple($data,$qid,$tfile,$sno);
		else if($data->a_type=="textques")
		textques($data,$qid,$tfile,$sno);
			else if($data->a_type=="notes")
		notes($data,$qid,$tfile,$sno);
			else if($data->a_type=="view")
		view($data,$qid,$tfile,$sno);
			$query2="INSERT INTO questions (path,name,status,qid,qbelong) VALUES ('/$type','$data->tabtitle','1','$qid','$data->locid')";

	}

	
}
function btos($x)
{
	if($x)
	return "true";
	else
	return "false";
	}
	function textques($data,$qid,$type,$sno)
{
	if($data->ttype=="keywords")
	{
	$query="INSERT INTO match_keywords(qid,reward,keys,currentpage,appreciate,hint,title,description,media,mid)VALUES('$qid','$data->reward','$data->c1','1','$data->appreciate','$data->hint','$data->title','$data->description','$type',$sno)";
	
	}
	else if($data->ttype=="order")
	{
		$query="INSERT INTO arrange_order(qid,reward,answer,currentpage,appreciate,hint,title,description,media,mid)VALUES('$qid','$data->reward','$data->c1','1','$data->appreciate','$data->hint','$data->title','$data->description','$type',$sno)";
		
		}
	else if($data->ttype=="mixed")
	{
		$query="INSERT INTO arrange_letters(qid,reward,origletters,currentpage,appreciate,hint,title,description,media,mid)VALUES('$qid','$data->reward','$data->c1','1','$data->appreciate','$data->hint','$data->title','$data->description','$type',$sno)";	
		}
		mysql_query($query);
}
	
function notes($data,$qid,$type,$sno)
{
	$query="INSERT INTO notes (qid,reward,title,currentpage,appreciate,notes,type) VALUES ('$qid','$data->reward','$data->title','1','$data->appreciate','$data->notes','geo')";
	mysql_query($query);
	}
	function view($data,$qid,$type,$sno)
{
	$query="INSERT INTO justview (media,mid,qid,currentpage,title,description,reward) VALUES ('$type','$sno','$qid','1','$data->title','$data->description','$data->reward')";
	mysql_query($query);
}
function multiple($data,$qid,$type,$sno)
{
	
	$choic=array("choices"=>array());
	if($data->a!="")
	array_push($choic['choices'],array('choice'=>'a','content'=>$data->a,'ans'=> btos($data->answer=='a')));
	if($data->b!="")
	array_push($choic['choices'],array('choice'=>'b','content'=>$data->b,'ans'=> btos($data->answer=='b')));
	if($data->c!="")
	array_push($choic['choices'],array('choice'=>'c','content'=>$data->c,'ans'=> btos($data->answer=='c')));
	if($data->d!="")
	array_push($choic['choices'],array('choice'=>'d','content'=>$data->d,'ans'=> btos($data->answer=='d')));
	if($data->e!="")
	array_push($choic['choices'],array('choice'=>'e','content'=>$data->e,'ans'=> btos($data->answer=='e')));
	$choic=json_encode($choic);
	$query1="INSERT INTO multiple_choice (qid,reward,currentpage,title,description,choices,media,mid,alt,hint)VALUES ('$qid','$data->reward','1','$data->title','$data->description','$choic','$type','$sno','$data->alt','$data->hint')";
	echo $query1;
	
	
	}
function rowno($table,$cons)
{
	 $query1="SELECT * FROM ".$table." ".$cons;
	
	return mysql_num_rows(mysql_query($query1));
}


?>