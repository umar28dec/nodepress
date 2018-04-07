var LoadScripts = function (FileURL)
{
    //var get_file_type = FileType.toLowerCase();
    var get_file_type = FileURL.split('.').pop().toLowerCase()

    if(get_file_type == 'css')
    {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('link');
        script.href = FileURL;
        script.rel = 'stylesheet';
        head.appendChild(script)
    }
    else if(get_file_type == 'js')
    {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = FileURL;
        script.type = 'text/javascript';
        head.appendChild(script)
    }    
}

var get_site_URL = location.protocol + '//' + location.host+ '/'
var core_libs = get_site_URL+'np-core/libs/'


//Load Files
LoadScripts(core_libs+'font-awesome/css/font-awesome.min.css')
LoadScripts(core_libs+'bootstrap/css/bootstrap.min.css')
LoadScripts(core_libs+'bootstrap/js/bootstrap.min.js')
LoadScripts(core_libs+'alasql/alasql.min.js')
 
LoadScripts(core_libs+'awesome-functions/awesome-functions.min.js')



LoadScripts('css/np-admin-dashboad.css');
LoadScripts('js/app.js') 

window.onload = function ()
{ 
    //console.clear()
    //DOM is ready 
    //Check if logged in already
    !c.GetObjArr('np_login').admin_token ?  window.location.href = '/np-admin' : GetPageData();  
}
 
function GetPageData (argument) 
{

    //BS tooltip
    $(document).tooltip({ selector: "[data-toggle]" }); 

    //--->remove modal container > start
 

    $(document).on('hidden.bs.modal', '.modal', function () 
    {   
        $(document).find('.modal').remove() 
        $(document).find('.modal-backdrop').remove() 
    })

    $(document).on('click', '[data-dismiss="modal"]', function(e) 
    { 
        $(document).find('.modal').remove() 
        $(document).find('.modal-backdrop').remove() 
    });
    //--->remove modal container > end

 

    $.get('html/002a-dashboard.html', function(data)     
    {  
        $('body').html(data)  

        var DataString = 
        {
          datasend:"pagedata",
          LoginID: c.GetObjArr('np_login').login_id,
        };    

        var ajax = np_admin_ajax('GET','dashboard-page-data',DataString)
        
        ajax.fail(function(xhr, ajaxOptions, thrownError)  
        {    
            console.log(thrownError);
            console.log(xhr);  
        });
        
        ajax.done(function(data,textStatus, jqXHR) 
        {  
            //console.log(data)

            var Status = data.status;

            if(data.status == 'error')
            {
                console.log('coming from error ');
                c.Delete('np_login');

                window.location.href = '/np-admin';           
            }
            else if(data.status == 'success')
            { 
               

                               //--->libs > start
                LoadScripts(core_libs+'jquery-tags/jquery.tagsinput.min.css')
                LoadScripts(core_libs+'jquery-tags/jquery.tagsinput.min.js')

                LoadScripts(core_libs+'bootstrap-select/css/bootstrap-select.min.css')
                LoadScripts(core_libs+'bootstrap-select/js/bootstrap-select.min.js')

                LoadScripts(core_libs+'bootstrap-datetimepicker/bootstrap-datetimepicker.min.css')
                LoadScripts(core_libs+'bootstrap-datetimepicker/bootstrap-datetimepicker.min.js')

                LoadScripts(core_libs+'datatables/dataTables.min.css')
                LoadScripts(core_libs+'datatables/dataTables.min.js')

                LoadScripts(core_libs+'canvas-to-blob/canvas-to-blob.js')


                LoadScripts(core_libs+'bs-iconpicker/js/iconset/iconset-fontawesome-4.2.0.min.js')
                LoadScripts(core_libs+'bs-iconpicker/js/bootstrap-iconpicker.min.js')
                LoadScripts(core_libs+'jquery-sortable/jquery.sortable.js')

                LoadScripts(core_libs+'morris-js/morris.css')
                LoadScripts(core_libs+'morris-js/morris.min.js')
                LoadScripts(core_libs+'morris-js/raphael.min.js')

                
                //--->libs > end
                //Load local files
               
                var routes_dir = 'js/screens/'

                 
                //LoadScripts('JS', 'js/np-admin-screens.mini.js')



                //Posts libs
                /**/
                LoadScripts(routes_dir+'01-posts-01a-all.js')
                LoadScripts(routes_dir+'01-posts-01b-all-bulk-actions.js')

                LoadScripts(routes_dir+'01-posts-02a-add-new.js')
                LoadScripts(routes_dir+'01-posts-02b-add-new-url.js')
                LoadScripts(routes_dir+'01-posts-02c-add-new-date-time.js')
                LoadScripts(routes_dir+'01-posts-02d-add-new-preview.js')
                LoadScripts(routes_dir+'01-posts-02e-add-new-categories.js')
                LoadScripts(routes_dir+'01-posts-02f-add-new-featurn-img.js')

                LoadScripts(routes_dir+'01-posts-03a-categories.js')

                LoadScripts(routes_dir+'02-media-01a-media.js')
                LoadScripts(routes_dir+'02-media-02a-bulk-actions.js')

                //pages
                LoadScripts(routes_dir+'03-pages-01a-all.js')
                LoadScripts(routes_dir+'03-pages-01b-all-bulk-actions.js')
                
                LoadScripts(routes_dir+'03-pages-02a-add-new.js')
                LoadScripts(routes_dir+'03-pages-02b-preview.js')

                

                LoadScripts(routes_dir+'04-comments-01a-get-all.js')
                LoadScripts(routes_dir+'04-comments-01b-all-bulk-actions.js')

                
                LoadScripts(routes_dir+'05-appearance-01a-themes.js')
                LoadScripts(routes_dir+'05-appearance-02a-menus.js')
                LoadScripts(routes_dir+'05-appearance-03a-widgets.js')
                LoadScripts(routes_dir+'05-appearance-03b-widgets-data-parser.js')
                LoadScripts(routes_dir+'05-appearance-03c-widgets-crud.js')
                
                
                

                

                LoadScripts(routes_dir+'06-plugins-01a-installed.js')
                LoadScripts(routes_dir+'06-plugins-01b-installed-activate.js')
                LoadScripts(routes_dir+'06-plugins-01c-bulk-activate.js')
                LoadScripts(routes_dir+'06-plugins-02b-upload-new.js')               



                LoadScripts(routes_dir+'07-users-01a-your-profile.js')
                LoadScripts(routes_dir+'07-users-01b-your-profile-crud.js')



                LoadScripts(routes_dir+'08-setting-01a-general.js')
                LoadScripts(routes_dir+'08-setting-01b-reading.js')
                LoadScripts(routes_dir+'08-setting-01c-discussion.js')
                LoadScripts(routes_dir+'08-setting-01d-cdn.js')
                

                
                LoadScripts(routes_dir+'09-seo.js')

                

                LoadScripts(routes_dir+'10-tool-01a-export.js')
                LoadScripts(routes_dir+'10-tool-01b-import.js')

                LoadScripts(routes_dir+'11-dashboard-01a-home.js')
                LoadScripts(routes_dir+'12-gallery-01a-insert.js')

                

                LoadScripts(routes_dir+'13-pretty-url-01a-all.js')
                LoadScripts(routes_dir+'13-pretty-url-01b-data-parser.js')
                LoadScripts(routes_dir+'13-pretty-url-01c-crud.js')


                

                LoadScripts('js/002a-menu.js')




 
                //--->create tables and insert data - start
                
                //in DOM memory storage data tables
                alasql('CREATE TABLE themes') 
                alasql('CREATE TABLE theme_pages')

                


                alasql('CREATE TABLE np_users; SELECT * INTO np_users FROM ?',[data.np_users])
                alasql('CREATE TABLE np_options; SELECT * INTO np_options FROM ?',[data.np_options])
                alasql('CREATE TABLE np_terms; SELECT * INTO np_terms FROM ?',[data.np_terms])                
                
                

                
               
                if(_.size(data.theme_package.custome_pages) > 0 )
                {
                    var theme_pages = data.theme_package.custome_pages
                    alasql('SELECT * INTO theme_pages FROM ?',[theme_pages])
                }

                update_menu_comment_counter(data.np_comments)
                

                //--->create tables and insert data - end
                
                var display_name =  alasql('Select display_name FROM np_users')[0].display_name
                var siteurl =  alasql('SELECT option_value FROM np_options where option_name="siteurl"' )[0].option_value
                var blogname =  alasql('SELECT option_value FROM np_options where option_name="blogname"')[0].option_value

                js.ChangePageTitle ('Dashboard - ' +blogname+' - NodePress JS')

                $(document).find(".ScreenContainer").show()
                $(document).find(".LoadingMsg").hide()


                $(document).find('.sit_name').html(blogname)
                $(document).find('.sit_name').attr('href', siteurl)
                $(document).find('.logged_in_user_name').html('Hi, ' +  display_name)                
            } 
        })
    })
}