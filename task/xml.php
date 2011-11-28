<?php 
  $employees = array(); 
  $employees [] = array( 
  'name' => 'Albert', 
  'age' => '34', 
  'salary' => "$10000" 
  ); 
  $employees [] = array( 
  'name' => 'Claud', 
  'age' => '20', 
  'salary' => "$2000" 
  ); 
   
  $doc = new DOMDocument(); 
  $doc->formatOutput = true; 
   
  $root = $doc->createElement( "task" ); 
  $doc->appendChild( $root ); 
  $qtitle=$doc->createElement("title","Coyote Canyan");
  $qsyn=$doc->createElement("synopsis","Quadrant2");
  $qlev=$doc->createElement("level","3");
  $qlat=$doc->createElement("latitude","");
  $qlon=$doc->createElement("title","Coyote Canyan");
  $qhea=$doc->createElement("title","Coyote Canyan");

  $root->appendChild($qtitle);
   
  foreach( $employees as $employee ) 
  { 
  $b = $doc->createElement( "employee" ); 
   
  $name = $doc->createElement( "name" ); 
  $name->appendChild( 
  $doc->createTextNode( $employee['name'] ) 
  ); 
  $b->appendChild( $name ); 
   
  $age = $doc->createElement( "age" ); 
  $age->appendChild( 
  $doc->createTextNode( $employee['age'] ) 
  ); 
  $b->appendChild( $age ); 
   
  $salary = $doc->createElement( "salary" ); 
  $salary->appendChild( 
  $doc->createTextNode( $employee['salary'] ) 
  ); 
  $b->appendChild( $salary ); 
   
  $root->appendChild( $b ); 
  } 
   
   $doc->saveXML(); 
  $doc->save("sss.xml");
  ?>