$(document).ready(function()
{
    //load functions
    //PrettyCode()

    var get_contact_form = $(document).find('.plugin_contact_form_code_with_mark');

    if(get_contact_form.length > 0)
    {
        //np_include_once('https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.5.7/tinymce.min.js');
        get_contact_form.after('<div class="contact_me"> loading...</div>');
        get_contact_form.remove();

        //get option values
        var ajax = np_ajax_option('contact_form')    
         
        ajax.done(function(d1) 
        { 
            //console.log(d1);

            if(d1.status == 'success') 
            {
                var option_data;

                if(typeof(d1.option_value) == 'string')
                {
                    option_data = JSON.parse(d1.option_value);
                }
                else
                {
                    option_data =  d1.option_value;
                }

                var ajax_url  =  option_data.ajax_url;
                var post_contact_msg = option_data.post_contact_msg; 

                //var ajax_url  =  d1.option_value.ajax_url;
                //var post_contact_msg = d1.option_value.post_contact_msg; 

                var site_plugin_folder = 'np-content/plugins';
                var plugin_folder_name = 'contact-form';
        
                var template_file = 'user-contact-form.html';

                var url  = '/'+site_plugin_folder+'/'+plugin_folder_name+'/'+template_file;

                $.get(url, function(d2) 
                {
                    $(document).find('.contact_me').html(d2);

                    $(document).find('.contact_post_msg').find('.panel-body').html(post_contact_msg);

                    $(document).find('.btn_contact').attr('ajax_url', ajax_url);
                    
                })
            }
     
        })
    }

    $(document).on('click', '.btn_contact', function(event) 
    {    
        event.preventDefault();

        //To clear all old alerts
        bs.ClearError();

        var ele = $(this).closest('.container_contact_form');

        //Get the field value
        var user_name       = ele.find('.user_name');
        var user_email      = ele.find('.user_email');
        var user_subject    = ele.find('.user_subject');
        var user_msg        = ele.find('.user_msg');

        //var get_msg_id      = $(this).closest('.container_contact_form').find('.user_msg').attr('id') 
        //var Content_Post    = tinyMCE.get(get_msg_id).getContent();     

        // Validate field
        if(frm.IsEmpty(user_name.val()))
        {
            //Show alert
            bs.ShowError ("Please enter text",user_name);
        }
        else if(frm.IsEmpty(user_email.val()))
        {
            //Show alert
            bs.ShowError ("Please enter text",user_email);
        }
        else if(frm.IsEmail(user_email.val()))
        {
            //Show alert
            bs.ShowError ("Invaid Email ",user_email)
        }
        else if(frm.IsEmpty(user_subject.val()))
        {
            //Show alert
            bs.ShowError ("Please enter text",user_subject);
        }
        else if(frm.IsEmpty(user_msg.val()))
        {
            //Show alert
            bs.ShowError ("Please enter text",user_msg);
        }
        else            
        {
            var ref_url = location.protocol + '//' + location.host+ '/';
             var ref_url =  window.location.href; 
            var DataString = 
            {
                user_name:user_name.val(),
                user_email:user_email.val(),
                user_subject:user_subject.val(),
                user_msg:user_msg.val(),
                ref_url:ref_url,
            };
            
            var ajax_url =  $(document).find('.btn_contact').attr('ajax_url');

            

            $(document).find('.contact_post_msg').show();
            $(document).find('.contact_form_container').hide();

            //return false; 

            $.post(ajax_url, DataString, function(data) 
            {
                //console.log(data)

            });
        }
    });

}) 
 