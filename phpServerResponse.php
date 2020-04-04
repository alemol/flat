<?php
/*
	"phpServerResponse.php"
	corresponds to the data tier of a Three-tier architecture.
	It deals with server request, database acces, JSON decoding and log.
	
	Copyright (C) 2012 Alejandro MOLINA VILLEGAS: alemol (AT) gmail.com
	
	This file is part of "flat: free language annotation tool".

    flat is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    flat is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    LICENSE.txt file for more details.			
*/

session_start();

require_once('lib/error_handler.php');
require_once('lib/config.php');


	// session 
	$_SESSION['usrname']= 'admin';
	$_SESSION['usrid']  = 1;
	$_SESSION['nextsrc'] = 1;

/*if( !( isset($_SESSION['usrname']) && isset($_SESSION['usrid']) &&  isset($_SESSION['nextsrc'] ) ) ){

	
	logfile("\n**SESSION OPEN**: user=".$_SESSION['usrname']." , id=".$_SESSION['usrid'].", nextsource=".$_SESSION['nextsrc']." \n");
}
/*


/* request by POST method */

if ( $_SERVER['REQUEST_METHOD'] == 'POST')
{
	logfile("\n*server POST request*");
	
			   /* creates DB conexion */
	$mysqli = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);
	if ( !$mysqli ) {
		die('DB conexion fail (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
	}
	
	/* cambiar el conjunto de caracteres a utf8 */
	if (!$mysqli->set_charset("utf8")) {	  
	    logfile("Error loading utf8 charset:". $mysqli->error);
	} 
		
	if( isset($_SESSION['nextsrc']) )
	{
		$src_Id = intval($_SESSION["nextsrc"]);
		//$_SESSION['nextsrc']++;
		NextTexte($mysqli,$src_Id);		
	}else{ 		
		die("Error reading array SESSION");		
	}


	if( isset($_POST['jsonstring']) ){			
		$insertArray = processJson( $_POST['jsonstring']);
	}
						
	$mysqli->close();		
}


function NextTexte($mysqli,$src_Id){
	
		/** Query */
	logfile("src_Id OK = " . $src_Id );
	
	$query = 'SELECT * FROM tweets WHERE tweet_id = '. $src_Id ;			
	logfile("Query=" . $query );
	
	$result = $mysqli->query($query);
	
	while ($row = $result->fetch_array(MYSQLI_ASSOC))
	{
		$title 	  = $row['title'];
		$tweeteur = $row['tweeteur_name'];
		$contents = $row['contents'];
		
	}
	logfile("result OK");		

	$result->close();

	/* new HTML content to send */
	$raw = "";		
	$raw .= "<div id='tweet_autor'> By ".$tweeteur." </div>";
	$raw .= "<div id='tweet_title'>".$title."</div>";
	$raw .= "<div id='tweet_contents'>".$contents."</div>";
	logfile("sending to client\n");		
	
	/* THIS IS ACTUALLY WHAT IS SENT TO THE CLIENT  */
	echo $raw;
}

function processJson($jsons)
{
	$out ="";
	$json_a = json_decode($jsons, true);
	
		switch (json_last_error()) {
        case JSON_ERROR_NONE:        	
        	$out .= "json string OK dump :". print_r($json_a,true) ."\n";	
			logfile($out);			
        	break;
        case JSON_ERROR_DEPTH:
            die('Error decoding Json object: - Maximum stack depth exceeded');
        	break;
        case JSON_ERROR_STATE_MISMATCH:
        	die('Error decoding Json object: - Underflow or the modes mismatch');
        	break;
        case JSON_ERROR_CTRL_CHAR:
       		die('Error decoding Json object: - Unexpected control character found');
   		     break;
        case JSON_ERROR_SYNTAX:
            die('Error decoding Json object: - Syntax error, malformed JSON');
    	    break;
        case JSON_ERROR_UTF8:
            die('Error decoding Json object: - Malformed UTF-8 characters, possibly incorrectly encoded');
        break;
        default:
	        die('Error decoding Json object: Unknow');
        	break;
    	}
	return $json_a;
}


function logfile($str)
{	
	file_put_contents('log.txt', $str . "\n", FILE_APPEND);			
}

exit;
?>