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
		huntboundary=new georect(new google.maps.LatLng(hunt['minlat'],hunt['minlng']),new google.maps.LatLngft(hunt['maxlat'],hunt['maxlng']));
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
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked) {
			contents['answer'] = x[i].value;
			break;
		}
	}
	var y=new Array("textarea","text","number");
	for(var i = 0; i < form.length; i++) {
		if (y.indexof(form[i].type)!=-1)
			contents[form[i].name] = form[i].value;
	}
	if (morc && morc.verify()) {
		contents['media'] = morc;
		contents['huntid'] = document.getElementById("selecthunt").value;
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
