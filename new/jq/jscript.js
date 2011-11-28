function viid1()
{

var vid=document.getElementById("viid").value;
			
	
if (vid.length==0)
  { 
  
  return;
  }
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
    document.getElementById("ajax").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET","parse2.php?viid="+vid,true);
xmlhttp.send();

	
	}
function kH(e) {
var pK = e ? e.which : window.event.keyCode;
return pK != 13;
}
document.onkeypress = kH;
if (document.layers) document.captureEvents(Event.KEYPRESS);
function dispt(str)
{
	document.getElementById("reltitle").innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+str;
	$(document).ready(function(){

//Larger thumbnail preview 

$("ul.thumb li").hover(function() {
	
	$(this).css({'z-index' : '10'});
	$(this).find('img').addClass("hover").stop()
		.animate({
			marginTop: '-110px', 
			marginLeft: '-110px', 
			top: '50%', 
			left: '50%', 
			width: '174px', 
			height: '174px',
			padding: '20px' 
		}, 200);
	
	} , function() {
	$(this).css({'z-index' : '0'});
	$(this).find('img').removeClass("hover").stop()
		.animate({
			marginTop: '0', 
			marginLeft: '0',
			top: '0', 
			left: '0', 
			width: '100px', 
			height: '100px', 
			padding: '5px'
		}, 400);
});

//Swap Image on Click
	
 
});
}
function curtitle()
{
	document.getElementById("reltitle").innerHTML="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Related";
}

function showHint()
{
	
	var str=document.getElementById('sertext').value;
	
			var rel=document.getElementById('sort').value;
	
if (str.length==0)
  { 
  document.getElementById("vid").innerHTML="";
  return;
  }
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
    document.getElementById("ajax").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET","parse.php?q="+str+"&o="+rel,true);
xmlhttp.send();
}
function fshare(id)
{
	var url=document.getElementById('shareurl').value;
	window.open('https://www.facebook.com/sharer.php?u='+url,'fshare','toolbar=0,status=0,width=626,height=436').focus();
	return false;
	}
function replace1(str,sum,tit)
{
	document.getElementById('title').innerHTML="<h2>"+tit+"</h2>";
	document.getElementById('disp').src="http://www.youtube.com/embed/"+str+"?autoplay=1";
	document.getElementById("sum").innerHTML=sum;
	document.getElementById('share').innerHTML="<img src='/images/fb.png' onclick='fshare(this.name)' name="+str+"/>"
	document.getElementById("shareurl").value="http://seedspirit.com/?id="+str;
}
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-22354300-6']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();


