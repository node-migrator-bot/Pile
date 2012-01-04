//
//    ext.js
//    FrenzyLabs, llc
//
//    Created by Wess Cope on 2011-11-18.
//    Copyright 2011 FrenzyLabs, llc. All rights reserved.
//

(function()  {
    String.prototype.format = String.prototype.$$ = function() 
    {
        var args = arguments,
            idx = 0;

        return this.replace(/%@([0-9]+)?/g, function(s, argIndex) 
        {
            argIndex = (argIndex) ? parseInt(argIndex,0)-1 : idx++;
            s = args[argIndex];
            return ((s===null) ? '(null)' : (s===undefined) ? '' : s).toString();
        });
    }

    String.prototype.words = String.prototype.w = function()
    {
        return this.split(' ');
    }

    String.prototype.ucFirstSentence = function()
    {
        return this.substring(0,1).toUpperCase() + this.substring(1, this.length);
    }

    String.prototype.ucFirstWord = function()
    {
        var stringArray = this.w(),
            finalString = '';

        for(item in stringArray)
            finalString += stringArray[item].substring(0,1).toUpperCase() + stringArray[item].substring(1, stringArray[item].length) + ' ';
    
        return finalString.substring(0, (finalString.length - 1));
    }

    String.prototype.deCamel = function()
    {
        return this.replace(new RegExp("([A-Z])", "g"), (typeof arguments[0] !== 'undefined')? arguments[0] : "_" + "$1").toLowerCase();
    }

    String.prototype.linkify = function()
    {

        return (function(urlString){
            var pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

            return (!urlString.match(pattern))? 
                urlString.replace('www.', 'http://').replace(pattern,"<a href='$1'>$1</a>") : 
                urlString.replace(pattern,"<a href='$1'>$1</a>");       

        })(this);
    }

    String.prototype.trim = function(str)
    {
        return this.replace(/(?:^\s+|\s+$)/g, "");
    }

    Array.prototype.remove = function(from, to)
    {
        var rest = this.splice((to || from) + 1 || this.length);
        this.length = from < 0? this.length + from : from;
    
        return this.push.apply(this, rest);
    }

    /** 
     * Javascript Object Additions
     *
     * Bad practice and could break looping
     * if we extend Object's prototype, so 
     * we just add methods to the namespace
     */
    Object.size = function(object)
    {
        var size = 0,
            key;

        for(key in object)
        {
            if(object.hasOwnProperty(key))
                size++;
        }

        return size;
    }

    Object.extend = function(destination, source)
    {
        for(var item in source)
            destination[item] = source[item];
    
        return destination;
    }

    Object.clone = function(object)
    {
        return extend({}, object);
    }
    
    Object.forEach = function(object, callback)
    {
        for(var key in object)
            callback.apply(object, [key, object[key]]);
    }
    
    Object.isEmpty = function(object)
    {
        for(var item in object)
            if(object.hasOwnProperty(item)) return false;
        
        return true;
    }
     
})();