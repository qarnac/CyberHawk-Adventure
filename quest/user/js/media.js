/**
 * @author sabareesh kkanan subramani
 * File unused but it will be useful while handling multiple images
 * this will help displaying thumbnails. 
 */

function ref_thumb() {
	thum = $("thumb");

	var t_img = "";
	var t_loc = 0;
	for (var i = 0; i < c_alldata.length; i++) {
		t_loc = m_locbyd(c_alldata[i].c_url);
		t_img = t_img + "<img src='" + c_alldata[i].c_url + "' style='float:left' class='thumbnail'/><input type='text' style='width:100px;float:left;margin:0 0 0 0;' onchange='c_alldata[" + i + "].c_title=this.value;' placeholder='Tag'/> <a href='JavaScript:void(0);' onclick='m_remove(" + t_loc + ")'>delete</a><div class='clear'></div>";

	}
	Output(t_img, thum);
}

function drawimg(x) {
	$('img').innerHTML = "<img src='" + x.file.dataurl + "'></img>";
}
