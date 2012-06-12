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
  s_selmedia("image","img_fselect",'video','img')
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
	if($(file_sel).disabled==false && c_h5)
	{
		file_dest=$(file_dest);
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
function m_removeall()
{}
