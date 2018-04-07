
$(document).on('click', '.btn_post_comment', function(event) 
{
    event.preventDefault()

    //To clear all old alerts
    bs.ClearError();
     
    //Get the field value
    var comment_author  = $(document).find('.comment_author') 
    var comment_email   = $(document).find('.comment_email') 
    var comment_website = $(document).find('.comment_website') 
    var comment_content = $(document).find('.comment_content') 
    var post_id         = $(this).attr('post_id')
     
    // Validate field
    if(frm.IsEmpty(comment_author.val() ))
    {
        //Show alert
        bs.ShowError ("Please enter name",comment_author)
    }
    else if(frm.IsEmpty(comment_email.val() ))
    {
        //Show alert
        bs.ShowError ("Please enter email",comment_email)
    }
    else if(frm.IsEmail(comment_email.val()))
    {
        //Show alert
        bs.ShowError ("Invaid Email ",comment_email)
    }
    else if(frm.IsEmpty(comment_content.val() ))
    {
        //Show alert
        bs.ShowError ("Please enter comment",comment_content)
    }
    else 
    {
        var DataSend = 
        {
            post_id:post_id, 
            comment_author:comment_author.val(),
            comment_author_email:comment_email.val(),
            comment_author_url:comment_website.val(),
            comment_content:comment_content.val(),
        }


        $(document).find('.new_comment_container').hide()


        var d = bs.WaitingMsg("Please wait....Processing your request")
        $(document).find('.comment_alert').html(d)


        var ajax  = np_ajax_comment(DataSend)

        ajax.fail(function(xhr, ajaxOptions, thrownError) 
        {
            console.log(thrownError) 
            console.log(xhr)   

            $(document).find('.comment_alert').html(xhr)
            $(document).find('.new_comment_container').show()
        })

        ajax.done(function(data,textStatus, jqXHR) 
        { 
            console.log(data)

            var get_status = data.status
            if(get_status =='error')
            {
                var d = bs.AlertMsg("Oppss...there was a problem while trying to submit your comment....<br><br>Please try again in a few seconds... ", "error");
                $(document).find('.comment_alert').html(d )
                $(document).find('.new_comment_container').show()
            }
            else  if(get_status =='success')
            {
                var d = bs.AlertMsg('Thank you for your comment...<br><br> your message will only be visible after moderation', "success");
                $(document).find('.comment_alert').html(d )
            }
            
            

        })
    }




})

