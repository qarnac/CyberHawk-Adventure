<?php 
header ("Content-Type:text/xml");  //php will act as a xml document to the client side
//================Database====================================
include "credentials.php";	 //dbase credentials + dbase connection

   //pulls quadrant id from the url

$table_id = 'location'; //this table has the information about the locations of each quadrant
$query = "SELECT * FROM $table_id";
$locations = mysql_query($query, $dbconnect);
$table_id = 'quadrants'; //this table has the information about all the quadrants
$query = "SELECT * FROM $table_id";
$quadrants = mysql_query($query, $dbconnect);

//=============================================================

$doc=new DOMDocument('1.0');	
$x_sectors=$doc->createElement('Sectors');	

//===== Quadrants =========
//this part creates the xml elements which does have all the required information about a quadrant
 ///$i is used to keep track of how many executions happened in while loop and also create new elements at particular value of i.

while($quadrant=mysql_fetch_assoc($quadrants))
{
$x_sector=$doc->createElement("Sector");
$x_sector->appendChild($doc->createElement("MinLatitude",$quadrant['minlat']));
$x_sector->appendChild($doc->createElement("MaxLatitude",$quadrant['maxlat']));
$x_sector->appendChild($doc->createElement("MinLongitude",$quadrant['minlng']));
$x_sector->appendChild($doc->createElement("MaxLongitude",$quadrant['maxlng']));
$x_locations=$doc->createElement('Locations');

	while($location=mysql_fetch_assoc($locations))
	{
		if($location['belong']==$quadrant['id'])
		{
			$x_location=$doc->createElement('location');
			$x_location->appendChild($doc->createElement('Name',$location['title']));
			$x_location->appendChild($doc->createElement('Latitude',$location['latitude']));
			$x_location->appendChild($doc->createElement('Longitude',$location['longitude']));
			$x_location->appendChild($doc->createElement('ConfigFile'));
			$x_locations->appendChild($x_location);
		}
		
	}
	mysql_data_seek($locations,0);
	$x_sector->appendChild($x_locations);
$x_sectors->appendChild($x_sector);

}




$x_sectors=$doc->appendChild($x_sectors);

echo $doc->saveXML();


mysql_close($dbconnect);

?>