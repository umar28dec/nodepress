//--->select and deselect all - start
$(document).on('click', '.select_all_media_files', function(event) 
{
	var ele = $(document).find('.bulk_media_file_name');
 	
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



//--->bulk action > delete - start
$(document).on('click', '.delete_selected_media_files', function(event) 
{
    //event.preventDefault();
    bs.ClearError();
    var get_ele_text = $(this).text()

    var ele = $(document).find('.bulk_media_file_name') 

    //

    var get_ids = []
    //selected check
    ele.each(function(index, v1)
    {   
        if($(this).prop("checked")) 
        {
            get_ids.push($(this).attr("file_name"))
        } 
    });

    if(_.size(get_ids) < 1)
    {
        var d = bs.AlertMsg("Please select at least one to > " + get_ele_text, "error");
        $(document).find('.media_alert').html(d)
    }
    else if(_.size(get_ids) > 0)
    {       
        
        var ObjArrOptions = 
        {
          title: "Confirmation required",
          text: "Are you sure you want to delete "+_.size(get_ids)+" media file(s) ?",
          
          confirm: function(button) 
          {
            //Call your delete function
            media_bulk_delete(get_ids);
          },
          cancel: function(button) 
          {
            // nothing to do
          },
          confirmButton: "Yes I am",
          cancelButton: "No",                       
          confirmButtonClass: "btn-danger",    //Bootstrap button class
          cancelButtonClass: "btn-default",    //Bootstrap button class
          dialogClass: "modal-dialog modal-lg" // Bootstrap classes for large modal
        }
        //Call is like this
        bs.confirm(ObjArrOptions);
    }
});

var media_bulk_delete = function (delete_ids_arr)
{ 
    $.each(delete_ids_arr, function(index, val) 
    {
        // statements        
        update_delete_file_media_views(val)    
    });
    
    //deselect checkbox
     $(document).find('.select_all_media_files') .prop('checked', false); 

    media_delete_multiple_files(delete_ids_arr)

}

var media_delete_multiple_files = function(delete_media_ids)
{

    var CallType   = 'DELETE' //--->Other options: GET/POST/DELETE/PUT
    var AjaxURL    = 'media/multiple';
    var DataString = 
    {        
        datasend:'files',
        delete_media_ids: delete_media_ids,
    };
    

    var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

    //error
    ajax.fail(function(xhr, ajaxOptions, thrownError)  
    {            
      //do your error handling here
      
        bs.ClearError();
        var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
        + 'Please try agin in a few seconds.<br><br>';     

        var ErrorMsg = bs.AlertMsg(Msg,'error');

        $('.LoginAlert').html(ErrorMsg).show();

        console.log(thrownError);
        console.log(xhr); 

        return false    
         
    });

    //success
    ajax.done(function(data) 
    { 
        console.log(data)
        
        var Status = data.status ;
        if(Status == 'error')
        {
             
            return false;            
        }

        //do the success part below


    }) 
}
//--->bulk action > delete - start