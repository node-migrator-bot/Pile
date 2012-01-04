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
                    fs.writeFile(self.destination, data, function(err){
                        if(err)
                        {
                            console.log("RESPONSE END ERROR: " + err);
                            process.exit(-1);
                        }
                    });
                    // writeFile.end();
                    // writeFile.destroy();
                });
                
                response.on('error', function(e){
                    console.log("Response Error: " + e.message);
                    process.exit(-1);
                });
            });
        }
    };
    
    var Build = {
        __processLib: function(lib)
        {
            var name        = lib.name || (function(libUrl){
                    var splitUrl = libUrl.split('/'); 
                    return splitUrl[splitUrl.length - 1];
                })(lib.url),
                destination = "%@/%@/%@".$$(process.cwd(), lib.destination, name);
            
            return {name: name, destination: destination, relative: lib.destination, url: lib.url}
        },
        
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
        generate: function(libs, dest)
        {
            var Handlebars  = require('Handlebars'),
                jsFiles     = new Array(),
                cssFiles    = new Array(),
                source      = fs.readFileSync('%@/%@'.$$(__dirname, dest), 'utf8'),
                template    = Handlebars.compile(source);
            
            for(var i = 0; i < libs.length; i++)
            {
                var lib = Build.__processLib(libs[i]),
                    destination = "%@/%@".$$(lib.relative, lib.name);
                
                if(destination.indexOf('js') === 0)
                    jsFiles.push(destination);
                    
                if(destination.indexOf('css') === 0)
                    cssFiles.push(destination)
            }
            
            fs.writeFile("%@/index.html".$$(process.cwd()), template({javascripts: jsFiles, css: cssFiles}), function(err){
                if(err)
                {
                    console.log(err);
                    process.exit(-1);
                }
            });
        },
        
        download: function(libs)
        {
            for(var i = 0; i < libs.length; i++)
            {
                var lib = Build.__processLib(libs[i]);
                new Download(lib.url, lib.destination).execute();
            }
        }
    };
    
    exports.Build = Build;
    
})();