$(document).ready(function()
{ 
  //console.log('c.Enable() ', c.Enable())


  var cookie_check = c.GetObjArr('np_login') 

  if(cookie_check)
  {
    //RedirectToAdminScreen();
    window.location.href = '/np-admin/dashboard'
    return false  
  }

  Screen_Login = 'html/001a-login.html'

  $.get(Screen_Login, function(data) 
  {
    //console.clear() 

    $(".ScreenLoader").html(data) 
    $('.LoadingMsg').hide() 

    var site = js.GetSiteURL() 
    
    var  dd = ' <br><br> <a href="'+site+'" data-toggle="tooltip" title="Go To The Site" data-placement="right" >'+'← Back To ' + location.host+' </a>'

    $('.ScreenLoader .Login_Btn').after(dd) 

    //focus on the "Login_ID" field
    $('.Login_ID').focus();


    if(!c.Enable())
    { 
      var d = bs.AlertMsg("Looks like your cookies are disable<br> You will need to enable them before preceding", "warning")
      $(document).find('.LoginAlert').html(d).show()
    }

  }) 
  
}) 
 



js.EnterKey ($(".Login_Frm"), function (e)
{
  //prevent the page from reloading 
  e.preventDefault();
  
  //Call the submit process
  $(".Login_Btn").click();
})
 
    
$(document).on('click','.Login_Btn',function (e)
{
  //prevent the page from reloading 
  e.preventDefault();

  bs.ClearError();
	 
  var Login_ID     = $('.Login_ID');
  var Login_Password  = $('.Login_Password');

  // Validate field
  if(frm.IsEmpty(Login_ID.val() ))
  {
  //Show alert
    bs.ShowError ("Please enter Email ",Login_ID);
    
  }
  else if(frm.IsEmpty(Login_Password.val() ))
  {
    //Show alert
    bs.ShowError ("Please enter Password",Login_Password)
     
  } 
  else
  {

    if(!c.Enable())
    { 
      var d = bs.AlertMsg("You will need to enable <br>cookies before preceding", "warning")
      $(document).find('.LoginAlert').html(d).show()
      return false 
    }
    
    var d = bs.WaitingMsg("Please wait....Processing your request");
    $('.LoginAlert').html(d).show()

    $('.LoginForm').hide();


    var DataString = 
    {
      datasend:"login",
      UserPasword:Login_Password.val(),
      LoginID:Login_ID.val(),   
    };
  
    var ajax = js.Ajax('POST','login',DataString)
    
    ajax.done(function(data,textStatus, jqXHR) 
    {     
      //console.clear();
       
      bs.ClearError();   
 

      var Status = data.status;

      if(Status == 'error')
      {
        d = bs.AlertMsg(data.msg, "error");
        $('.LoginAlert').html(d).show();
        $('.LoginForm').show();         
      }
      else if(Status == 'success')
      { 

        var ObjArr = {admin_token:data.token, login_id:Login_ID.val()};
        c.AddObjArr('np_login',ObjArr); 
 
        window.location.href = data.url; 

        var d = bs.WaitingMsg("Redirecting <br> To Admin DashBoard");
        $('.LoginAlert').html(d).show();
       
      } 
      
    });

    ajax.fail(function(xhr, ajaxOptions, thrownError)  
    {
      bs.ClearError();
      var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
      + 'Please try agin in a few seconds.<br><br>';     
      
      var ErrorMsg = bs.AlertMsg(Msg,'error');
      
      $('.LoginAlert').html(ErrorMsg).show();
      $('.LoginForm').show(); 
       
      
      console.log(thrownError);
      console.log(xhr);        
    });
  }
})