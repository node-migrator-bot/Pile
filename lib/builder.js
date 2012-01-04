(function(){
    var fs      = require('fs'),
        path    = require('path'),
        url     = require('url'),
        http    = require('http'),
        https   = require('https');
    
    var Download = function(){ this.init.apply(this, arguments)};
    Download.prototype = {
        init: function(remote, destination)
        {
            this.url = url.parse(remote);
            this.destination = destination || process.cwd();
            this.redirected = false;
            
            this.httpRequest = remote.indexOf('https') === 0? https.get : http.get;
        },
        
        execute: function()
        {
            var self    = this,
                details = {
                host: this.url.hostname,
                port: this.url.port,
                path: this.url.pathname
            },
            request     = this.httpRequest(details, function(response){
                var contentLength   = 0;
                    downloaded      = 0,
                    percent         = 0,
                    fileReady       = false,
                    data            = "";
                
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
                    // if(!fileReady)
                    // {
                    //     writeFile   = fs.createWriteStream(self.destination);    
                    //     fileReady = true;
                    // }
                    // writeFile.write(chunk);
                    // downloaded += chunk.length;
                    // percent = parseInt((downloaded / contentLength) * 100);
                    data += chunk;
                });
                
                response.on('end', function(){
                    fs.writeFileSync(self.destination, data);
                    // writeFile.end();
                    // writeFile.destroy();
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
                var name        = libs[i].name || (function(url){
                        var splitUrl = url.split('/'); 
                        return splitUrl[splitUrl.length - 1];
                    })(libs[i].url),
                    destination = "%@/%@/%@".$$(process.cwd(), libs[i].destination, name);
                    
                new Download(libs[i].url, destination).execute();
            }
        }
    };
    
    exports.Build = Build;
    
})();