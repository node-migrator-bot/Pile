//
//    criteria.js
//    FrenzyLabs, llc
//
//    Created by Wess Cope on 2011-12-01.
//    Copyright 2011 FrenzyLabs, llc. All rights reserved.
//

(function(){
    require('./ext');
    var emitter = require('events').EventEmitter;
    
    var App = function(){ this.init.apply(this, arguments); };
    App.prototype = {
        init: function(details, routes)
        {
            this.name        = details.name                     || false,
            this.description = details.description              || false,
            this.version     = details.version                  || false;
            this.usage       = "Usage: %@".$$(details.usage)    || "";

            routes.push({
                name        : (this.name)? "%@ Help".$$(this.name) : "Help",
                description : (this.description)? this.description : "",
                flags       : ["-h", "--help"],
                callback    : function()
                {
                    var tmp = "%@\t%@ \t%@";
                    var helpOutput = [];

                    this.routes.forEach(function(value, index){
                        helpOutput.push(tmp.$$(value.flags.join(", "), value.name, value.description));
                    });

                    var output = "%@ %@, %@\n%@\n%@".$$( this.name? this.name : "", 
                                                this.version?this.version : "", 
                                                this.description?this.description : "",
                                                this.usage,
                                                helpOutput.join("\n"));
                    
                    console.log(output);
                }
            });

            if(this.version)
            {
                routes.push({
                    name: "Version",
                    description: "Show current version",
                    flags: ['-v', '--version'],
                    callback: function()
                    {
                        console.log("%@ %@".$$(this.name, this.version));
                    }
                });
            }
            
            this.routes = routes;
        },
        
        parse: function(args) {
            var args = args || process.argv,
                opts = {}, 
                curSwitch;

            args.forEach(function(arg) {
                
                if (/^(-|--)/.test(arg) || !curSwitch) 
                {
                    opts[arg] = true;
                    curSwitch = arg;
                } 
                else 
                {
                    if (arg === 'false')
                        arg = false;
                    else if (arg === 'true')
                        arg = true;
                    else if (!isNaN(arg))
                        arg = Number(arg);
                    

                    if (typeof opts[curSwitch] === 'boolean')
                        opts[curSwitch] = arg;
                    else if (Array.isArray(opts[curSwitch]))
                        opts[curSwitch].push(arg);
                    else
                        opts[curSwitch] = [opts[curSwitch], arg];
                }
            });

            return opts;
        },
        
        run: function()
        {
            var self = this,
                args = this.parse(process.argv.slice(2, process.argv.length));
            
            for(var arg in args)
            {
                for(var i = 0; i < this.routes.length; i++)
                {
                    var route = this.routes[i];
                    if(route.flags.indexOf(arg) !== -1)
                    {
                        var withArgs = (!Array.isArray(args[arg]))? [args[arg]] : args[arg];
                        route.callback.apply(this, withArgs);
                    }
                }
            }
        }
    }
    
    exports.App = App;
})();