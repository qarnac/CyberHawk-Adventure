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
var morc;
function FileSelectHandler(e) 
{	
		
		FileDragHover(e);	
		var files = e.target.files || e.dataTransfer.files ;
		if(files.length>=1)
		{
		var obj=new geocompress(files[0],"file");
		morc=obj;
	
		
	
		}
		else  
		{			
			if(validimg(e.dataTransfer.getData("text/uri-list")))
			{
				if(c_alldata.length<media.count)
				{
				geocompress(e.dataTransfer.getData("text/uri-list"),"iurl");	
				
				}else
				alert("Media content is Full delete some to add new ");
				
			}
			else
			{
			}
		}

	
}