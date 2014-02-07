var http = require('http');
var path = require('path');
var fs = require('fs');

var mineTypes = {
  '.js':'text/javascript',
  '.html':'text/html',
  '.css':'text/css'
};

var cache = {
  store: {},
  maxSize: 1024 * 1024 * 25,
  maxAge: 1000 * 60 * 30 * 3,     //  1hour 30min
  cleanAfter: 1000 * 60 * 60 * 2, //  2hour
  cleanedAt: 0,
  clean: function(now){
    if (now - this.cleanAfter > this.cleanedAt){
      this.cleanedAt = now;
      var that = this;
      Object.keys(this.store).forEach(function(file){
        if(now > that.store[file].timestamp + that.maxAge){
          delete that.store[file];
        }
      });
    }
  }
};
http.createServer(function(request, response){
  var lookup = path.basename(decodeURI(request.url)) || 'index.html'
    , f = 'content/' + lookup;
  fs.exists(f, function(exists){
    if (exists){
      var headers = {'Content-Type':mineTypes[path.extname(f)]};
      if(cache[f]){
        console.log('from cache');
        response.writeHead(200, headers);
        response.end(cache[f].content);
        return;
      }
      var s = fs.createReadStream(f).once('open', function(){
        response.writeHead(200, headers);
        this.pipe(response);
      }).once('error', function(e){
        console.log('fs.createReadStream error:' + e);
        response.writeHead(500);
        response.end('internal server error!!');
      });
      fs.stat(f, function(err, stats){
        if (stats < cache.maxSize){
          var bufferOffset = 0;
          cache.store[f] = {
            content: new Buffer(stats.size),
            timestamp: Date.now()
          };
          s.on('data', function(data){
            data.copy(cache.store[f].content, bufferOffset);
            bufferOffset += data.length;
          });
        }
      });
      return;
    }
    response.writeHead(404);
    response.end('page not found!');
    cache.clean(Date.now());
  });
}).listen(8080);