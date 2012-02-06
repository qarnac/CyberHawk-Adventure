<?php 
header ("Content-Type:text/xml");  //php will act as a xml document to the client side

include "credentials.php";	 //dbase credentials
if(!$dbconnect = mysql_connect($host, $user, $pass)) {	 //connects to dbase host
   echo "Connection failed to the host";
   exit;
} // if
if (!mysql_select_db('cyberhawk')) {	//selects dbase
   echo "Cannot connect to database 'test'";
   exit;
} // if
$what=$_REQUEST['q'];   //pulls quadrant id from the url
//pulls necessar data from database as this document will be using information from three tables location,quadrants,questions
$table_id = 'location';
$query = "SELECT * FROM $table_id where belong=$what";
$location = mysql_query($query, $dbconnect);
$table_id = 'quadrants';
$query = "SELECT * FROM $table_id where id=$what";
$quadrants = mysql_query($query, $dbconnect);
//---


$doc=new DOMDocument('1.0');	//creates a new xml document
$root=$doc->createElement('task');	

//===== Quadrants =========
$i = 0;$who=$root;
$result=mysql_fetch_array($quadrants);
while ($i < mysql_num_fields($quadrants)-1) {
   
    $meta = mysql_fetch_field($quadrants, $i);
    if (!$meta) {
        
    }
	$column=$meta->name;
	if($i==6)
	{
	$zone=$doc->createElement("zone");
	$topleft=$doc->createElement("topleft");
	$who=$topleft;	
	}
	
	
$element=$doc->createElement($column,$result[$column]);

$element=$who->appendChild($element);
if($i==7)
	{$topleft=$zone->appendChild($topleft);
	$who=$zone;
	}
    $i++;
}
$zone=$root->appendChild($zone);
//=================== markers ==================
$markers=$doc->createElement("markers");

$i = 0;$who=$root;

while ($result=mysql_fetch_array($location)) {
   
    
	$marker=$doc->createElement("marker");
	$marker->setAttribute('type',$result['marker']);
	
	$element=$doc->createElement("title",$result['title']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("synopsis",$result['synopsis']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("latitude",$result['latitude']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("longitude",$result['longitude']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("icon",$result['icon']);
	$element=$marker->appendChild($element);
	
	$content=$doc->createElement("content");
	$pagedir=$doc->createElement('page_dir',$result['pagedir']);
	$pagedir=$content->appendChild($pagedir);
	$pages=$doc->createElement("pages");
	$id=$result['id'];
	// pulls all the activities
	$table_id = 'questions';
	$query = "SELECT * FROM $table_id where qbelong=$id";
	$questions = mysql_query($query, $dbconnect);
	//
	while($p=mysql_fetch_array($questions))
	{
		$page=$doc->createElement("page");
		
		$element=$doc->createElement("path",$p['path']."?qid=".$p['qid']);
		$element=$page->appendChild($element);
		
		$element=$doc->createElement("name",$p['name']);
		$element=$page->appendChild($element);
		
		$element=$doc->createElement("status",$p['status']);
		$element=$page->appendChild($element);
		
		$page=$pages->appendChild($page);
		
	}
	$pages=$content->appendChild($pages);
	$content=$marker->appendChild($content);
	$marker=$markers->appendChild($marker);
}
mysql_close($dbconnect);
$markers=$root->appendChild($markers);


$root=$doc->appendChild($root);

echo $doc->saveXML();



?>