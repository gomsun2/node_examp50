var http = require('http');
var path = require('path');
var fs = require('fs');

var mineTypes = {
  '.js':'text/javascript',
  '.html':'text/html',
  '.css':'text/css'
};

var cache = {};
http.createServer(function(request, response){
  var lookup = path.basename(decodeURI(request.url)) || 'index.html'
    ,filename = 'content/' + lookup;
  fs.exists(filename, function(exists){
    if(exists){
      var headers = {'Content-Type':mineTypes[path.extname(filename)]};
      if(cache[filename]){
        console.log('from cache');
        response.writeHead(200, headers);
        response.end(cache[filename].content);
        return;
      }
      var stream = fs.createReadStream(filename).once('open', function(){
        response.writeHead(200, headers);
        this.pipe(response);
      }).once('error', function(e){
        console.log('fs.createReadStream error:' + e);
        response.writeHead(500);
        response.end('internal server error!!');
      });
      fs.stat(filename, function(err, stats){
        var bufferOffset = 0;
        cache[filename] = {content: new Buffer(stats.size)};
        stream.on('data', function(chuck){
          chuck.copy(cache[filename].content, bufferOffset);
          bufferOffset += chuck.length;
        });
      });
      return;
    }
    response.writeHead(404);
    response.end('page not found!');
  });
}).listen(8080);