/*
	"userclient.js"
	corresponds to the logic tier of a Three-tier architecture.
	It deals with DOM management, text selection, text annotation, buttons, mouse events.
	JQuery library is intensively used.

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

var nextSource;
var undotext;
var selcounter=1;

var nextSource = 1;
var jsonstr="";

if(nextSource == 1)
{	
	callserver();	
}

		// http-ajax server call
function callserver()
{
	console.log( 'calling server');	
	console.log( ' nextSource='+nextSource+'\n'+'JSON:'+jsonstr);
	

	$("#toinsert").empty();

	var request = $.ajax({
				type: "POST",
				url: "phpServerResponse.php",
				dataType: "text",
				cache: false,
				data: { nextsrc:nextSource, jsonstring:jsonstr},
				
				// server sends OK status
				success: function(html){ 
					jQuery(html).appendTo("#toinsert");					
				}
	});
	
	// finish loading server response
	request.done(mainhandler);
	
	// Server response fails
	request.fail(function(jqXHR, textStatus) {
	  console.log("Some problem was produced with status Text : " + textStatus + jqXHR.EvalError() );
	});

}


function mainhandler()
{	
	console.log( 'mainhandler()->Bdebug->'+ $('#centerside > div.source > div.textcontent > [class$="toeval"] > span.segment').last().text() + '<-' );

	//load buttons
	$('#clean, #next, #tresp, #tresn, #justep, #justen, #neutre').button();

	// A copy of the text in case of 'clean' event
	undotext = $('#tweet_contents').text();

	// Click button event handlers
		
		// positive
	$('#tresp').unbind('click').click(tpHandler);
	
		// negative
	$('#tresn').unbind('click').click(tnHandler);
	
		// clean
	$('#clean').unbind('click').click(cleanHandler);
	
		// next
	$('#next').unbind('click').click(suivant);
	
		// text selection inside div tweet_contents
	$('#tweet_contents').on("mouseup",function()
	{
    		selection = getSelectedText().replace(/^\s+|\s+$/g,"");
    		selection = selection.replace(/</g, "&lt;");
    		selection = selection.replace(/>/g, "&gt;");
    		//always must to be under a regexp if not it changes <br> into &lt;br&gt;
    		selection = selection.replace(/\n/g, "<br>");

	    	if(selection.length >= 4)
			{ 
				
				// Avoids to select text from previously selected text
        		var spn = '<span id=\"selected\" class=\"polarite\" selcount=\"'+selcounter+'\" style="-webkit-touch-callout: none; -webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none;">'+selection+'<span id=\"superscript\" supcount=\"'+selcounter+'\">'+selcounter+'<\/span><\/span>';
      
        		if(selcounter == 1)
        		{
        			$(this).html( $(this).html().replace(/&nbsp;/g," "));
        			$(this).html( $(this).html().replace(/\s+<br>/g,"<br>"));
        			$(this).html( $(this).html().replace(/ +/g," "));
        		}
        		$(this).html( $(this).html().replace(/(\r\n|\n|\r)/gm," ").replace(selection, spn ) );       
        		// If there are two contiguous spans separated by space they are merged
        		union='<span id=\"superscript\" supcount=\"'+selcounter+'\">'+selcounter+'<\/span><\/span> <span id=\"selected\" class=\"polarite\" selcount=\"'+selcounter+'\" style="-webkit-touch-callout: none; -webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none;">';
        		$(this).html( $(this).html().replace(union," "));
        		// If there are two contiguous spans not separated they are merged
        		union='<span id=\"superscript\" supcount=\"'+selcounter+'\">'+selcounter+'<\/span><\/span><span id=\"selected\" class=\"polarite\" selcount=\"'+selcounter+'\" style="-webkit-touch-callout: none; -webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none;">';
        		$(this).html( $(this).html().replace(union,""));
        		// If there are two contiguous spans separated by newline they are merged
        		union='<span id=\"superscript\" supcount=\"'+selcounter+'\">'+selcounter+'<\/span><\/span><br><span id=\"selected\" class=\"polarite\" selcount=\"'+selcounter+'\" style="-webkit-touch-callout: none; -webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none;">';
        		$(this).html( $(this).html().replace(union,"<br>"));
    		}
    	console.log(spn);
	});

	
}


	// positive annotation
function tpHandler()
{
	$('[selcount="'+selcounter+'"]').toggleClass('trespositif');
		
	if( $('#targets').children().length  < $('#tweet_contents').children().length  ){
		$('<div id="cible" class="polarite trespositif">'+selcounter+':<input type="text" size="15" ciblecount="'+selcounter+'"></input></div>').appendTo('#targets');		
		selcounter++;			
	}
	logdebug();	
}
	// negative annotation
function tnHandler()
{
	$('[selcount="'+selcounter+'"]').toggleClass('tresnegatif');
	
	if( $('#targets').children().length  < $('#tweet_contents').children().length  ){
		$('<div id="cible" class="polarite tresnegatif">'+selcounter+':<input type="text" size="15" ciblecount="'+selcounter+'"></input></div>').appendTo('#targets');	
		selcounter++;
	}
	logdebug();	
}

	// next
function suivant()
{
	jsonstr=makeJsonStr();
	console.log('JSON:'+jsonstr);
	cleanHandler();
	callserver();	
}

// Build JSON string before sending annotations to server

function makeJsonStr(){
	var opiniontext, cible;
	var i;
	
	var jst='{"positif":{';
	
	i=0
	$('#tweet_contents').children('[class$="trespositif"]').each(
		function(){
			$(this).children().empty();
			opiniontext = $(this).text();
			cible = $('#cible [ciblecount="' + $(this).attr('selcount') + '"]').val();
			
			jst += '"' + cible +'":"'+ opiniontext+'"';
									
			if(  i < ($('#tweet_contents').children('[class$="trespositif"]').length -1) ){jst += ',';}
			i++;
		}
	);
		
	jst += '},"negatif":{';

	i=0;
	$('#tweet_contents').children('[class$="tresnegatif"]').each(
		function(){
			$(this).children().empty();
			opiniontext = $(this).text();
			cible = $('#cible [ciblecount="' + $(this).attr('selcount') + '"]').val();
			
			jst += '"' + cible +'":"'+ opiniontext+'"';									
			if(  i < ($('#tweet_contents').children('[class$="tresnegatif"]').length -1) ){jst += ',';}
			i++;
		}
	);
			
	jst += '}}';
	return jst;
}



	// clean handler
function cleanHandler()
{
	$('#tweet_contents').html(undotext);	
	$('#targets').empty();
	selcounter=1;
}

function logdebug()
{
	console.log('selcounter='+selcounter); 
	console.log('cibles='+$('#targets').children().length); 
	console.log('selected='+$('#tweet_contents').children().length);
	console.log('contents='+$('#tweet_contents').html())
}

//Grab selected text
function getSelectedText(){
    if(window.getSelection){
        return window.getSelection().toString();
    }
    else if(document.getSelection){
        return document.getSelection();
    }
    else if(document.selection){
        return document.selection.createRange().text;
    }
}

