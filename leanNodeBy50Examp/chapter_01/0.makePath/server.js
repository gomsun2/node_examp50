/**
 * Created by mac on 2014. 2. 5..
 */

var http = require('http');
var path = require('path');

var pages = [
  {router: '', output:'Wohoo!'},
  {router: 'about', output: 'A Simple routing with node example'},
  {router: 'about/this', output: 'Multilevel routing with node example'},
  {router: 'about/node', output: 'Evented I/O for v8 javascript'},
  {router: 'another page', output: function(){return 'Here\'s ' + this.router;}}
];

http.createServer(function (request, response){
  var lookup = path.basename(decodeURI(request.url));
  console.log('lookup: [' + lookup + ']');
  pages.forEach(function(page){
    if (page.router === lookup) {
      response.writeHead(200, {'Content-Type':'text/html'});
      response.end(typeof page.output === 'function' ? page.output() : page.output);
    };
  });
  if (!response.finished){
    response.writeHead(404);
    response.end('page not found');
  };
}).listen(8080);

