(function(){
    var fs      = require('fs'),
        path    = require('path'),
        url     = require('url'),
        http    = require('http');
    
    var Download = function(){ this.init.apply(this, arguments)};
    Download.prototype = {
        init: function(remote, destination)
        {
            this.url = url.parse(remote);
            this.destination = destination || process.cwd();
            this.redirected = false;
        },
        
        execute: function()
        {
            var self    = this,
                details = {
                host: this.url.hostname,
                port: this.url.port,
                path: this.url.pathname
            },
            request     = http.get(details, function(response){
                var contentLength   = 0;
                    downloaded      = 0,
                    percent         = 0,
                    fileReady       = false,
                    writeFile       = null;
                
                switch(response.statusCode)
                {
                    case 200:
                        contentLength = parseInt(response.headers['content-length']);
                        break;

                    case 302:
                        self.url = response.headers.location;
                        self.execute();
                        break;
                        
                    case 404:
                        console.log("404: File not found");
                        break;
                        
                    default:
                        request.abort();
                        return;
                }
                
                response.on('data', function(chunk){
                    if(!fileReady)
                    {
                        writeFile   = fs.createWriteStream(self.destination);    
                        fileReady = true;
                    }
                    writeFile.write(chunk);
                    downloaded += chunk.length;
                    percent = parseInt((downloaded / contentLength) * 100);
                });
                
                response.on('end', function(){
                    writeFile.end();
                });
                
                response.on('error', function(e){
                    console.log("Error: " + e.message);
                    process.exit(-1);
                });
            });
        }
    };
    
    var Build = {
        paths: function(pathList)
        {
            var paths       = typeof pathList === "string"? [pathList] : pathList,
                currentDir  = process.cwd();
            
            for(var i = 0; i < paths.length; i++)
            {
                var dir = "%@/%@".$$(currentDir, paths[i]);
                
                if(!path.existsSync(dir))
                    fs.mkdirSync(dir);
            }
            
        },
        
        download: function(libs)
        {
            for(var i = 0; i < libs.length; i++)
            {
                var destination = "%@/%@/%@".$$(process.cwd(), libs[i].destination, libs[i].name);
                new Download(libs[i].url, destination).execute();
            }
        }
    };
    
    exports.Build = Build;
    
})();