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
	/displays the dropped file 
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
				alert(pars_sizeE+" files has not been accepted because of the file size is greater than 1 mb");
			
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
				if(c_alldata.length<media.count)
				{
				Output('<img src="' + e.dataTransfer.getData("text/uri-list") + '" /></p>',file_dest);	
				m_add(null,e.dataTransfer.getData("text/uri-list"),"imageurl",file_dest,true);		
				
				}else
				alert("Media content is Full delete some to add new ");
				
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