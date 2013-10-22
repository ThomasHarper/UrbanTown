(function ($) {

    //Javascript Ninja
    "use strict";

    //-- NAMESPACE --//
    var ut = {};

    (function (ut) {

        //-- Object to store "global" var --//
        var gb, Cases, Client;

        gb = {
            //jQuery elem
            $canvas: '',

            //Game
            gridX: 7,
            gridY: 7,
            square: 100,
            marginTop: 20,
            marginLeft: 20,
            imgPath: './assets/images/',
            load: 0,

            //canvas var
            context: '',
            bounding: {},
            cases: [],
            client: {},
            item: {},

            // Sprites
            images : [
                'sprite-dev.png'
            ],
            sprites: [
                {images: 0, sx: 0, sy: 0, sw: 100, sh: 100},
                {images: 0, sx: 100, sy: 0, sw: 100, sh: 100},
                {images: 0, sx: 200, sy: 0, sw: 100, sh: 100}
            ],

            props: [
                {name: "Tent", score: 0, numSprite: 1, probability: 0.8},
                {name: "Wooden hunt", score: 0, numSprite: 2, probability: 0.15},
                {name: "Small house", score: 0, numSprite: 0, probability: 0.05},
                {name: "House", score: 0, numSprite: 0, probability: 0},
                {name: "Villa", score: 0, numSprite: 0, probability: 0},
                {name: "Palace", score: 0, numSprite: 0, probability: 0},
                {name: "Apartment", score: 0, numSprite: 0, probability: 0},
                {name: "Building", score: 0, numSprite: 0, probability: 0},
                {name: "Golden building", score: 0, numSprite: 0, probability: 0}
            ],

            //FPS
            timeInterval: 0,
            lastTime: 0,
            frame: 0,
            avgFps: 0
        };

        //-- Object to store game entities --//
        Cases = function (no, x, y, sol, texture) {
            this.no = no;
            this.x = x;
            this.y = y;
            this.sol = sol;
            this.texture = texture;
        };
        Client = function (x, y) {
            this.x = x;
            this.y = y;
        };

        //-- Game loop function --//
        ut.game = {

            init: function () {

                //Load component
                ut.game.loadImages();

                //Set jQuery globals
                gb.$canvas = $('canvas:first');
                gb.$fps = $('#fps').find('span');

                //Canvas basic
                gb.context = gb.$canvas[0].getContext('2d');

                //Store canvas bounding
                gb.bounding = gb.$canvas[0].getBoundingClientRect();

                //jQuery events
                gb.$canvas.mousemove(ut.game.hover);
                gb.$canvas.click(ut.game.click);
                $(document).on('image-loaded', ut.game.preload);
            },

            launch: function () {
                //draw map
                ut.game.drawMap();
                ut.game.proposedObject();

                gb.$canvas.show();
                //Loop
                ut.game.loop();

                console.log(gb.cases);
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

                    numSprite = gb.item.numSprite;
                    sprite = gb.sprites[numSprite];

                    image = gb.images[sprite.images];
                    gb.context.drawImage(image, sprite.sx, sprite.sy,
                        sprite.sw, sprite.sh, gb.cases[client.square].x, gb.cases[client.square].y, gb.square, gb.square);
                }

                //FPS
                gb.$fps.html(ut.fps.get());

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

            drop: function (obj) {
                var oneCase;

                oneCase = gb.cases[client.square];
                numSprite = gb.item.numSprite;
                sprite = gb.sprites[numSprite];
                image = gb.images[sprite.images]; 

                gb.cases[client.square].texture = image;
                console.log(gb.cases[client.square].texture);

            },

            hover: function (event) {
                var client = new Client();

                client.x = event.pageX - gb.bounding.left;
                client.y = event.pageY - gb.bounding.top;

                gb.client = client;
            },

            click: function (event) {
                var posX, posY, col, row, client, squareNo;

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

            loadImages: function () {
                var length, img;

                length = gb.images.length;

                for (length; length > 0; length--) {
                    img = new Image();
                    img.src = gb.imgPath + gb.images[length - 1];
                    gb.images[length - 1] = img;
                    img.onload = function () {
                        $(document).trigger('image-loaded');
                    };
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

        ut.fps = {
            get: function () {
                gb.frame++;
                var date = new Date(),
                    thisTime = date.getTime();

                gb.timeInterval = 1000 / (thisTime - gb.lastTime);
                gb.lastTime = thisTime;

                if (gb.frame % 10 == 0) {
                    gb.avgFps = Math.round(gb.timeInterval * 10) / 10;
                }

                return gb.avgFps.toFixed(0);
            }
        };
    }(ut));

    //-- CALL --//
    ut.game.init();

}(jQuery));
//@TODO: code pattern ut/game ?
