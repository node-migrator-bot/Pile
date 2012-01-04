#!/usr/bin/env node
//
//    pile.js
//
//    Created by Wess Cope on 2011-12-01.
//    Copyright 2011 FrenzyLabs, llc. All rights reserved.
//

(function(){
    var fs      = require('fs'),
        vm      = require('vm'),
        App     = require('./criteria').App,
        Srv     = require('./server').staticServer,
        Build   = require('./builder').Build;
        
    
    var app = new App({
        name:   "Pile",
        description: "Command Utility For Developers",
        version: "1.0",
        usage: "pile [OPTION]..."
    },
    [
        {
            name        : "Pile Server",
            description : "For dev and testing",
            flags       : ["-s", "--server"],
            callback    : function(port) {
                Srv((typeof port !== 'number')? port : undefined);
            }
        },
        {
            name        : "Init Pile Manager",
            description : "Setup current directory for Pile Management",
            flags       : ["-i", "--init"],
            callback    : function(gen)
            {
                fs.readFile("%@/stackfile".$$(__dirname), function(err, data){
                    if(err)
                    {
                        console.log("error: " + err);
                        process.exit(-1);
                    }
                    
                    fs.writeFile("%@/stackfile".$$(process.cwd()), data, function(err){
                        if(err)
                        {
                            console.log("error: " + err);
                            process.exit(-1);
                        }
                        
                        console.log("Created Stackfile");
                    })
                    
                });
            }
        },
        {
            name        : "Create Pile Template",
            description : "Create a new Pile Template from current directory",
            flags       : ['-t', '--template'],
            callback    : function(name)
            {
            }
        },
        
        {
            name    : "Run Pile",
            description : "Have Pile build based on the local stackfile",
            isDefault: true,
            callback: function()
            {
                fs.readFile("%@/stackfile".$$(process.cwd()), function(err, data){
                    if(err)
                    {
                        console.log("%@ does not exist.\nPlease run pile -i".$$(err.path));
                        process.exit(-1);
                    }
                    
                    var wrapper = "(function(){var Pile = {}; %@ return Pile})()".$$(data),
                        script  = vm.createScript(wrapper, 'stack.vm'),
                        result  = script.runInThisContext();
                    
                    Build.paths(result.stack.paths);
                    Build.download(result.stack.libs);
                    Build.generate(result.stack.libs);
                });
            }
        }
    ]);
    
    app.run();
    
})();