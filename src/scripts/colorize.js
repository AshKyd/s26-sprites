var Color = require('color');

var Colorizer = function(opts){
    this.opts = opts;
}

function colorEq(a, b) {
    if (typeof a == 'undefined' || typeof b == 'undefined') return false;
    return a.toUpperCase() == b.toUpperCase();
}

function numberBetween(a, b, c) {
    return a < c && b > c;
}

Colorizer.prototype.recolour = function(svg, type, newBase) {

    var makeReplacement = function(haystack, type, before, after) {
        var search = new RegExp(type + ':' + before, 'g');
        return haystack.replace(search, type + ':' + after);
    }

    var baseColor = Color(newBase);
    var fills = {
        fill: [
            baseColor.clone().clone().darken(.2).hexString(),
            baseColor.hexString(),
            baseColor.clone().lighten(.1).hexString(),
            baseColor.clone().lighten(.2).hexString(),
        ],
        stroke: [
            baseColor.clone().darken(.3).hexString(),
            baseColor.clone().darken(.1).hexString(),
            baseColor.clone().lighten(.2).hexString(),
            baseColor.clone().lighten(.3).hexString(),
        ]
    }

    for (var i = 0; i < this.opts.base[type].length; i++) {
        svg = makeReplacement(svg, 'fill', this.opts.base[type][i], fills.fill[i]);
        svg = makeReplacement(svg, 'stop-color', this.opts.base[type][i], fills.fill[i]);
        svg = makeReplacement(svg, 'stroke', this.opts.base[type][i], fills.stroke[i]);
    }

    return svg
}

Colorizer.prototype.recolorEvening = function(str, oldColor, time, opts) {

    if (colorEq(oldColor, neonColors.on)) {
        return oldColor + ';';
    } else if (colorEq(oldColor, this.opts.neonColors.blink)) {
        return time * 10000 % 2 == 0 ? this.opts.neonColors.on + ';' : this.opts.neonColors.off + ';';
    }

    if (colorEq(oldColor, this.opts.windowColors.nightOnly)) {
        if (numberBetween(6, 20, time)) {
            return 'rgba(0,0,0,0);';
        }
        return windowColors.nightLight;

    } else if (colorEq(oldColor, this.opts.windowColors.nightLight) || colorEq(oldColor, this.opts.windowColors.nightRandom)) {
        if (numberBetween(6, 20, time)) {
            return windowColors.day + ';';
        }

        if (typeof opts.alwayslightup != 'undefined' && opts.alwayslightup || colorEq(oldColor, this.opts.windowColors.nightLight)) {
            return this.opts.windowColors.nightLight + ';';
        }

        var lightsChance = Math.abs(time - 12) / 24;
        return Math.random() > lightsChance ? this.opts.windowColors.nightLight + ';' : this.opts.windowColors.nightDark + ';';
    }

    var color = Color(oldColor);
    if (numberBetween(5, 6.1, time) || numberBetween(17, 18.1, time)) {
        color = color
            .darkenByRatio(0.05)
            .blend(Color('#FF8800'), .1);
    } else if (numberBetween(4, 5.1, time) || numberBetween(18, 19.1, time)) {
        color = color
            .darkenByRatio(0.1)
            .blend(Color('#FF4400'), .1);
    } else if (numberBetween(3, 4.1, time) || numberBetween(19, 20.1, time)) {
        color = color
            .darkenByRatio(0.2)
            .desaturateByRatio(.2)
            .blend(Color('#8800FF'), .1);
    } else if (numberBetween(20, 24, time) || numberBetween(-1, 6.1, time)) {
        // From 9 PM until 6 AM
        color = color
            .darkenByRatio(.2)
            .desaturateByRatio(.5)
            .blend(Color('#0000ff'), .2)
    }
    return color.toCSS() + ';';
}

Colorizer.prototype.recolourAll = function(opts, cb) {
    var _this = this;
	var flipped = opts.flip ? 'Alt' : '';
    opts.svg = _this.recolour(opts.svg, 'primary'+flipped, opts.primary);
    opts.svg = _this.recolour(opts.svg, 'secondary'+flipped, opts.secondary);

    // opts.svg = opts.svg.replace(/(#[a-fA-F0-9]{6});/g, function(a, b) {
    //     return _this.recolorEvening(a, b, opts.time, opts);
    // });

    cb(opts.svg);

}

module.exports = Colorizer;
