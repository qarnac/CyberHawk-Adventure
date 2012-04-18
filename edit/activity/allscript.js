
//keypress control
	var k_press=true;
	function keypress(k_what)
	{
		k_press=k_what;
	}
	window.onkeydown = keyreact;
	function keyreact()
	{
		if(!k_press)
		return false;
	}
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
					if(what=="location")
					{	
						a = a.split(','); 
						var result=[];
						while(a[0]) 
						{
							result.push(a.splice(0,4));
						}
						locload(result);
					}
					else if(what=="activity")
					{
						actload(a);
					}
    			}
  			}
 			document.getElementById("activity").innerHTML="";
			xmlhttp.open("GET","../ajax.php?what=activity&get="+what+"&id="+id+"&loc="+a_loc.value,true);
			xmlhttp.send();
		}
		else if(what=="location")
		{
			a_loc.disabled=true
			document.getElementById("act").disabled=true;
			document.getElementById("activity").innerHTML="";
		}
		else
			document.getElementById("activity").innerHTML="";
	}
// End of ajax	
	
//----selction
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
		alert("you are missing some mdeia files");
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
				return true;			
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


function s_selmedia(val,img,vide,off1,off2,dest)
{
	dest=$id(dest);
	var img1=document.getElementById(img);
	var video1=document.getElementById(vide);
	video1.value="";
	img1.file=""
	img1.value="";
	m_remove(dest);
	img1.removeAttribute('c_req');
	video1.removeAttribute('c_req');
	if(val=="img")
	{	
		img1.disabled=false;
		img1.focus();
		video1.disabled=true;
		img1.setAttribute('c_req','true');
		video1.setAttribute('c_req','false');
	}
	else if(val=="video")
	{	
		img1.disabled=true;
		video1.disabled=false;
		//video1.focus();
		video1.setAttribute('c_req','true');
		img1.setAttribute('c_req','false');
	}
	else
	{
		img1.disabled=true;
		video1.disabled=true;
		video1.setAttribute('c_req','false');
		img1.setAttribute('c_req','false');
	}
	if(c_h5)
	{
		if(off1)
			document.getElementById(off1).removeAttribute('c_req');
		if(off2)
			document.getElementById(off2).removeAttribute('c_req');
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





function up_db(c)
{

	var disp=$id("process");
	var dark=$id("darkenBackground");
	disp.style.display='';
	dark.style.display='';
	
	var locid=$id("loc").value;
	keypress(false);
	var temp="";
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
					temp=temp+c[i].name+" "+c[i].value+"<br>";
			}
		}
		
		for(var i=0;i<find_radio.length;i++)
		{
			var s=c[find_radio[i]];
			for (x in s)
			if(s[x].checked)
			{
				temp=temp+find_radio[i]+"="+s[x].value+"&";		
			}
		}
		
		temp=temp+"<br>Location id"+locid;
		disp.innerHTML=disp.innerHTML+temp;
		
		for(var i=0;i<c_alldata.length;i++)
		{
			if(c_alldata[i].c_type=="file")
				{
					disp.innerHTML=disp.innerHTML+'<div id="progress"></div> ';
					UploadFile(c_alldata[i]);
					temp=temp+"<br>"+c_alldata[i].c_disp.id+"="+c_alldata[i].c_name;
				}
				else
				{
					temp=temp+"<br>"+c_alldata[i].c_disp.id+"="+c_alldata[i].c_type;
				}
		}
	
	
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
var c_alldata=new Array();
var c_h5=false;
function m_at(m_id)
{
	if(m_location(m_id)!=-1)
	{
		return c_alldata[m_id];
	}
	
}
function m_add(m_data,m_url,m_type,m_disp)
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
function m_objconst(m_data,m_url,m_type,m_disp)
{
		obj=new Object();
		obj.c_data=m_data;
		obj.c_url=m_url;
		obj.c_type=m_type;
		obj.c_disp=m_disp;
		if(m_data!=null)
		obj.c_name=m_disp.id+"_"+m_type+"_"+Date.now()+"."+m_f_type(m_data.type);
		else
		obj.c_name=m_disp.id+"_"+m_type+"_"+Date.now();
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
}

function m_remove(m_disp)
{
	if(m_location(m_disp)!=-1)
	{
		var m_id=m_location(m_disp);
		c_alldata[m_id].c_disp.innerHTML="";
		c_alldata.splice(m_id,1);
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
//end of media


	


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
// file selection
function FileSelectHandler(e,file_dest,file_sel) 
{	
	if($id(file_sel).disabled==false && c_h5)
	{
		file_dest=$id(file_dest);
		FileDragHover(e);	
		var files = e.target.files || e.dataTransfer.files ;
		if(files.length==1)
		{
			ParseFile(files[0],file_dest);	
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
// output file information
function ParseFile(file,dest) 
{
	// display an image
	if (file.type.indexOf("image") == 0)
	{
		var reader = new FileReader();
		reader.onload = function(e) {	Output('<img src="' + e.target.result + '" />',dest);
										m_add(file,e.target.result,"file",dest);
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
	if (xhr.upload && (file.type == "image/jpeg" || file.type == "image/png") && file.size <= $id("MAX_FILE_SIZE").value)
	 {
		// create progress bar
		var o = $id("progress");		
		o.innerHTML="";
		var progress = o.appendChild(document.createElement("p"));
		progress.appendChild(document.createTextNode("upload " + file.name));
		// progress bar
		xhr.upload.addEventListener("progress", function(e) {
				var pc = parseInt(100 - (e.loaded / e.total * 100));
				progress.style.backgroundPosition = pc + "% 0";
			}, false);
		// file received/failed
		xhr.onreadystatechange = function(e) {
					if (xhr.readyState == 4) {
					if(xhr.status==200)
					{
					progress.className =  "success";
					
					
					}
					else
					progress.className =  "failure";
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

	/*	var fileselect = $id("fileselect"),
			filedrag = $id("filedrag");
			//submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);
*/
		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
	/*		filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";
*/
			
			c_h5=true;
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

	
    