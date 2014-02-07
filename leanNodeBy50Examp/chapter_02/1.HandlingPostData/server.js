var http = require('http');
var querystring = require('querystring');
var util = require('util');
var form = require('fs').readFileSync('form.html');

var maxData = 2 * 1024 * 1024;

http.createServer(function(request, response){
  if (request.method === 'GET'){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.end(form);
  }
  if (request.method = 'POST'){
    var postData = '';
    request.on('data', function(chuck){
      postData += chuck;
      console.log('postDasta.length: ' + postData.length);
      if (postData.length > maxData){
        postData = '';
        this.pause();
        response.writeHead(413);
        response.end('too large');
      }
    }).on('end', function(){
      if (!postData){
        response.end();
      }
      var postDataObject = querystring.parse(postData);
      response.end('you posted:\n' + util.inspect(postDataObject));
    });
  }
}).listen(8080);
