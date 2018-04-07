
var create_pretty_url_list_screen = function(arr_obj)
{
	var sort_data = alasql('Select * From ? order by rec_dttm_unix DESC',[arr_obj]); 
 
	var data_table_arr = [];

	sort_data.forEach(function(ele,index)
	{	
		var url_edit = '<span class="btn btn-sm fa fa-pencil-square-o pretty_url_edit" '
		+'url_id="'+ele.url_id+'" '		
		+'url_title="'+ele.url_title+'" '
		+'url_note="'+ele.url_note+'" '
		+'url_short="'+ele.url_short+'" '
		+'url_long="'+ele.url_long+'" '
		+'data-toggle="tooltip"  data-placement="top" data-original-title="Edit" '
		+' ></span> |'
		


		var url_delete = ' <span class="btn  btn-sm fa fa-trash-o pretty_url_single_delete" data-toggle="tooltip"  data-placement="top" data-original-title="Delete" url_id="'+ele.url_id+'"></span> | '

		var url_reset = ''		 
		+' <span class="btn btn-sm fa fa-undo pretty_url_veiw_reset" url_id="'+ele.url_id+'" reset_type="post" data-toggle="tooltip" data-original-title="Reset Views To 0"></span> | '

		var url_stats = ''		 
		+'<span class="btn btn-sm fa fa-line-chart pretty_url_stats" url_id="'+ele.url_id+'" url_title="'+ele.url_title+'" data-toggle="tooltip" data-original-title="View Stats"></span>'

		var url_short = $('.sit_name').attr('href')+'/go/'+ele.url_short

		var url = ''
		+'<a   class="btn btn-link pretty_url_info" url_long="'+ele.url_long+'"  url_title="'+ele.url_title+'" url_note="'+ele.url_note+'" url_note="'+ele.url_note+'"  href="'+ele.url_long+'" target="_blank">'+ele.url_long.substring(0,30)+'...</a> '
		+'<br>'
		+'<input type="text" class="form-control" value="'+url_short+'" onClick="this.select();">'

		var url_title =  '<span class="btn btn-link pretty_url_title"  data-toggle="tooltip" title="'+ele.url_note+'" data-placement="top">'+ele.url_title+'</span>'

		var url_options = '<div class="url_options" style="display:none;">'
		+ url_edit  
		+ url_delete  
		+ url_reset 
		+ url_stats
		+' <br><br></div>'

		data_table_arr.push(
		[
			'<input type="checkbox" class="bulk_pretty_url_id no-sort" url_id="'+ele.url_id+'">',
			url_title + "<br><br>"+ url_options ,
			ele.url_counter,
			url,
			ele.rec_dttm,			
		]) 
	});
	
	var Data_Table_AutoID = "data_table_"+js.AutoCode();
  
	var tbl_data = ''
	+ '</br></br> <table id="'+Data_Table_AutoID+'"  class="table table-hover table-bordered"  width="100%"></table>';

	$(document).find('.pretty_url_list').html(tbl_data );

	$('.ScreenData').show();

	var GetSiteURL = $('.sit_name').attr('href')+'/go/';

	$(document).find('.SiteURL').html(GetSiteURL); 

	$(document).find('.pretty_url_list_container').show();

	

	$('#'+Data_Table_AutoID+'').DataTable( 
	{
		data: data_table_arr,
		"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
		"pageLength": 25,					
		columns: 
		[
		  	{ title: 'Select<br> <input type="checkbox" class="pretty_url_select_all no-sort">' },						 
		  	{ title: "Title" },
		  	{ title: "Total Hits"},
		  	{ title: "URL" },		  
		  	{ title: "Publish Date&Time" },		  	
		],                
	});


	//--->assign table row id - start
	var get_table_id = $(document).find('.pretty_url_list').find('.table').find('tr');
	get_table_id.each(function(i1,v1) 
	{
		//create random code
		var id =  Math.random().toString(36).substr(2)
		
		$(this).attr('tbl_row_id', id );		
	})
	//--->assign table row id - end


}



//--->auto grow textarea > start
!(function($) {
    $.fn.autogrow = function() {
        return this.each(function() {
            var textarea = this;
            $.fn.autogrow.resize(textarea);
            $(textarea).focus(function() {
                textarea.interval = setInterval(function() {
                    $.fn.autogrow.resize(textarea);
                }, 500);
            }).blur(function() {
                clearInterval(textarea.interval);
            });
        });
    };
    $.fn.autogrow.resize = function(textarea) {
        var lineHeight = parseInt($(textarea).css('line-height'), 10);
        var lines = textarea.value.split('\n');
        var columns = textarea.cols;
        var lineCount = 0;
        $.each(lines, function() {
            lineCount += Math.ceil(this.length / columns) || 1;
        });
        var height = lineHeight * (lineCount + 1);
        $(textarea).css('height', height);
    };
})(jQuery);

//--->auto grow textarea > end



//--->url options > show/hide > start
$(document).on('mouseover', '.pretty_url_list .table tr', function(event) 
{
	//hide all other url options first
	$(document).find('.pretty_url_list').find('.table').find('.url_options').hide();

	//show the only the mouse over table row
    $(this).find('.url_options').show()
});

$(document).on('mouseleave', '.pretty_url_list .table tr', function(event) 
{
	//hide all other url options first
	$(document).find('.pretty_url_list').find('.table').find('.url_options').hide();

});
//--->url options > show/hide > start


//---> pretty_url_go_back > start

$(document).on('click', '.pretty_url_go_back', function(event) 
{
	event.preventDefault();	

	//hide 
	$(document).find('.container_pretty_url_stats').hide();
	$(document).find('.div_contain_pretty_url_all').show() 
	

	 
});
//---> pretty_url_go_back > end



$(document).on('keyup', '.pretty_url_note', function(event) 
{
	event.preventDefault();	

	var code_num = event.which; 

	if(code_num != 8 || code_num != 13 ) 
	{
		$(this).autogrow();
	}
	 
})

//--->pretty url > slug - start

$(document).on('keyup', '.pretty_url_short', function(event) 
{
	event.preventDefault();	
	js.PrettyURL( $(".pretty_url_short") );
});

//--->pretty url > slug - end


$(document).on('click', '.btn_container_new_pretty_url', function(event) 
{
	var btn_class = $('.btn_container_new_pretty_url');
	btn_class.find('.fa').toggleClass( 'fa-arrow-down fa-arrow-up' );

	var ele = $(document).find('#Container_Pretty_URL')

	if( ele.css('display') == 'none' )
	{
    	ele.show();
	} else {
	    
	    ele.hide();
	}
	
})

//--->select and deselect all - start
$(document).on('click', '.pretty_url_select_all', function(event) 
{
	var ele = $(document).find('.bulk_pretty_url_id');
 	
 	if($(this).prop("checked")) 
 	{
        //$(".checkBox").prop("checked", true);
        ele.each(function()
		{   
			$(this).prop('checked', true); 
	    });
    } 
    else 
    {
        //$(".checkBox").prop("checked", false);
        ele.each(function()
		{   
			$(this).prop('checked', false); 
	    });
    } 
})
//--->select and deselect all - end 






//--->edit > start
$(document).on('click', '.btn_pretty_url_cancel', function(event) 
{
	event.preventDefault();	
	var ele2 = $(document).find('.container_new_pretty_url');

	ele2.find('.form-control').val('');

	$(document).find('.btn_pretty_url')
	.text('Add New Pretty URL')
	.attr('update_type', 'new')
	.removeAttr('url_id')
})

$(document).on('click', '.pretty_url_edit', function(event) 
{
	event.preventDefault();	

	bs.ClearError();

	var url_id =  $(this).attr('url_id');

	//var ele = $(this).closest('tr').find('.pretty_url_info')
	var ele = $(this)

	
	var url_title 	= ele.attr('url_title');
	var url_note 	= ele.attr('url_note');
	var url_long 	= ele.attr('url_long');
	var url_short 	= ele.attr('url_short');


	$(document).find('.container_new_pretty_url').show();
	$(document).find('#Container_Pretty_URL').show();

	var ele2 = $(document).find('.container_new_pretty_url')

	
	ele2.find('.pretty_url_title').val(url_title);

	ele2.find('.pretty_url_note').val(url_note).autogrow();

	ele2.find('.pretty_url_long').val(url_long).autogrow();
	ele2.find('.pretty_url_short').val(url_short);
	ele2.find('.btn_pretty_url').text('Updated Pretty URL').attr({update_type: 'update' ,url_id: url_id});
		
	$(document).find('.btn_container_new_pretty_url').click();

	var btn_class = $('.btn_container_new_pretty_url');

	btn_class.find('.fa').toggleClass( 'fa-arrow-down fa-arrow-up' );

	var ele = $(document).find('#Container_Pretty_URL')

	if( ele.css('display') == 'none' )
	{
    	ele.show();
	} 

 	 
})
//--->edit > - end 


//--->add/remove spin class > start

//add > spin class to pretty url auto code
$(document).on('mouseover', '.btn_pretty_url_auto_code', function(event) 
{
	event.preventDefault();

	$(this).addClass( 'fa-spin' );

})


//remove > spin class to pretty url auto code
$(document).on('mouseout', '.btn_pretty_url_auto_code', function(event) 
{
	event.preventDefault();

	$(this).removeClass( 'fa-spin' );

})

//--->add/remove spin class > end





//--->create auto code > start

$(document).on('click', '.btn_pretty_url_auto_code', function(event) 
{
	event.preventDefault();

	var id = Math.random().toString(36).substr(2,4) ;
	$(document).find('.pretty_url_short').val(id);

})


//--->create auto code > end