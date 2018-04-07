$(document).ready(function()
{
    //load function
    MixContentLinks()
})

var MixContentLinks = function()
{
    $("a").filter(function()  
    {
        var href = $(this).attr('href')
        var urlNoProtocol = href.replace(/^https?\:\/\//i, "//")
        $(this).attr('href',urlNoProtocol)

    })
}