<?php
/*
	"error_handler.php"
	customizes PHP error printing
		
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
set_error_handler('error_handler',E_ALL);

function error_handler($err_No, $errStr, $errFile, $errLine)
{
 // clean previous
 if( ob_get_length() ){ ob_clean(); }
 header('Content-Type: Text/plain');

 // Error msg chr(10) is new line
 $error_message = 'PHP Error number: ' . $err_No . chr(10) .
				  'Message: ' . $errStr . chr(10) .
				  'In File: ' . $errFile . chr(10) .
				  'Line: ' . $errLine . chr(10) ;

 echo $error_message;
 // stops another scripts execution
 exit;
}
?>