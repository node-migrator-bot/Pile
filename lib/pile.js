#! /usr/bin/env node
//
//    pile.js
//    FrenzyLabs, llc
//
//    Created by Wess Cope on 2011-12-01.
//    Copyright 2011 FrenzyLabs, llc. All rights reserved.
//

(function(){
    var fs  = require('fs'),
        App = require('./criteria').App,
        Srv = require('./server').staticServer;
    
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
            callback    : function()
            {
                
            }
        },
        {
            name        : "Create Pile Template",
            description : "Create a new Pile Template from current directory",
            flags       : ['-t', '--template'],
            callback    : function(name)
            {
            }
        }
    ]);
    
    app.run();
    
})();