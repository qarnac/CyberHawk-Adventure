//uniq value to this user to avoid overlapping data with different user
var uniq=Math.floor((Math.random()*100)+1);
//keypress control
	var k_press=true;
	
	function keypress(k_what)
	{
		k_press=k_what;
	}
	window.onkeydown = function (){if(!k_press)return false;};
//end of key press control

// custom way to get id of a element
	function $id(id) 
	{
		return document.getElementById(id);
	}
//	

//Ajax 
	function ajax(id,what)
	{
		 var a_loc=document.getElementById("loc");
		if(id!="null")
		{
			if (window.XMLHttpRequest)
  			{// code for IE7+, Firefox, Chrome, Opera, Safari
  				xmlhttp=new XMLHttpRequest();
  			}
			else
  			{// code for IE6, IE5
 				 xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  			}
			xmlhttp.onreadystatechange=function()
 			 {
  				if (xmlhttp.readyState==4 && xmlhttp.status==200)
    			{
					var a=xmlhttp.responseText;
					if(what=="location") //Pull all the location from the particular quadrant from db and populates in dropdown box
					{	
						a = a.split(','); 
						var result=[];
						while(a[0]) 
						{
							result.push(a.splice(0,4));
						}
						locload(result);
					}
					else if(what=="activity")// loads the page that is used to create activity from db.
					{
						actload(a);
					}
    			}
  			}
 			document.getElementById("activity").innerHTML="";
			xmlhttp.open("GET","../ajax.php?what=activity&get="+what+"&id="+id+"&loc="+a_loc.value,true);
			xmlhttp.send();
		}
		else if(what=="location")//clears the activity content in the page
		{
			a_loc.disabled=true
			document.getElementById("act").disabled=true;
			document.getElementById("activity").innerHTML="";
		}
		else
			document.getElementById("activity").innerHTML="";
	}
// End of ajax	
	
//----handles the selecting and loading the quadrants,locations and activity content
	function locload(quad) 
	{
		var loc=document.getElementById("loc");
		if(document.getElementById("quadrant").value!="null")
			loc.disabled=false;
		else
			loc.disabled=true;
		loc.options.length=1;
		for(var i=0;i<quad.length;i++)
			loc.options[loc.options.length]= new Option(quad[i][0], quad[i][3], false, false);
	}
	function locsel(loc)
	{
		var act=document.getElementById("act");
		if(document.getElementById("loc").value!="null")
			act.disabled=false;
		else
			act.disabled=true;
		if(act.options.length==1)
			for(var i=0;i<tables.length;i++)
				act.options[act.options.length]= new Option(tables[i], tables[i], false, false);
		else
			act.options[0].selected=true;
		document.getElementById("activity").innerHTML="";
	}
	function actload(activity)
	{
		document.getElementById("activity").innerHTML=activity;
		starter();
	}
	
    
//----validation
function check(c,m_exis)
{
	var x=[];
	for(var i=0;i<c.length;i++)
		if(c[i].getAttribute("c_req")=="true")
			if(!filter(c[i],c))
			{
				x.push(i);
				c[i].value=null;
				c[i].style.borderColor='red';
			}
			else
				c[i].style.borderColor='#aacfe4';
	if(x.length>0)
	{
		var t="";
		for(y in x)
			t=t+c[x[y]].name+"\n";
		alert("please fill following mandatory fields \n "+t);
	}
	if(x.length==0 && m_exis)
	{
		up_db(c);
	}
	else if(!m_exis)
	{
		alert("you are missing some media files");
	}
}

function filter(obj,c)
{
	y=obj.value;
	if(obj.type=="radio")
	{
		var s=c[obj.name];
		for (x in s)
			if(s[x].checked)
			{
				
				if(filter(c[s[x].value],c))
				return true;			
				else 
				return false;
			}
			return false;
	}
	if(obj.getAttribute("c_type")=="number" && isNaN(y))
		return false;
	if(y==null || y=="" || y.indexOf("<")>=0 || y.indexOf(">")>=0 ||y=="null")
	{	
		return false;
	}
	return true;
}
function img_validate(obj)
{
	var id_value = obj.value;
 	if(id_value != '')
 	{ 
  		var valid_extensions = /(.jpg|.jpeg|.gif|.png)$/i;   
  		if(valid_extensions.test(id_value))
  		{ 
 			return true;
 		}
  		else
  		{ 
  			alert('Invalid File'+obj.value);
	  		obj.value=null;
			return false;
  		}
 	} 
}
//handles media selection
media=new Object();
media.type="";
media.count=0;
media.inherit="";
media.img=function(types,inher,size,img,video){this.type=types;this.inherit=inher;this.count=size;img.disabled=false;img.focus();video.disabled=true;video.setAttribute('c_req','false');};

media.video=function(inher,size,img,video){this.type="video";this.inherit=inher;this.count=size;img.disabled=true;video.disabled=false;video.setAttribute('c_req','true');img.setAttribute('c_req','false');};

media.clear=function(img,video){this.type="";this.count=0;this.inherit="";img.disabled=true;video.disabled=true;video.setAttribute('c_req','false');img.setAttribute('c_req','false');};
function s_selmedia(val,img,video,dest)
{
	dest=$id(dest);
	thumb=$id("thumb");
	 img=document.getElementById(img);
	 video=document.getElementById(video);
	video.value="";
	img.file=""
	img.value="";
	dest.innerHTML="";
	m_removeall();
	img.removeAttribute('c_req');
	video.removeAttribute('c_req');
	if(val=="image")
	{	
		media.img("image","image",1,img,video);
		
		thumb.style.display="none";
	}
	else if(val=="video")
	{	
		media.video("video",1,img,video);
	
		thumb.style.display="none";
	}
	else if(val=="slide")
	{
		media.img("slide","slide",40,img,video);
		
		thumb.style.display="block";
	}
	else if(val=="dbimg")
	{
		media.img("dbimg","slide",2,img,video);
	
		thumb.style.display="block";
	}
	else
	{
	media.clear(img,video);
		
	}

}
function selvid(obj,dest)
{
	vid=obj.value;
	var s=vid.indexOf("v=");
	if(s!=-1)
	{
		s=s+2;
		var e=vid.indexOf("&",s);
		if(e==-1)
			e=vid.length;
		vid=vid.substring(s,e);
		dest=$id(dest);
		m_add(null,'http://www.youtube.com/embed/'+vid,'videourl',dest);
		Output("<iframe src='http://www.youtube.com/embed/"+vid+"' frameborder='0' allowfullscreen style='width:inherit;height:inherit;'></iframe>",dest);
	}
	else
	{
		obj.value=null;
		alert("1.please copy video watch url directly dont copy embed url \n 2.Please paste the url below media type");
	}
}
///darkens background

function darkbg(v_bool)
{
	var dark=$id("darkenBackground");
	if(v_bool)
	{
	dark.style.display='';
	}
	else
	{
		dark.style.display='none';
	}
}
function secondlayer(v_bool,content)
{
	var disp=$id("process");	
	if(v_bool)
	{
		darkbg(true);
	disp.style.display='';
	if(content!=null)
	disp.innerHTML=disp.innerHTML+content;
	}
	else
	{
		darkbg(false);
		disp.style.display='none';
		
	}
}

//makes the content ready so that it can be sent to the server

function up_db(c)
{
	
	secondlayer(true);
	
	
	var locid=$id("loc").value;
	keypress(false);
	var t2={};
	t2['a_type']=c.name;
	
	var find_radio=[];

	
		for(var i=0;i<c.length;i++)
		{
			if(c[i].name!="" && !c[i].disabled && (c[i].getAttribute("c_req")=="true" || c[i].getAttribute("c_req")=="false") )
			{
				
				if(c[i].type=="radio")
				{
					if(find_radio.indexOf(c[i].name)<0)
					find_radio.push(c[i].name);
				}
				else
					{t2[c[i].name]=c[i].value;}
			}
		}
		
		for(var i=0;i<find_radio.length;i++)
		{
			var s=c[find_radio[i]];
			for (x in s)
			if(s[x].checked)
			{
				
				t2[find_radio[i]]=s[x].value;		
			}
		}
		
		
		
		
		t2['locid']=locid;
		secondlayer(true,"Uploading Data Please Wait <br>");
		t2['file']=new Array();
		
		
		for(var i=0;i<c_alldata.length;i++)
		{
			if(c_alldata[i].c_type=="file")
				{
					
					
					UploadFile(c_alldata[i]);
					
					
					var ttx=new Object();
					
					ttx.name=c_alldata[i].c_name;
					ttx.title=c_alldata[i].c_title;
					t2['file'].push(ttx);
				}
				else
				{
			
					
					t2[c_alldata[i].c_disp.id]=c_alldata[i].c_type;
				}
		}
	
		
		
		ajax_post("dataupload.php","formdata",JSON.stringify(t2));
	
}
track=new Object();
track.act=0;
track.cur=0;
track.finish=function(){if(this.act==this.cur){secondlayer(false);alert ("Data Uploaded");window.location.reload();
}};
//form content is sent using this function to the server
function ajax_post(where,caption,content)
{
	alert();
	var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
		secondlayer(true,"Form content Uploaded ");
	}
  }
xmlhttp.open("POST",where,true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send(caption+"="+content);
}

//drag and drop
/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
//media data
/*
var c_data=new Array();
var c_url=new Array();
var c_type=new Array();
var c_disp=new Array();
*/

//handles media after being dropped or selected
var c_alldata=new Array();
var c_h5=false;


function m_at(m_id)
{
	if(m_location(m_id)!=-1)
	{
		return c_alldata[m_id];
	}
	
}
function ref_thumb()
{
	thum=$id("thumb");
	
	var t_img="";
	var t_loc=0;
	for(var i=0;i<c_alldata.length;i++)
	{
		t_loc=m_locbyd(c_alldata[i].c_url);
		t_img=t_img+"<img src='"+c_alldata[i].c_url+"' style='float:left' class='thumbnail'/><input type='text' style='width:100px;float:left;margin:0 0 0 0;' onchange='c_alldata["+i+"].c_title=this.value;' placeholder='Tag'/> <a href='JavaScript:void(0);' onclick='m_remove("+t_loc+")'>delete</a><div class='clear'></div>";
		
	}
	Output(t_img,thum);
}

function m_add(m_data,m_url,m_type,m_disp,dis)
{
	if(media.inherit=="slide")
	{
		
		c_alldata.push(m_objconst(m_data,m_url,m_type,m_disp));
	if(dis)
		ref_thumb();
		
	}
	else 
	{
	if(m_location(m_disp)==-1)
	{	
		c_alldata.push(m_objconst(m_data,m_url,m_type,m_disp));
	}
	else
	{
		var m_temp=m_location(m_disp);
		c_alldata.splice(m_temp,1,m_objconst(m_data,m_url,m_type,m_disp));
	}
	}
	
}
function m_objconst(m_data,m_url,m_type,m_disp)
{
		obj=new Object();
		obj.c_data=m_data;
		obj.c_url=m_url;
		obj.c_type=m_type;
		obj.c_disp=m_disp;
		obj.c_title="image";
		var num=Date.now()+c_alldata.length+uniq;
		if(m_data!=null)
		obj.c_name=m_disp.id+"_"+m_type+"_"+num+"."+m_f_type(m_data.type);
		else
		obj.c_name=m_disp.id+"_"+m_type+"_"+num;
		return obj;
}
function m_f_type(i_type)
{
var i_types=new Array("image/jpg","image/gif","image/jpeg","image/png");
var i_ext=new Array("jpg","gif","jpeg","png");
return i_ext[i_types.indexOf(i_type)];

}

//var c_data="null";
//var c_url="null";

//var c_fu="null";
function m_removeall()
{
	while(c_alldata.length>0)
	{
		c_alldata[c_alldata.length-1].c_disp.innerHTML="";
		c_alldata.pop();
	}
	 ref_thumb();
}

function m_remove(m_id)
{
	
	if(m_id!=-1)
	{
		
		c_alldata[m_id].c_disp.innerHTML="";
		c_alldata.splice(m_id,1);
		 ref_thumb();

	}
	
}

function m_exist(m_id)
{
	m_id=$id(m_id);
	if(m_location(m_id)!=-1)
	{
		return true;
	}
	return false;
	
}
function m_location(m_id)
{
	for(var i=0;i<c_alldata.length;i++)
	if(c_alldata[i].c_disp==m_id)
	return i;
	return -1;
}
function m_locbyd(m_Dat)
{
	for(var i=0;i<c_alldata.length;i++)
	if(c_alldata[i].c_url==m_Dat)
	return i;
	return -1;
}
//end of media


	
function o_append(msg,dest)
{
	dest.innerHTML=dest.innerHTML+msg;
}

// output information
function Output(msg,dest) 
{
	dest.innerHTML = msg;
}
// file drag hover
function FileDragHover(e)
{
	e.stopPropagation();
	e.preventDefault();
	e.target.className = (e.type == "dragover" ? "filedrag hover" : "filedrag");
}
// file selection handler 
function FileSelectHandler(e,file_dest,file_sel) 
{	
	if($id(file_sel).disabled==false && c_h5)
	{
		file_dest=$id(file_dest);
		FileDragHover(e);	
		var files = e.target.files || e.dataTransfer.files ;
		if(files.length==1 || (media.inherit=="slide" && files.length>=1))
		{
			pars_glob=0;
			 pars_sizeE=0;
			var temp=media.count-c_alldata.length;
			if(files.length<=temp)
			temp=files.length;
			else
			alert("Media content is Full delete some to add new ");
			for(var i=0;i<temp;i++)
			ParseFile(files[i],file_dest,temp-1);	
		
			
		}
		else  
		{			
			if(validimg(e.dataTransfer.getData("text/uri-list")))
			{
				Output('<img src="' + e.dataTransfer.getData("text/uri-list") + '" /></p>',file_dest);	
				m_add(null,e.dataTransfer.getData("text/uri-list"),"imageurl",file_dest);		
			}
			else
			{
			}
		}
	}
	else
	{
		alert("please select a media type as image to drop image or Your browser is not supported");
	}
	
}
function equals(x,f)
{
	if(x==f)
	return true;
	else
	return false;
}
// output file information
var pars_glob=0;
var pars_sizeE=0;

//displays the dropped file 
function ParseFile(file,dest,dis) 
{
	// display an image
	if (file.type.indexOf("image") == 0)
	{
		var reader = new FileReader();
		reader.onload = function(e) {
			if(dis==0 || pars_glob==dis)
			{
				
				
				if(file.size <= $id("MAX_FILE_SIZE").value)
				{
				m_add(file,e.target.result,"file",dest,true);Output('<img src="' + e.target.result + '" />',dest);}
				else
				{
				pars_sizeE++;
				ref_thumb();
				}
				if(pars_sizeE>0)
				alert(pars_sizeE+" files has not been accepted because of the file size is greater than 2 mb");
			
			}
			else if(file.size <= $id("MAX_FILE_SIZE").value)
				m_add(file,e.target.result,"file",dest,false);
			else
			pars_sizeE++;						
										pars_glob++;
									 }
		reader.readAsDataURL(file);
	}
	else
	{
		alert("please upload only images");
	}
}
// upload JPEG files
function UploadFile(m_obj)
{
	
	var file=m_obj.c_data;	
	var xhr = new XMLHttpRequest();
	if (xhr.upload && (file.type == "image/jpeg" || file.type == "image/png") )
	 {track.act++;
		// create progress bar
		
		xhr.onreadystatechange = function(e) {
					if (xhr.readyState == 4) {
					if(xhr.status==200)
					{		
					track.cur++;
					track.finish();
					
					}
					else
					{}
					
				}
			};
		// start upload
		xhr.open("POST", "upload.php", true);
		xhr.setRequestHeader("X_FILENAME", m_obj.c_name);
		xhr.send(file);
		}
		else
		{
			
			
		}

	}


	// initialize
	function Init() {


		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			m_removeall();//clears any existing content
			
			c_h5=true; //html5 supported
		}
		else
		alert("please update your browser");

	}
function starter()
{
	// call initialization file
	if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
  Init();
	} else {
  	alert('The File APIs are not fully supported in this browser.');
	}

}

///image valid

function validimg(url) {

    if (!checkURL(url)) {
        alert("It looks like the url that you had provided is not valid! Please only submit correct image file. We only support these extensions:- jpeg, jpg, gif, png.\n The url provided was \n"+url);
        return(false);
    }
	else
	return true;
	
  
	  // can't submit the form yet, it will get sumbitted in the callback
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

	
    