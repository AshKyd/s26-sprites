var s26 = require('../');

var standardRenditions = {
    blue: {
        colorize: {
            primary: '#90d5f5',
            secondary: '#d9d9d8',
        }
    },
    violet: {
        colorize: {
            primary: '#dab1f4',
            secondary: '#aaaaaa',
        }
    },
    mustard: {
        colorize: {
            primary: '#F4E3B1',
            secondary: '#907448',
        }
    },
    brown: {
        colorize: {
            primary: '#d0bfb8',
            secondary: '#907448',
        }
    },
    whitegreen: {
        colorize: {
            primary: '#f0f0f0',
            secondary: '#47904e',
        }
    },
    whitepink: {
        colorize: {
            primary: '#f0f0f0',
            secondary: '#d93fd4',
        }
    },
    salmonize: {
        colorize: {
            primary: '#ebd5b8',
            secondary: '#ee9ac0',
        }
    },
    yellowblue: {
        colorize: {
            primary: '#e9dbaf',
            secondary: '#009bdc',
        }
    },
    yellowblack: {
        colorize: {
            primary: '#fdead1',
            secondary: '#3E3C43',
        }
    },
};


window.sprites = new s26();
sprites.loadImage({
    url: '/sample/1x1-house-4.svg'
}, function(sprite){
    console.log('loaded', sprite);
});


sprites.loadSprite({
    url: '/sample/1x1-house-4.svg',
    sprite: {
      "props": {
        "name": "A house",
        "namespace": "buildings.houses",
        "isTile": "on"
      },
      "renditions": standardRenditions
    }
}, function(a){
    console.log('House sprite loaded');
});


sprites.loadSpriteSheet('/sample/accessories.poolside.json', function(){
    console.log('spritesheet loaded.', sprites.sprites);
    for(var i in sprites.sprites){
        var renditions = sprites.sprites[i].renditions;
        for(var j in renditions){
            document.body.appendChild(renditions[j].img);
        }

    }
})
