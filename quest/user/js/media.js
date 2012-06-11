/**
 * @author sabareesh kkanan subramani
 */
//handles media selection
media=new Object();
media.type="";
media.count=0;
media.inherit="";
media.img=function(types,inher,size,img,video){this.type=types;this.inherit=inher;this.count=size;img.disabled=false;img.focus();video.disabled=true;video.setAttribute('c_req','false');};

media.video=function(inher,size,img,video){this.type="video";this.inherit=inher;this.count=size;img.disabled=true;video.disabled=false;video.setAttribute('c_req','true');img.setAttribute('c_req','false');};

media.clear=function(img,video){this.type="";this.count=0;this.inherit="";img.disabled=true;video.disabled=true;video.setAttribute('c_req','false');img.setAttribute('c_req','false');};

//handles media after being dropped or selected
var c_alldata=new Array();
var c_h5=false;


function m_at(m_id)
{
	if(m_location(m_id)!=-1)
	{
		return c_alldata[m_id];
	}
	
}
function ref_thumb()
{
	thum=$("thumb");
	
	var t_img="";
	var t_loc=0;
	for(var i=0;i<c_alldata.length;i++)
	{
		t_loc=m_locbyd(c_alldata[i].c_url);
		t_img=t_img+"<img src='"+c_alldata[i].c_url+"' style='float:left' class='thumbnail'/><input type='text' style='width:100px;float:left;margin:0 0 0 0;' onchange='c_alldata["+i+"].c_title=this.value;' placeholder='Tag'/> <a href='JavaScript:void(0);' onclick='m_remove("+t_loc+")'>delete</a><div class='clear'></div>";
		
	}
	Output(t_img,thum);
}

function m_add(m_data,m_url,m_type,m_disp,dis)
{
	if(media.inherit=="slide")
	{
		
		c_alldata.push(m_objconst(m_data,m_url,m_type,m_disp));
	if(dis)
	{
	//	ref_thumb();
	}	
	}
	else 
	{
	if(m_location(m_disp)==-1)
	{	
		c_alldata.push(m_objconst(m_data,m_url,m_type,m_disp));
		//ref_thumb();
	}
	else
	{
		var m_temp=m_location(m_disp);
		c_alldata.splice(m_temp,1,m_objconst(m_data,m_url,m_type,m_disp));
		//ref_thumb();
	}
	}
	
}
function m_objconst(m_data,m_url,m_type,m_disp)
{
		obj=new Object();
		obj.c_data=m_data;
		obj.c_url=m_url;
		obj.c_type=m_type;
		obj.c_disp=m_disp;
		obj.c_title="image";
		
		var num=Date.now()+c_alldata.length+uniq;
		if(m_data!=null)
		{obj.ext=m_f_type(m_data.type);
			obj.c_name=m_disp.id+"_"+m_type+"_"+num+"."+obj.ext;}
		else
		{obj.c_name=m_disp.id+"_"+m_type+"_"+num;obj.ext="url";}
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
	// ref_thumb();
}

function m_remove(m_id)
{
	
	if(m_id!=-1)
	{
		
		c_alldata[m_id].c_disp.innerHTML="";
		c_alldata.splice(m_id,1);
		// ref_thumb();

	}
	
}

function m_exist(m_id)
{
	m_id=$(m_id);
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
function m_locbyd(m_Dat)
{
	for(var i=0;i<c_alldata.length;i++)
	if(c_alldata[i].c_url==m_Dat)
	return i;
	return -1;
}
function s_selmedia(val,img,video,dest)
{
	dest=$(dest);
	thumb=$("thumb");
	 img=$(img);
	 video=$(video);
	video.value="";

	dest.innerHTML="";
	m_removeall();
	img.removeAttribute('c_req');
	video.removeAttribute('c_req');
	if(val=="image")
	{	
		media.img("image","image",1,img,video);
		
		thumb.style.display="none";
	}
	else if(val=="video")
	{	
		media.video("video",1,img,video);
	
		thumb.style.display="none";
	}
	else if(val=="slide")
	{
		media.img("slide","slide",40,img,video);
		
		thumb.style.display="block";
	}
	else if(val=="dbimg")
	{
		media.img("dbimg","slide",2,img,video);
	
		thumb.style.display="block";
	}
	else
	{
	media.clear(img,video);
		
	}

}