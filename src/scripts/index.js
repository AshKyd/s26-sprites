var File = require('./file');
var Sprite = require('./sprite');
var async = require('async');
var xhr = require('xhr');

var s26 = function(){
    this.sprites = {};
    this.files = {};
}

s26.prototype.loadSpriteSheet = function(url, cb){
    var _this = this;
    var spritesheet;
    async.series([
        function(cb){
            // Get the spritesheet from the server.
            xhr({uri:url}, function(err, resp, body){
                spritesheet = JSON.parse(body);
                cb()
            });
        },
        function(cb){
            // Load in each file
            var files = Object.keys(spritesheet.files);
            async.eachSeries(files, function(file, cb){
                _this.loadImage(spritesheet.files[file], function(){
                    cb();
                });
            }, function(){
                cb();
            });
        },
        function(cb){
            // Load in each sprite
            async.eachSeries(Object.keys(spritesheet.sprites), function(sprite, cb){
                var s = spritesheet.sprites[sprite];
                _this.loadSprite({
                    name: s.file,
                    sprite: s
                }, function(){
                    console.log(s.props.name,'loaded');
                    cb();
                });
            }, function(){
                cb();
            });
        }
    ], function(){
        cb();
    });
}

s26.prototype.loadImage = function(opts, cb){
    var prop;
    if(this.files[opts.name]){
        prop = opts.name;
    }

    if(this.files[opts.url]){
        prop = opts.url;
    }

    // Ugh what a mess. Should look at promises later.
    if(prop){
        // console.log('Already exists',prop);
        if(this.files[prop].loaded){
            // console.log('calling back directly');
            return cb(this.files[prop]);
        } else {
            // console.log('waiting for the done event');
            return this.files[prop].once('done', cb);
        }
    }

    var file = new File(opts);
    this.files[file.name] = file;
    file.load(cb);
}

s26.prototype.loadSprite = function(opts, loadSpriteCb){
    var _this = this;
    var file;
    var sprite;

    async.series([
        // Load the image if it isn't already.
        function(cb){
            _this.loadImage({
                url: opts.url,
                name: opts.name
            }, function(f){
                file = f;
                cb();
            });
        },
        // Create the sprite with the image.
        function(cb){
            sprite = new Sprite(file).load(opts.sprite, function(s){
                _this.sprites[s.props.name] = s;
                cb();
            });
        }
    ], function(){
        // Complete. Call back with our sprite.
        loadSpriteCb(sprite);
    });
}


module.exports = s26;
