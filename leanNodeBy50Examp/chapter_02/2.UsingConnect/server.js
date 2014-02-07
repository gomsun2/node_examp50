var connect = require('connect');
var util = require('util');
var form = require('fs').readFileSync('form.html');

connect.createServer(function(request, response){
  if (request.method === 'POST'){
    response.end('You posted: \n' + util.inspect(request.body));
  }
  if (request.method === 'GET'){
    response.writeHead(200, {'Content-Type':'text/html'});
    response.end(form);
  }
}).listen(8080);