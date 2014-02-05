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
function cacheAndDeliver(filename, callback){
  fs.stat(filename, function(err, stats){
    var lastChanged = Date.parse(stats.ctime)
      , isUpdated = (cache[filename]) && lastChanged > cache[filename].timestamp;
    if(!cache[filename] || isUpdated){
      console.log('loading ' + filename + ' from file');
      fs.readFile(filename, function(err, data){
        console.log('filename:' + filename);
        if(!err){
          cache[filename] = {content:data, timestamp:Date.now() };
          console.log('assign filename.data/' + cache[filename].timestamp);
        }
        callback(err, data);
      });
      return;
    }
    console.log('loading ' + filename + ' from cache');
    callback(null, cache[filename].content);
  });
}

http.createServer(function(request, response){
  var lookup = path.basename(decodeURI(request.url)) || 'index.html'
    , filename = 'content/' + lookup;
  fs.exists(filename, function(exists){
    if(exists){
      cacheAndDeliver(filename, function(err, data){
        if(err){
          response.writeHead(500);
          response.end('internal server error');
          return;
        }
        var headers = {'Content-type':mineTypes[path.extname(lookup)]};
        response.writeHead(200, headers);
        response.end(data);
      });
      return;
    }
    response.writeHead(404);
    response.end('page not found!');
  });
}).listen(8080);