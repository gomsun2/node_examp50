var http = require('http');
var url = require('url');

var pages=[
	{id:'1', route:'', output:'Woohooo!!'},
	{id:'2', route:'about', output:'A simple routing with Node exmaple'},
	{id:'3', route:'another page', output:function(){ return 'Here\'s' + this.route}}
];

http.createServer(function(req, res){
	var id = url.parse(decodeURI(req.url), true).query.id;
	if (id){
		pages.forEach(function(page){
			if (page.id === id){
				res.writeHead(200, {'Content-Type':'text/html'});
				res.end(typeof page.output === 'function' ? page.output() : page.output);
			}
		});
		if (!res.finished){
			res.writeHead(404);
			res.end('Page not found');
		}
	}
}).listen(8080);