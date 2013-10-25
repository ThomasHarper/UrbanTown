(function ($) {

    //Javascript Ninja
    "use strict";

    //-- NAMESPACE --//
    var ut = {};

    (function (ut) {

        //-- Object to store "global" var --//
        var gb, Cases, Player, Game;

        gb = {
            //jQuery elem
            $canvas: '',
            $body: '',

            //Game
            gridX: 7,
            gridY: 7,
            square: 100,
            marginTop: 0,
            marginLeft: 0,
            imgPath: './assets/images/',
            load: 0,

            //canvas var
            context: '',
            bounding: {},
            cases: [],
            client: {},
            item: {},
            player: {},
            score: 0,

            // Sprites
            images : [
                'sprite-dev.png',
                'sol.png'
            ],

            sprites: {
                0: {id: 0, images: 0, sx: 0, sy: 0, sw: 100, sh: 100, anim: 0},
                1: {id: 1, images: 0, sx: 100, sy: 0, sw: 100, sh: 100, anim: 0},
                2: {id: 2, images: 0, sx: 200, sy: 0, sw: 100, sh: 100, anim: 0},
                3: {id: 3, images: 0, sx: 300, sy: 0, sw: 100, sh: 100, anim: 0},
                4: {id: 4, images: 0, sx: 400, sy: 0, sw: 100, sh: 100, anim: 0},
                5: {id: 5, images: 0, sx: 500, sy: 0, sw: 100, sh: 100, anim: 0},
                6: {id: 6, images: 0, sx: 600, sy: 0, sw: 100, sh: 100, anim: 0},
                '0b': {id: 100, images: 0, sx: 0, sy: 100, sw: 100, sh: 100, anim: 0},
                '1b': {id: 101, images: 0, sx: 100, sy: 100, sw: 100, sh: 100, anim: 0},
                '2b': {id: 102, images: 0, sx: 200, sy: 100, sw: 100, sh: 100, anim: 0}
            },

            props: [
                {name: "Tent", score: 5, numSprite: 0, probability: 0.8},
                {name: "Wooden hunt", score: 20, numSprite: 1, probability: 0.15},
                {name: "Small house", score: 100, numSprite: 2, probability: 0.05},
                {name: "House", score: 500, numSprite: 3, probability: 0},
                {name: "Villa", score: 1500, numSprite: 4, probability: 0},
                {name: "Palace", score: 5000, numSprite: 5, probability: 0},
                {name: "Apartment", score: 20000, numSprite: 6, probability: 0},
                {name: "Building", score: 100000, numSprite: 7, probability: 0},
                {name: "Golden building", score: 500000, numSprite: 8, probability: 0}
            ]
        };

        //-- Object to store game entities --//
        Cases = function (no, x, y, sol, texture) {
            this.no = no;
            this.x = x;
            this.y = y;
            this.texture = texture;
        };
        Player = function (name) {
            this.name = name;
        };
        Game = function (score) {
            this.score = score;
        };

        //-- Game loop function --//
        ut.game = {

            init: function () {

                //Load component
                ut.game.loadImages();

                //Set jQuery globals
                gb.$canvas = $('canvas:first');
                gb.$body = $('body');

                //Canvas basic
                gb.context = gb.$canvas[0].getContext('2d');

                //Resize canvas
                $(window).resize(ut.game.ajust);
                ut.game.ajust();

                //jQuery events
                gb.$canvas.mousemove(ut.game.hover);
                gb.$canvas.click(ut.game.click);
                $('.info-score').html(0);                
                
            },

            launch: function () {
                //anim init
                gb.client.anim = 0;
                gb.client.way = 1;

                //draw map
                ut.game.drawMap();
                ut.game.proposedObject();

                //Score and Level
                ut.game.getScore();                            


                gb.$canvas.show();
                $('.save-game').click(function (){
                    ut.request.save(gb.cases, gb.score, 0);
                });  

                gb.$canvas.css('display', 'block');
                //Loop
                ut.game.loop();
            },

            drawMap: function () {
                var i = (gb.gridX * gb.gridY), row = 0, col = 0,
                    posX, posY, oneCase, sprite, tent, square;

                //set sol
                gb.context.drawImage(gb.images[1], 0, 0, 700, 700, 0, 0, 700, 700);

                for (i; i > 0; i--) {
                    posX = gb.marginLeft + (gb.square * col);
                    posY = gb.marginTop + (gb.square * row);
                    square = (gb.gridX * gb.gridY) - i;

                    //set case object
                    oneCase = new Cases();
                    oneCase.no = square;
                    oneCase.x = posX;
                    oneCase.y = posY;
                    oneCase.texture = '';

                    //set texture
                    tent = Math.random() > 0.92 ? true : false;
                    if (tent) {
                        sprite = gb.sprites[0];
                        gb.context.drawImage(gb.images[sprite.images], sprite.sx, sprite.sy,
                            sprite.sw, sprite.sh, posX, posY, gb.square, gb.square);
                        oneCase.texture = sprite;
                    }

                    //stock case
                    gb.cases[square] = oneCase;

                    col++;
                    if (col > (gb.gridX - 1)) {
                        col = 0;
                        row++;
                    }
                }
            },

            //Core function
            loop: function () {
                var i, oneCase, client, sprite, numSprite, image, anim, way, center, filledCases = 0;

                gb.context.clearRect(0, 0, gb.gridX * gb.square, gb.gridY * gb.square);
                //set sol
                gb.context.drawImage(gb.images[1], 0, 0, 700, 700, 0, 0, 700, 700);

                //ReDraw texture
                for (i = gb.gridX * gb.gridY; i > 0; i--) {

                    oneCase = gb.cases[i - 1];
                    sprite = gb.cases[i - 1].texture;

                    if (sprite.sw) {
                        gb.context.drawImage(gb.images[sprite.images], sprite.sx, sprite.sy,
                            sprite.sw, sprite.sh, oneCase.x, oneCase.y, gb.square, gb.square);
                        gb.cases[i - 1].texture = sprite;
                        filledCases++;
                    }                    
                }

                //if cursor is in map
                client = ut.game.inCanvas(gb.client.x, gb.client.y);
                if (client) {

                    if (!gb.cases[client.square].texture.sw) {

                        numSprite = gb.item.numSprite;
                        sprite = gb.sprites[numSprite + 'b'];
                        way = gb.client.anim > 1 || gb.client.anim < 0.9 ? gb.client.way * -1 : gb.client.way;
                        anim = gb.client.anim > 1 || gb.client.anim < 0.9 ? way < 0 ? 0.9 : 1 : gb.client.anim;

                        gb.client.anim = anim  - (way * 0.002);
                        gb.client.way = way;
                        image = gb.images[sprite.images];
                        center = (gb.square - (gb.square * anim)) / 2;

                        gb.context.drawImage(image, sprite.sx, sprite.sy, sprite.sw, sprite.sh,
                            gb.cases[client.square].x + center, gb.cases[client.square].y + center, gb.square * anim, gb.square * anim);
                    }
                }
                if (filledCases === gb.gridX * gb.gridY) {
                    $.ajax
                    if (confirm('Game Over ! Would you like to start a new one ?')) {
                        ut.request.save(gb.cases, gb.score, 1);
                        //@TODO , NEW LOAD NEEDED

                    } else {
                        ut.request.save(gb.cases, gb.score, 1);
                    }
                } else {
                    requestAnimationFrame(ut.game.loop);
                }
                
            },

            proposedObject: function () {
                var proposed, random, item;
                proposed = gb.props.slice(0, 3);
                random = Math.random();
                if (random < 0.95) {
                    item = proposed[0];
                } else if (random > 0.95 && random < 0.98) {
                    item = proposed[1];
                } else if (random > 0.98 && random <= 1) {
                    item = proposed[2];
                }
                gb.item = item;
            },

            drop: function (client) {
                var numSprite, sprite, oneCase, elem;

                numSprite = gb.item.numSprite;
                sprite = gb.sprites[numSprite];

                oneCase = gb.cases[client.square];
                if (!oneCase.texture.sw) {
                    gb.cases[client.square].texture = sprite;
                    elem = gb.cases[client.square];
                    ut.game.proposedObject();

                    ut.game.kamehameha(client.square, elem);
                    ut.game.getScore();
                    ut.game.getLevel();
                    
                }
            },

            //THE EPICEST FUNCTIONS EVER
            kamehameha: function (squareNo, elem) {
                var elems, length;

                //on recupere les 4 elements autour de la case clique
                elems = ut.game.findNext(elem, [true, true, true, true], 0);

                length = elems.length;

                if (length >= 2) {
                    for (length; length > 0; length--) {
                        //si on a + 2 elem autour on erase
                        gb.cases[elems[length - 1]].texture = '';
                    }
                    //on draw une nouvelle texture sur la case
                    gb.cases[squareNo].texture = gb.sprites[gb.cases[squareNo].texture.id + 1];
                    //MAGIC !
                    ut.game.kamehameha(squareNo, gb.cases[squareNo]);
                }
            },

            findNext: function (elem, direction, level) {
                var c1, c2, c3, c4, handle = [];

                if (direction[0]) {//top

                    c1 = gb.cases[elem.no - gb.gridX];
                    if (direction[0] && c1 && c1.texture.id === elem.texture.id) {
                        switch (level) {
                        case 0:
                            handle.push(c1.no);
                            handle = handle.concat(ut.game.findNext(c1, [true, true, false, true], 1));
                            break;
                        case 1:
                            handle.push(c1.no);
                            break;
                        }
                    }
                }
                if (direction[1] && elem.no !== 48) {//right

                    c2 = gb.cases[elem.no + 1];
                    if (c2 && c2.no % gb.gridX !== 0 && direction[1]
                            && c2.texture.id === elem.texture.id) {
                        switch (level) {
                        case 0:
                            handle.push(c2.no);
                            handle = handle.concat(ut.game.findNext(c2, [true, true, true, false], 1));
                            break;
                        case 1:
                            handle.push(c2.no);
                            break;
                        }
                    }
                }
                if (direction[2]) {//bottom

                    c3 = gb.cases[elem.no + gb.gridX];
                    if (direction[2] && c3 && c3.texture.id === elem.texture.id) {
                        switch (level) {
                        case 0:
                            handle.push(c3.no);
                            handle = handle.concat(ut.game.findNext(c3, [false, true, true, true], 1));
                            break;
                        case 1:
                            handle.push(c3.no);
                            break;
                        }
                    }
                }
                if (direction[3] && elem.no !== 0) {//left

                    c4 = gb.cases[elem.no - 1];
                    if (c4 && (c4.no + 1) % gb.gridX !== 0 && direction[3]
                            && c4.texture.id === elem.texture.id) {
                        switch (level) {
                        case 0:
                            handle.push(c4.no);
                            handle = handle.concat(ut.game.findNext(c4, [true, false, true, true], 1));
                            break;
                        case 1:
                            handle.push(c4.no);
                            break;
                        }
                    }
                }

                return handle;
            },

            getScore: function () {
                var state, spriteId = [], scoreTab = [], provisoryScore = 0,i;
                state = gb.cases;
                i = state.length - 1;
                for (i; i >= 0; i--) {
                    if (state[i].texture.sw) {                        
                        spriteId.push(state[i].texture.id);                
                    };
                };

                i = spriteId.length - 1;
                if (spriteId.length != 0) {
                    for (i; i >= 0; i--) {
                        scoreTab.push(gb.props[spriteId[i]].score);
                    };
                };
                
                i = scoreTab.length - 1;
                if(scoreTab.length !=  0) {
                    for (i; i >= 0; i--) {
                        provisoryScore += scoreTab[i]; 
                    };
                }
                gb.score = provisoryScore;
                $('.info-score').html(gb.score);
            },

            getLevel: function () {
                var levels = ["Camper", "Inhabitant", "Mayor", "President", "God"];

                if (gb.score >= 0 && gb.score <= 500) {
                    $('.inprogress').css('width', '20' + '%');
                    $('.level').html(levels[0]);                
                }
                else if (gb.score > 500 && gb.score <= 1500) {
                    $('.inprogress').css('width', '40' + '%');
                    $('.level').html(levels[1]);                    
                }
                else if (gb.score > 1500 && gb.score <= 3000) {
                    $('.inprogress').css('width', '60' + '%');
                    $('.level').html(levels[2]);                
                }
                else if (gb.score > 3000 && gb.score < 30000) {
                    $('.inprogress').css('width', '80' + '%');
                    $('.level').html(levels[3]);                    
                }
                else if (gb.score >= 30000) {
                    $('.inprogress').css('width', '100' + '%');
                    $('.level').html(levels[4]);                    
                }
            },


            hover: function (event) {
                gb.client.x = event.pageX - gb.bounding.left;
                gb.client.y = event.pageY - gb.bounding.top;
            },

            click: function (event) {
                var posX, posY, client;

                posX = event.pageX - gb.bounding.left;
                posY = event.pageY - gb.bounding.top;

                client = ut.game.inCanvas(posX, posY);

                if (client) {
                    ut.game.drop(client);
                }
            },

            inCanvas: function (x, y) {
                var col, row, square, toReturn;

                toReturn = false;
                gb.$canvas.css('cursor', 'default');

                if ((x > gb.marginLeft && x < (gb.square * gb.gridX + gb.marginLeft))
                        && (y > gb.marginTop && y < (gb.square * gb.gridY + gb.marginTop))) {

                    col = Math.ceil((x - gb.marginLeft) / gb.square);
                    row = Math.ceil((y - gb.marginTop) / gb.square);
                    square = col + (row - 1)  * 7 - 1;

                    toReturn = {col: col, row: row, square: square};
                    gb.$canvas.css('cursor', 'pointer');
                }

                return toReturn;
            },

            ajust: function () {
                var top, left;

                top = Math.floor((window.innerHeight - gb.gridY * gb.square) / 2);
                left = Math.floor((window.innerWidth - (gb.gridX * gb.square + 260)) / 2);

                if (top > 0) { gb.$canvas.css('top', top + 'px'); }
                if (left > 0) { gb.$canvas.css('left', left + 'px'); }

                if (top < 0) { top = 0; }
                if (left < 0) { left = 0; }
                gb.$body.css('background-position', (left - 150) + 'px ' + (top - 150) + 'px ');


                //Store canvas bounding
                gb.bounding = {
                    top: top,
                    left: left
                };
            },

            loadImages: function () {
                var length, img;

                length = gb.images.length;

                for (length; length > 0; length--) {
                    img = new Image();
                    img.src = gb.imgPath + gb.images[length - 1];
                    gb.images[length - 1] = img;
                    img.onload = ut.game.preload;
                }
            },

            preload: function () {
                var length;

                gb.load++;
                length = gb.images.length;

                if (gb.load === length) {
                    ut.game.launch();
                }
            }
        };


        ut.request = {
            save: function (data, score, over) {                
                $.ajax({
                    url: 'index.php?action=save',
                    type: "POST",
                    data: {data: JSON.stringify(data), score: score, over: over},
                    dataType: 'json',
                    success: function () {
                        alert('Partie sauvegardee');
                    }
                });
            }
        };

        ut.fps = {
            get: function () {
                gb.frame++;
                var date = new Date(),
                    thisTime = date.getTime();

                gb.timeInterval = 1000 / (thisTime - gb.lastTime);
                gb.lastTime = thisTime;
                if (gb.frame % 10 === 0) {
                    gb.avgFps = Math.round(gb.timeInterval * 10) / 10;
                }
            }

        };

    }(ut));

    //-- CALL --//
    ut.game.init();

}(jQuery));