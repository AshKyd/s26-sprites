var extend = require('extend');

function Rendition(sprite){
    this.sprite = sprite;
}

Rendition.prototype.load = function(opts, cb){
    var _this = this;
    _this.opts = opts;
    _this.sprite.file.render({
        rendition: _this.opts,
        sprite: _this.sprite.opts
    }, function(img){
        _this.img = img;
        cb(_this);
    });
    return this;
}

module.exports = Rendition;
