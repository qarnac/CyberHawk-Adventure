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
	if(x!='null')
	{	var hunt=hunts[x];
	//huntboundary=new georect(new latlng(hunt['minlat'],hunt['minlng']),new latlng(hunt['maxlat'],hunt['maxlng']));
	ajax("id="+hunt['id'],'retrive.php',dispactivity);
	//$('activity').innerHTML=multiple;
	starter();}

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
var activities=new Array();
var feed={};
function dispactivity(x)
{
	if(x=="false")
	alert("No one has created acticity yet");
	else
	{
		x=JSON.parse(x);
		
			var temp=document.createElement('select');
			temp.id='slist';
			temp.size=10;
			temp.multiple=multiple;
	
		for ( m = 0; m < x.length; m++) {

			if (activities.hassid(x[m]['student_id']) == 'false') {
				var z = new Object();
				z.sid = x[m]['student_id'];
				z.contents = new Array();
				z.contents.push(x[m]);
				activities.push(z);
				temp.options[temp.options.length] = new Option(x[m]['firstname'] + " " + x[m]['lastname'], x[m]['student_id']);

				temp.onchange = function() {
					$('activity').innerHTML = "";
					var x = activities.hassid(this.value);
					if (x != "false") {
						for ( i = 0; i < activities[x].contents.length; i++)
							actdisp(activities[x].contents[i])
					} else
						alert("something went wrong")
				};

			} else {
				var z = activities.hassid(x[m]['student_id']);
				activities[z].contents.push(x[m]);
			}
			var z=new Object();
			z.grant="true";
			z.comment='';
			feed[x[m]['id']]=z;

		}

		$('students').appendChild(temp);
		//actdisp(x[m]);
	}
	
}

function actdisp(x)
{
	var div=document.createElement('div');
	div.className='elem';
	
	var img=document.createElement('img');
	img.src="../php/image.php?id="+x['media_id'];
	img.onmouseover=function(){
		this.style.height='281px';this.style.width='450px';}
	img.onmouseout=function(){
		this.style.height='80px';this.style.width='100px';}
		
	div.appendChild(img);
	var dummy=document.createElement('div');
	dummy.className='dummyimg';
	div.appendChild(dummy);
	div.appendChild(ce('label',x['firstname']+" "+x['lastname']))
	var ans=JSON.parse(x['choices']);
 	temp=ce('label','Multiple Chocie Question : '+x['mquestion']);
 	temp.style.width='550px';
	div.appendChild(temp);
	 temp=ce('div','');
	temp.className='clear';
	div.appendChild(temp);
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
	div.appendChild(ce('label','About    : '+x['aboutmedia']));
	div.appendChild(ce('label','Reason   : '+x['whythis']));
	div.appendChild(ce('label','Evidence : '+x['howhelpfull']));
	div.appendChild(ce('label','Question : '+x['yourdoubt']));
		 temp=ce('div','');
	temp.className='clear';
	div.appendChild(temp);
	var comments=ce('label','Comments');
	comments.style.width='80px';
	var temp1=document.createElement('textarea');

	temp1.onchange = function() {
		feed[x['id']].comment = this.value;
	}
	comments.appendChild(temp1);
	
	temp=document.createElement('select');
	temp.options[temp.options.length]=new Option("ACCEPT","true");
	temp.options[temp.options.length]=new Option("DECLINE","false");
	
	temp.onchange = function() {
		if (this.value == "false")
		{
			this.parentNode.insertBefore(comments, this.nextSibling);
			feed[x['id']].grant="false";
		}
			else
			{
				this.parentNode.removeChild(comments);
				feed[x['id']].grant='true';
				feed[x['id']].comment='';
			}
			
	}; 
	temp.value=feed[x['id']].grant;

	div.appendChild(temp);
	if(temp.value=="false")
	{
		comments.childNodes[1].value=feed[x['id']].comment;
		temp.parentNode.insertBefore(comments, temp.nextSibling);
	}
	
	
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
Array.prototype.hassid=function(v){
for (i=0; i<this.length; i++){
if (this[i].sid==v) return i;
}
return "false";
}
