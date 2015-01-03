var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var colorize = new (require('./colorize.js'))(require('./config'));
var async = require('async');
var xhr = require('xhr');

function loadImg(type, content, cb) {
    var src = 'data:'+type+';charset=utf-8,'+encodeURIComponent(content);
    var img = new Image();
    img.onload = function() {
        cb(img);
    };
    img.src = src;
}

function File(opts){
    this.setOpts(opts);
    return this;
}
inherits(File, EventEmitter);

File.prototype.load = function(cb){
    if(this.content){
        cb(this);
    } else if(this.url) {
        // We need to fetch this image.
        this.fetch(cb);
    }
    return this;
}

File.prototype.fetch = function(cb){
    var _this = this;
    xhr({uri:_this.url}, function(err, resp, body){
        if(!err){
            _this.setOpts({
                content: body,
                type: resp.headers['content-type'],
                name: _this.url
            });
            _this.emit('done', _this);
            cb(_this);
        }
    })
    return _this;
}



File.prototype.render = function(opts, renderCallback){
    var _this = this;
    var content = this.content;
    var img;
    async.series([
        function(cb){
            if(opts.rendition && opts.rendition.colorize){
                // If we have colorize opts, fire that up.
                colorize.recolourAll({
                    svg: content,
                    primary: opts.rendition.colorize.primary,
                    secondary: opts.rendition.colorize.secondary,
                    flip: opts.rendition.flip, // Adjusts shadows.
                }, function(colorized){
                    content = colorized;
                    cb();
                });
            } else {
                cb();
            }
        },
        function(cb){
            // Load the image as a dom element.
            loadImg(_this.type, content, function(ele){
                img = ele;
                cb();
            });
        },
        function(cb){
            if(opts.sprite && opts.sprite.dims){
                console.log('cropping sprite');
                var can = document.createElement('canvas');
                can.width = opts.sprite.dims.w;
                can.height = opts.sprite.dims.h;
                var ctx = can.getContext('2d');
                ctx.drawImage(img, opts.sprite.imgOffset.left, opts.sprite.imgOffset.top);
                img = can;
            }

            if(opts.sprite && opts.rendition.flip){
                // If we've requested a flipped resource, we also
                // need to flip the pixel data.
                var can = document.createElement('canvas');
                can.width = img.width;
                can.height = img.height;
                var ctx = can.getContext('2d');
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0-img.width, 0);
                img = can;
            }
            cb();
        }
    ], function(){
        // Call back with the image or canvas as requested.
        renderCallback(img);
    })

}

File.prototype.setOpts = function(opts){
    var _this = this;
    ['content', 'type', 'name', 'url'].forEach(function(prop){
        _this[prop] = opts[prop] || _this[prop];
    });
    _this.name = _this.name || _this.url;
    if(this.content){
        this.loaded = true;
    } else{
        this.loaded = false;
    }
    return this;
}

module.exports = File;
