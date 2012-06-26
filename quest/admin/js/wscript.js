/*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * verifies all the form data
 * submits the form data and image data to server
 */
var uniq=Math.floor((Math.random()*100)+1);
//shortcut to get object with their id
function $(x)
{return document.getElementById(x);}
//ajax POST request
function ajax(data,url,callback)
{	
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
    callback(xmlhttp.responseText);
    }
  }
xmlhttp.open("POST",url,true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send(data);
}
//this function invoked when student selects a hunt
function huntsel(x)
{ 
	var hunt=hunts[x];
	//huntboundary=new georect(new latlng(hunt['minlat'],hunt['minlng']),new latlng(hunt['maxlat'],hunt['maxlng']));
	ajax("id="+hunt['id'],'retrive.php',dispactivity);
	//$('activity').innerHTML=multiple;
	starter();
}
//has the boundary information of selected hunt
var huntboundary;
//invoked when student submits the form .checks for validity of data and submits the information through ajax
function check(form,exe)
{
	if(exe)
	{
		
		var contents={};	
		var x=document.getElementsByName('answer');
		for(var i=0;i<x.length;i++)
		{
			if(x[i].checked)
			contents['answer']=x[i].value;
			break;
		}
		var y=new Array("textarea","text","number");
		for(var i=0;i<form.length;i++)
		{
		if(y.has(form[i].type))
			contents[form[i].name]=form[i].value;	
		}
		if(morc && morc.verify())
		{contents['media']=morc;
		contents['huntid']=hunts[0]['id'];
		contents=JSON.stringify(contents);
		contents="content="+contents;
	
			ajax(contents, "upload.php", function(x) {
				if (x == "true")
					alert("sucess");
				else
					alert(x);
					
			}); 

	}
	else
	alert("please Select a Image");
	}
	return false;
}
//displays acticity created by students
function dispactivity(x)
{
	if(x=="false")
	alert("No one has created acticity yet");
	else
	{
		x=JSON.parse(x);
		for(m=0;m<x.length;m++)
		actdisp(x[m]);
	}
	
}
function actdisp(x)
{
	var div=document.createElement('div');
	div.className='elem';
	
	var img=document.createElement('img');
	img.src="../php/image.php?id="+x['media_id'];
	div.appendChild(img);
	var ans=JSON.parse(x['choices']);
 
	div.appendChild(ce('label','Multiple Chocie Question : '+x['mquestion']));
	for(y=0;y<ans.choices.length;y++)
	if(ans.choices[y].ans=="true")
	{
		var temp=ce('label',ans.choices[y].choice+" . "+ans.choices[y].content);
		temp.style.color="green";
		div.appendChild(temp);
	}
	else
	div.appendChild(ce('label',ans.choices[y].choice+" . "+ans.choices[y].content));
	 temp=ce('div','');
	temp.className='clear';
	div.appendChild(temp);
	
	div.appendChild(ce('label','LAT : '+x['lat']));
	div.appendChild(ce('label','LNG : '+x['lng']));
	div.appendChild(ce('label','About Picture : '+x['aboutmedia']));
	div.appendChild(ce('label','Reason to choose this picture : '+x['whythis']));
	div.appendChild(ce('label','How does this picture show what you have learned about in your science class ?  : '+x['howhelpfull']));
	div.appendChild(ce('label','What is a question you have about this picture ? : '+x['yourdoubt']));
	 temp=ce('div','');
	temp.className='clear';
	div.appendChild(temp);
	temp=ce('label','Comments');
	temp.style.width='50px';
	temp.appendChild(document.createElement('textarea'));
	div.appendChild(temp);
	temp=document.createElement('select');
	temp.options[temp.options.length]=new Option("ACCEPT","true");
	temp.options[temp.options.length]=new Option("DECLINE","false");
	div.appendChild(temp);
		 temp=ce('div','');
	temp.className='clear';
	div.appendChild(temp);
	div.appendChild(document.createElement('hr'));
	$('activity').appendChild(div);

	
}
//
function ce(x,y)
{
	x= document.createElement(x);
	x.innerHTML=y;
	return x;
}
// a custom prototype thats been added to array object to find existence of particular value
Array.prototype.has=function(v){
for (i=0; i<this.length; i++){
if (this[i]==v) return true;
}
return false;
}