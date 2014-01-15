var http = require('http');
var path = require('path');
var fs = require('fs');

var mimeType = {
	'.js':"text/javascript",
	".html":"text/html",
	".css":"text/css"
};

http.createServer(function(req, res){
	var lookup = path.basename(decodeURI(req.url)) || 'index.html',
		f = 'content/' + lookup;
	fs.exists(f, function(exists){
		console.log(exists ? lookup + "is there" : lookup + "doesn't exists");
		if (exists) {
			fs.readFile(f, function(err, data){
				if(err){
					res.writeHead(500);
					res.end('Server Error!!!');
					return;
				}
				var headers = {"Content-type":mimeType[path.extname(lookup)]};
				res.writeHead(200, headers);
				res.end(data);
			});
			return;
		}
		res.writeHead(404);
		res.end('Page not found');
	});
}).listen(8080);