
<?php
//Code to upload the data to DB from front end . Pending not yet completed.
if($_SERVER['REQUEST_METHOD']=="POST")
{
	include "../../php/credentials.php";
	 if(isset($_POST['formdata']))
	 {
		 $data=$_POST['formdata'];
		 $data=json_decode($data);
		switch($data['type'])
		{
			case "null":
			break;
			case "image":
			break;
			case "dbimg":
			break;
			case "slide":
			
			$query1="INSERT INTO Persons (FirstName, LastName, Age)VALUES ('Peter', 'Griffin',35)";
			break;
			case "video":
			break;
		}
		
		
		
		
		
		
	}

	
}



?>