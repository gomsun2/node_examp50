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
var cache = {};

http.createServer(function(request, response){
  console.log('createServer');
  var lookup = path.basename(decodeURI(request.url)) || 'index.html'
    , filename = 'content/' + lookup;
  fs.exists(filename, function(exists){
    var headers = {'Content-Type':mineTypes[path.extname(filename)]};
    if(cache[filename]){
      response.writeHead(200, headers);
      response.end(cache[filename]);
      return;
    }
    var s = fs.createReadStream(filename).once('open', function(){
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
      s.on('data', function(chuck){
        chuck.copy(cache[filename].content, bufferOffset, bufferOffset += chuck.length);
      });
    });
    response.writeHead(404);
    response.end('page not found!');
  });
}).listen(8080);