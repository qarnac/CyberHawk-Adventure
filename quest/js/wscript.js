 /*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * verifies all the form data
 * submits the form data and image data to server
 */

 
var hunts;
var multiple;
function wscript_init(x) {                                                             
	hunts = JSON.parse(x);
	student=JSON.parse(hunts[0]);
	$('username').innerHTML=student.firstname;
	multiple=hunts[2];
	hunts=hunts[1];
	
	if(student.parentHunt==0){
		sessionStorage.hunts=JSON.stringify(hunts);
		for ( x = 0; x < hunts.length; x++)
			$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]["id"]);	
	} else{
		for ( x = 0; x < hunts.length; x++)
			if(student.parentHunt==hunts[x].id){
				$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]["id"]);
				sessionStorage.hunts=JSON.stringify(new Array(hunts[x]));
				return;
			}
	}
		
}					
var uniq=Math.floor((Math.random()*100)+1);
//shortcut to get object with their id
function $(x) {return document.getElementById(x);}

//this function invoked when student selects a hunt
function huntselection(x)
{ 

	if(typeof(Storage)!=="undefined"){
		sessionStorage.isEdit=false;
	} else{
		// TODO: How to deal with user not supporting storage.
	}
	// When the user selects the null select, it will no longer even attempt to load activities.
	if ((x = document.getElementById("selecthunt").selectedIndex-1) >= 0) {
		var hunt=hunts[x];
		huntboundary=new google.maps.LatLngBounds(new google.maps.LatLng(hunt['minlat'],hunt['minlng']),new google.maps.LatLng(hunt['maxlat'],hunt['maxlng']));
		$('activity').innerHTML=multiple;
		if(hunt.additionalQuestions==undefined || hunt.additionalQuestions==""){
		document.getElementsByName("optionalQuestion1")[0].style.display="none";
		document.getElementsByName("optionalAnswer1")[0].style.display="none";
		document.getElementsByName("optionalQuestion2")[0].style.display="none";
		document.getElementsByName("optionalAnswer2")[0].style.display="none";
		document.getElementsByName("optionalQuestion3")[0].style.display="none";
		document.getElementsByName("optionalAnswer3")[0].style.display="none";
		} else{
	
		}
		starter();
	}
}
//has the boundary information of selected hunt
var huntboundary;
//invoked when student submits the form .checks for validity of data and submits the information through ajax
function check(form)
{
	var contents={};
	var x = document.getElementsByName('answer');
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) {
			contents['answer'] = x[i].value;
			break;
		}
	}
	var y=new Array("textarea","text","number");
	for(var i = 0; i < form.length; i++) {
		if (y.indexOf(form[i].type)!=-1)
			contents[form[i].name] = form[i].value;
	}
	if (morc && morc.verify()) {
		contents['media'] = morc;
		contents['huntid'] = document.getElementById("selecthunt").value;
		contents['lat']= morc.loc.lat();
		contents['lng']=morc.loc.lng();
		// Checks to make sure that all of the required attribute are filled in.
		if(contents.aboutmedia && contents.a && contents.b && contents.howhelpful && contents.mquestion && contents.whythis && contents.yourdoubt){
			contents.status="Unverified";
		} else{
			contents.status="Incomplete";
		}
		contents = JSON.stringify(contents);
		contents = "content="+contents;
		ajax(contents, PHP_FOLDER_LOCATION + "user_upload.php", function(x) {
			if (x == "true")
				window.location.reload();
			else
				alert("An error has occured while attempting to upload your file.");
		});
	}
	return false;
}
