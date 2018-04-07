

exports.MyMongoDB = function()  
{
	var exist = statPath('./db_conn/np-config.json');	
	if(exist )
	{
		var file_name = path.join(process.cwd()+'/db_conn/np-config.json')
		var con_db = JSON.parse(fs.readFileSync(file_name)).db_conn;

		MongoClient.connect(con_db, (err, database) => 
		{
			if (err) return console.log(err)
			npdb = database 
		})
	}
}


function statPath(path) {
  try {
    return fs.statSync(path);
  } catch (ex) {}
  return false;
}