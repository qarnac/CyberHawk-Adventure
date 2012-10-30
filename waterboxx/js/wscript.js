/*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * verifies all the form data
 * submits the form data and image data to server
 */
/*
var multiple='<? echo $metaar[0]['content'];?>';
var hunts=JSON.parse('<? echo $hunts; ?>');
for(x=0;x<hunts.length;x++)
$('selecthunt').options[$('selecthunt').options.length]=new Option(hunts[x]['title'],x);
*/
var hunts;
var multiple;
function wscript_init(x) {
	hunts = JSON.parse(x);
	$('username').innerHTML=hunts[0];

	multiple=hunts[2];
	hunts=hunts[1];
	for ( x = 0; x < hunts.length; x++)
		$('selecthunt').options[$('selecthunt').options.length] = new Option(hunts[x]['title'], hunts[x]["id"]);
		
}					
var uniq=Math.floor((Math.random()*100)+1);
//shortcut to get object with their id
function $(x) {return document.getElementById(x);}

//this function invoked when student selects a hunt
function huntselection(x)
{ 
	// When the user selects the null select, it will no longer even attempt to load activities.
	if ((x = document.getElementById("selecthunt").selectedIndex-1) >= 0) {
		var hunt=hunts[x];
		// TODO convert  to a google maps bounds object to delete georect
//		var southWestPoint = new google.maps.LatLng(hunt['minlat'], hunt['minlng']);
//		var northEastPoint = new google.maps.LatLng(hunt['maxlat'], hunt['maxlng']);
//		huntboundary = new google.maps.LatLngBounds(southWestPoint, northEastPoint);
		huntboundary=new google.maps.LatLngBounds(new google.maps.LatLng(hunt['minlat'],hunt['minlng']),new google.maps.LatLng(hunt['maxlat'],hunt['maxlng']));
		$('activity').innerHTML=multiple;
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
	var inputTypes=new Array("textarea","text","number", "select-one");
	for(var i = 0; i < form.length; i++) {
		if (inputTypes.indexOf(form[i].type)!=-1)
		{
			contents[form[i].name] = form[i].value;
		} 
	}
	if (morc && morc.verify()) {
		contents['media'] = morc;
		contents['lat']=morc.loc.lat();
		contents['lng']=morc.loc.lng();
		contents['huntid'] = document.getElementById("selecthunt").value;
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
				console.log("success");
			else
				alert("An error has occured while attempting to upload your file.");
		});
	}
	return false;
}