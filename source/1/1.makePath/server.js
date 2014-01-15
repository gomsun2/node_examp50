var http = require('http');
var path = require('path');

var pages = [
    {route: '', output: 'Woohoo!!!'},
    {route: '/about/this', output: 'Multilevel routing with Node example'},
    {route: '/about/node', output: 'Evented I/O for V8 Javascript'},
    {route: '/about', output: 'A Simple routing with node.js example'},
    {route: '/another page', output: function(){return 'Here\'s ' + this.route;}}
];
http.createServer(function(req, res) {
  var lookup = decodeURI(req.url);
  pages.forEach(function(page) {
    if (page.route === lookup) {
      res.writeHead(200, {'Content-Type':'text/html'});
      res.end(typeof page.output === 'function' ? page.output() : page.output);
    };
  });  
  if(!res.finished){
    res.writeHead(404);
    res.end('Page not found');
  };
}).listen(8080);