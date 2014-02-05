/**
 * Created by mac on 2014. 2. 5..
 */

var http = require('http');
var url = require('url');

var pages = [
  {id: '1', router: '', output:'Wohoo!'},
  {id: '2', router: 'about', output: 'A Simple routing with node example'},
  {id: '3', router: 'another page', output: function(){return 'Here\'s ' + this.router;}}
];

http.createServer(function (request, response){
  console.log('req.url: ' + request.url);
  console.log('decodeURI(req.url): ' + decodeURI(request.url));
  console.log('url.parse(decodeURI(request.url), true): ' + url.parse(decodeURI(request.url), true).query.id);
  var id = url.parse(decodeURI(request.url), true).query.id;
  if (id){
    pages.forEach(function(page){
      console.log('id: ' + id + ', page: ' + page.id);
      if(page.id === id){
        console.log('true');
        response.writeHead(200, {'Content-type':'text/html'});
        response.end(typeof page.output === 'function' ? page.output() : page.output);
      }
    });
  }
  if (!response.finished){
    response.writeHead(404);
    response.end('page not found');
  }
}).listen(8080);

