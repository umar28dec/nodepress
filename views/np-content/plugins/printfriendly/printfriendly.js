
$(document).ready(function()
{   
	var printfriendly = $(document).find('.np_post_content');

	var printfriendly_total_paragraphs = printfriendly.find('p').length;

    if( printfriendly.length > 0 )
    {      	
        np_include_once("//cdn.printfriendly.com/printfriendly.js");

        /**/
        var d = ''
        +'<a href="https://www.printfriendly.com" style="color:#6D9F00;text-decoration:none;" class="printfriendly" onclick="window.print();return false;" title="Printer Friendly and PDF">'
			+'<img style="border:none;-webkit-box-shadow:none;box-shadow:none;" src="//cdn.printfriendly.com/buttons/printfriendly-pdf-email-button-md.png" alt="Print Friendly and PDF"/>'
		+'</a>'
        printfriendly.append('<br>'+d);
    }
 })