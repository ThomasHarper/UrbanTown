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
            score: {},

            // Sprites
            images : [
                'sprite-dev.png'
            ],

            sprites: [
                {id: 0, images: 0, sx: 0, sy: 0, sw: 100, sh: 100, anim: 0},
                {id: 1, images: 0, sx: 100, sy: 0, sw: 100, sh: 100, anim: 0},
                {id: 2, images: 0, sx: 200, sy: 0, sw: 100, sh: 100, anim: 0},
                {id: 3, images: 0, sx: 300, sy: 0, sw: 100, sh: 100, anim: 0},
                {id: 4, images: 0, sx: 400, sy: 0, sw: 100, sh: 100, anim: 0},
                {id: 5, images: 0, sx: 500, sy: 0, sw: 100, sh: 100, anim: 0},
                {id: 6, images: 0, sx: 600, sy: 0, sw: 100, sh: 100, anim: 0}
            ],

            props: [
                {name: "Tent", score: 0, numSprite: 1, probability: 0.8},
                {name: "Wooden hunt", score: 0, numSprite: 2, probability: 0.15},
                {name: "Small house", score: 0, numSprite: 3, probability: 0.05},
                {name: "House", score: 0, numSprite: 0, probability: 0},
                {name: "Villa", score: 0, numSprite: 0, probability: 0},
                {name: "Palace", score: 0, numSprite: 0, probability: 0},
                {name: "Apartment", score: 0, numSprite: 0, probability: 0},
                {name: "Building", score: 0, numSprite: 0, probability: 0},
                {name: "Golden building", score: 0, numSprite: 0, probability: 0}
            ]
        };

        //-- Object to store game entities --//
        Cases = function (no, x, y, sol, texture) {
            this.no = no;
            this.x = x;
            this.y = y;
            this.sol = sol;
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

                //Canvas basic
                gb.context = gb.$canvas[0].getContext('2d');

                //Resize canvas
                $(window).resize(ut.game.ajust);
                ut.game.ajust();

                //jQuery events
                gb.$canvas.mousemove(ut.game.hover);
                gb.$canvas.click(ut.game.click);
            },

            launch: function () {
                //draw map
                ut.game.drawMap();
                ut.game.proposedObject();

                gb.$canvas.css('display', 'block');
                //Loop
                ut.game.loop();
            },

            drawMap: function () {
                var i = (gb.gridX * gb.gridY), row = 0, col = 0,
                    posX, posY, oneCase, sprite, tent, square;

                for (i; i > 0; i--) {
                    posX = gb.marginLeft + (gb.square * col);
                    posY = gb.marginTop + (gb.square * row);
                    square = (gb.gridX * gb.gridY) - i;

                    //set sol
                    sprite = gb.sprites[0];
                    gb.context.drawImage(gb.images[sprite.images], sprite.sx, sprite.sy,
                        sprite.sw, sprite.sh, posX, posY, gb.square, gb.square);

                    //set case object
                    oneCase = new Cases();
                    oneCase.no = square;
                    oneCase.x = posX;
                    oneCase.y = posY;
                    oneCase.sol = sprite;
                    oneCase.texture = '';

                    //set texture
                    tent = Math.random() > 0.92 ? true : false;
                    if (tent) {
                        sprite = gb.sprites[1];
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
                var i, oneCase, client, sprite, numSprite, image;

                gb.context.clearRect(0, 0, gb.gridX * gb.square, gb.gridY * gb.square);
                //ReDraw grid
                for (i = gb.gridX * gb.gridY; i > 0; i--) {

                    oneCase = gb.cases[i - 1];
                    sprite = gb.cases[i - 1].sol;

                    gb.context.drawImage(gb.images[sprite.images], sprite.sx, sprite.sy,
                        sprite.sw, sprite.sh, oneCase.x, oneCase.y, gb.square, gb.square);

                    sprite = gb.cases[i - 1].texture;
                    if (sprite.sw) {
                        gb.context.drawImage(gb.images[sprite.images], sprite.sx, sprite.sy,
                            sprite.sw, sprite.sh, oneCase.x, oneCase.y, gb.square, gb.square);
                        gb.cases[i - 1].texture = sprite;
                    }
                }

                //if cursor is in map
                client = ut.game.inCanvas(gb.client.x, gb.client.y);
                if (client) {

                    if (!gb.cases[client.square].texture.sw) {

                        numSprite = gb.item.numSprite;
                        sprite = gb.sprites[numSprite];

                        image = gb.images[sprite.images];
                        gb.context.drawImage(image, sprite.sx, sprite.sy,
                            sprite.sw, sprite.sh, gb.cases[client.square].x, gb.cases[client.square].y, gb.square, gb.square);
                    }
                }

                requestAnimationFrame(ut.game.loop);
            },

            proposedObject: function () {
                var proposed, random, item;
                proposed = gb.props.slice(0, 3);
                random = Math.random();
                if (random < 0.8) {
                    item = proposed[0];
                } else if (random > 0.8 && random < 0.95) {
                    item = proposed[1];
                } else if (random > 0.95 && random <= 1) {
                    item = proposed[2];
                }
                gb.item = item;
            },

            drop: function (client) {
                var numSprite, sprite, oneCase, twoPac, elem;

                numSprite = gb.item.numSprite;
                sprite = gb.sprites[numSprite];

                oneCase = gb.cases[client.square];
                if (!oneCase.texture.sw) {
                    gb.cases[client.square].texture = sprite;
                    elem = gb.cases[client.square];
                    ut.game.proposedObject();

                    ut.game.kamehameha(client.square, elem);
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
                if (direction[1] && elem.no !== 47) {//right

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

            hover: function (event) {
                gb.client = {
                    x: event.pageX - gb.bounding.left,
                    y: event.pageY - gb.bounding.top
                };
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

                if (top > 0) { gb.$canvas.css('top', top); }
                if (left > 0) { gb.$canvas.css('left', left); }

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

    }(ut));

    //-- CALL --//
    ut.game.init();

}(jQuery));