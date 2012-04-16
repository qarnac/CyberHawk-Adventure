
//keypress control
var k_press=true;

	window.onkeydown = keypress;

function keypress()
{
	if(!k_press)
	return false;
 
}
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
	{a_loc.disabled=true
	document.getElementById("act").disabled=true;
	document.getElementById("activity").innerHTML="";
	}
	else
	document.getElementById("activity").innerHTML="";
}
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
function validateform()
{
	var x=[document.forms["quadrant"]["minlat"].value,document.forms["quadrant"]["minlng"].value,document.forms["quadrant"]["maxlat"].value,document.forms["quadrant"]["maxlng"].value];
	
	for(var i=0;i<x.length;i++)
	{
		if(x[i]==null || x[i] =="" || !(x[i]<0 || x[i] >0))
		{
			alert("please select a quadrant");
			return false;
			
		}
	}
	var y=document.forms["quadrant"]["title"].value;
	
	if(y==null || y=="" || y.indexOf("<")>=0 || y.indexOf(">")>=0)
	{
		alert("Enter a valid title");
		return false;
	}
	
}
function check(c)
{
	var x=[];
	
	for(var i=0;i<c.length;i++)
	if(c[i].getAttribute("c_req")=="true")
		if(!filter(c[i],c))
		{
			x.push(i);
			c[i].value=null;
		c[i].style.borderColor='red';
		}else
		c[i].style.borderColor='#aacfe4';
		if(x.length>0)
		{var t="";
		for(y in x)
		t=t+c[x[y]].name+"\n";
		alert("please fill following mandatory fields \n "+t);
		}
		if(x.length==0)
		{
			up_db(c);
		}
		
	
}
function up_db(c)
{
	if(c_h5)
	{
		if(c_fu=="null")
		{
			alert("please select a media");
			return false;
		}
	}
	var disp=$id("process");
	var dark=$id("darkenBackground");
	var locid=$id("loc").value;
	
	k_press=false;
	 disp.style.display='';
	dark.style.display='';
	var temp="";
	var find_radio=[];
	if(c_h5)
	{
		
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
		
		if(c_fu=="file")
		{
			disp.innerHTML=disp.innerHTML+'<div id="progress"></div> ';
			UploadFile();
			
			
		}
		else if(c_fu=="url"||c_fu=="video")
		{
			temp=temp+"media_url="+c_url;
		}
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
  


  }
  else
  { alert('Invalid File'+obj.value);
	  obj.value=null;
  
  }
 } 
}
function s_selmedia(val,img,vide,off1,off2)
{
	var img1=document.getElementById(img);
	var video1=document.getElementById(vide);
	video1.value="";
	img1.file=""
	img1.value="";
	cleardrag();
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
	video1.focus();
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
function selvid(vid)
{
	var s=vid.indexOf("v=")+2;
	if(s!=-1)
	{
	var e=vid.indexOf("&",s);
	if(e==-1)
	e=vid.length;
	vid=vid.substring(s,e);
	
	c_fu="video";
	c_url='http://www.youtube.com/embed/'+vid;
	$id("filedrag").innerHTML="<iframe src="+c_url+" frameborder='0' allowfullscreen style='width:inherit;height:inherit;'></iframe>";
	
	}else
	{alert("please copy video watch url directly dont copy embed url");}
	
	
	
}

//drag and drop
/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
var c_data="null";
var c_url="null";
var c_h5=false;
var c_fu="null";
function cleardrag()
{
	c_url="null";
	c_data="null";
	c_fu="null";
	$id("filedrag").innerHTML="";
	
}


	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}


	// output information
	function Output(msg) {
		
		var m = $id("filedrag");
		m.innerHTML = msg;
	}


	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {
		alert(this.id);
		if($id("fileselect").disabled==false)
		{
		cleardrag();
		FileDragHover(e);
		
		var files = e.target.files || e.dataTransfer.files ;
		
		if(files.length==1)
		{
			
			ParseFile(files[0]);
			
			}
			else  
			{
				
				if(validimg(e.dataTransfer.getData("text/uri-list")))
				{
					c_fu="url";
				Output('<img src="' + e.dataTransfer.getData("text/uri-list") + '" /></p>');	
				c_url=e.dataTransfer.getData("text/uri-list");
				
				}
				else
				{
					}
			}
		// process all File objects
	/*	for (var i = 0, f; f = files[i]; i++) {
			ParseFile(f);
			UploadFile(f);
		}*/
		}
		else
		{alert("please select a media type as image to drop image");}
	}


function concatObject(obj) {
  str='';
  for(prop in obj)
  {
    str+=prop + " value :"+ obj[prop]+"<br>";
  }
  return(str);
}
	// output file information
	function ParseFile(file) {

		Output(
			"<p>File information: <strong>" + file.name +
			"</strong> type: <strong>" + file.type +
			"</strong> size: <strong>" + file.size +
			"</strong> bytes</p>"
		);

		// display an image
		if (file.type.indexOf("image") == 0) {
			var reader = new FileReader();
			reader.onload = function(e) {
				Output('<img src="' + e.target.result + '" />');c_url=e.target.result;
			}
			c_fu="file";
			c_data=file;
			
			reader.readAsDataURL(file);
		}else
		{alert("please upload only images");}

		// display text
		

	}


	// upload JPEG files
	function UploadFile() {
		var file=c_data;
		
		var xhr = new XMLHttpRequest();
		if (xhr.upload && (file.type == "image/jpeg" || file.type == "image/png") && file.size <= $id("MAX_FILE_SIZE").value) {

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
			xhr.setRequestHeader("X_FILENAME", file.name);
			xhr.send(file);

		}
		else
		{
			
			
		}

	}


	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("filedrag");
			//submitbutton = $id("submitbutton");

		// file select
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {

			// file drop
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
			filedrag.style.display = "block";

			
			c_h5=true;
		}

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

	
    