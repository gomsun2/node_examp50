/**
 * Created by mac on 2014. 2. 5..
 */

var http = require('http');
var path = require('path');
var fs = require('fs');

var mineTypes = {
  '.js':'text/javascript',
  '.html':'text/html',
  '.css':'text/css'
};

http.createServer(function(request, response){
  console.log('path.basename(decodeURI(rerquest.url)):' + path.basename(decodeURI(request.url)));
  var lookup = path.basename(decodeURI(request.url)) || 'index.html'
    , filename = 'content/' + lookup;
  fs.exists(filename, function(exists){
    console.log(exists ? lookup + ' is there' : 'doesn\'t exists');
    if(exists){
      fs.readFile(filename, function(err, data){
        if(err){
          response.writeHead(500);
          response.end('Server Error!!');
        }
        var headers = {'Content-type':mineTypes[path.extname(lookup)]};
        response.writeHead(200, headers);
        response.end(data);
      });
      return;
    }
    response.writeHead(404);
    response.end('page not found!');
  });
}).listen(8080);