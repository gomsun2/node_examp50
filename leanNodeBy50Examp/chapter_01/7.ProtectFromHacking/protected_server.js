
var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

http.createServer(function(request, response){
  var lookup = url.parse(decodeURI(request.url)).pathname;
  lookup = path.normalize(lookup);
  lookup = (lookup === '/') ? '/index.html' : lookup;
  var f = 'content' + lookup;
  console.log(f);
  fs.exists(f, function(exists){
    if(!exists){
      response.writeHead(404);
      response.end('page not found');
      return;
    }
    fs.readFile(f, function(err, data){
      response.end(f);
    });
  });
}).listen(8080);
