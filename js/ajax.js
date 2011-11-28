// JavaScript Document
function remo()
{

//var vid=document.getElementById("viid").value;
			
	
//if (vid.length==0)
  //{ 
  
  //return;
  //}
  
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
		//alert (xmlhttp.responseText);
		
		        var text=xmlhttp.responseText;
			      if (window.ActiveXObject){
                  var doc=new ActiveXObject('Microsoft.XMLDOM');
                  doc.async='false';
                  doc.loadXML(text);
                } else {
                  var parser=new DOMParser();
                  var doc=parser.parseFromString(text,'text/xml');
                }
				window.my=doc;
				ss(doc);
    }
  }
xmlhttp.open("GET","parse.php?viid="+10,true);
xmlhttp.send();	







	}
	function ss(x)
	{	
	
		task = new Task(x);
				task.parse();  

				task.addMarkersTo(ge, gm);
				task.start();	
				
				
				truck = new Truck();
				
				EnableControlKeys();
	}
		
		