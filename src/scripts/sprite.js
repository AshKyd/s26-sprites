var Rendition = require('./rendition');
var async = require('async');
var extend = require('extend');

function Sprite(file){
    this.file = file;
    this.renditions = {};
}

Sprite.prototype.load = function(opts, cb){
    var _this = this;
    this.props = opts.props;
    this.opts = opts;

    if(opts.renditions){
        this.makeRenditions(opts.renditions, cb);
    } else {
        this.makeRenditions({
            default: {}
        }, cb);
    }
    return this;
}

Sprite.prototype.makeRenditions = function(renditions, cb){
    var _this = this;
    var expandedRenditions = [];

    // Set up our renditions,, including flipped versions.
    Object.keys(renditions).forEach(function(key){
        var rendition = renditions[key];
        expandedRenditions.push({
            name: key,
            opts: rendition
        });

        // Flip it too unless we've explicitly opted out,
        if(rendition.flip !== false && _this.opts.flip !== false){
            expandedRenditions.push({
                name: key+'-flipped',
                opts: extend({}, rendition, {
                    flip: !rendition.flip
                })
            });
        }
    });

    async.eachSeries(expandedRenditions, function(renditionOpts, cb){
        _this.renditions[renditionOpts.name] = new Rendition(_this)
            .load(renditionOpts.opts, function(){
                cb();
            });
    }, function(){
        cb(_this);
    })
    return this;
}

module.exports = Sprite;
