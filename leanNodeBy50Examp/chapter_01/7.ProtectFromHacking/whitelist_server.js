var http = require('http');
var url = require('url');
var fs = require('fs');

var whitelist = [
  '/index.html',
  '/subcontents/styles.css',
  '/subcontents/script.js'
];

http.createServer(function(request, response){
  var lookup = url.parse(decodeURI(request.url)).pathname;
  lookup = (lookup === '/') ? '/index.html' : lookup;
  var f = 'content' + lookup;
  if (whitelist.indexOf(lookup) == -1){
    response.writeHead(404);
    response.end('page not found.');
    return;
  }
  console.log(f);
  fs.readFile(f, function(err, data){
    response.end(f);
  });
}).listen(8080);