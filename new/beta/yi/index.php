<html>
<head>
<script type="text/javascript">
function showHint(str)
{
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
    document.getElementById("vid").innerHTML=xmlhttp.responseText;
    }
  }
xmlhttp.open("GET","pars.php?q="+str,true);
xmlhttp.send();
}
</script>
</head>
<body>

<p><b>Start typing a name in the input field below:</b></p>
<form> 
First name: <input type="text" onkeyup="showHint(this.value)" size="20" />
</form>
<div>video <span id="vid"></span></div>

</body>
</html>