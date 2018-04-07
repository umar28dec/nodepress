
var port = 80; // <---- Change this to whatever port number you want run it on




/*
	Don't change anything below
	Unless you want to risk NodePress JS not working as originally coded!!!
*/



//--->Node requires - Start 
var express 	= require('express');
global.app      = express();

global.request  = require('request');
global.http     = require('http');
global.fs       = require('fs');
global.path     = require("path");
global.crypto 	= require('crypto');

global.url 		= require('url');


//--->Node requires - End 



//--->Data processing libs - Start 
global.MongoClient 	= require('mongodb').MongoClient;

global.npdb = require(__dirname+'/routes/_inc/conn_mongodb').MyMongoDB()

//for view engine
global.EJS  = require('ejs');

//Need it for parsing json data
global.bodyParser  =  require("body-parser");

//for dates/times
global.moment = require('moment-timezone');
//moment().tz('America/New_York').format('MM-DD-YYYY h:mm:ss');

//for data mining 
global._ = require('lodash');

//for DOM storage like mysql database/table/queries
global.alasql      = require('alasql');
 

//for uploading
global.formidable = require('formidable');

//for uglifing js files
global.UglifyJS = require("uglify-js");

//for unzipping the files
global.unzip = require('unzip');

//--->Data processing libs - End



//--->Local/Custom libs - Start 


//For local functions
global.func = require(__dirname+'/routes/_inc/func-local');
global.func_db = require(__dirname+'/routes/_inc/func-db');


global.ip = require(__dirname+'/routes/_inc/ip'); 
//--->Local/Custom libs - End



// configure app to use bodyParser()
// this will let us get the data from a POST

//need this for large site data import
//default bodyParser is only: 100kb!!!!
 
app.use( bodyParser.json({limit: '150mb'}) );
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true,
  parameterLimit:150000
}));

//set the default templating engine to ejs
app.set('view engine', 'ejs');

//set the default folder to "views"
app.use(express.static(path.join(__dirname, 'views')));


app.listen(process.env.PORT || port);
console.log('server is running '+ port);




/*
    Note: 
    when using GET request use(get) to get the value : req.query.obj/parameter name
    when using POST request use(body) to get the value : req.body.obj/parameter name

*/


//--->To prevent cross domain error messages - Start
app.all('*', function(req, res, next) 
{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
//--->To prevent cross domain error messages - End




 
//install screen routes
require(__dirname+'/routes/001a_Config');

require(__dirname+'/routes/np-uglify.js');


//--->admin screen routes - start

//for login and out
require(__dirname+'/routes/admin/001a-np-admin-log-in-out');


//for posts
require(__dirname+'/routes/admin/002a-np-admin-posts');

//for categories
require(__dirname+'/routes/admin/002b-np-admin-categories');

//for media
require(__dirname+'/routes/admin/003a-np-admin-media');

//for pages
require(__dirname+'/routes/admin/004a-np-admin-pages');


//for comments
require(__dirname+'/routes/admin/005a-np-admin-comments');


//for themes
require(__dirname+'/routes/admin/006a-np-admin-themes');
require(__dirname+'/routes/admin/006b-np-admin-menu');
require(__dirname+'/routes/admin/006c-np-admin-widgets');



//for plugins
require(__dirname+'/routes/admin/007a-np-admin-plugins');


//for users > your profile  
require(__dirname+'/routes/admin/008a-np-admin-users-your-profile');


//for settings 
require(__dirname+'/routes/admin/009a-np-admin-settings-general');
require(__dirname+'/routes/admin/009b-np-admin-settings-reading');
require(__dirname+'/routes/admin/009c-np-admin-settings-discussion');
require(__dirname+'/routes/admin/009d-np-admin-settings-cdn');

//for seo
require(__dirname+'/routes/admin/010a-np-admin-seo');

//for export and import site data
require(__dirname+'/routes/admin/011a-np-admin-export-import');

//for pretty url 
require(__dirname+'/routes/admin/012b-np-admin-pretty-url');




//for dashboards
require(__dirname+'/routes/dashboards/001a-dashboard-home');
//--->admin screen routes - end



//api calls from backend  
require(__dirname+'/routes/api/001a-api-options'); 
require(__dirname+'/routes/api/002a-api-token'); 
require(__dirname+'/routes/api/003a-api-comment'); 
require(__dirname+'/routes/api/004a-api-categories-and-others'); 




//--->custom routes > start

//example file for your custom route

//require(__dirname+'/routes_custom/np-route-template.js'); 

//--->custom routes > end


//--->client routes - start
require(__dirname+'/routes/client/pretty-url');

//for rss/feed/sitemap
require(__dirname+'/routes/client/feed');

//main index/home route
require(__dirname+'/routes/client/index');

//--->client routes - end
