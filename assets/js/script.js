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

            //canvas var
            context: '',
            bounding: {},
            cases: [],
            client: {},

            // Sprites
            images : [
                'sprite-dev.png'
            ],
            sprites: [
                {images: 0, x: 0, y: 0, h: 100, w: 100},
                {images: 0, x: 100, y: 0, h: 100, w: 100},
                {images: 0, x: 200, y: 0, h: 100, w: 100}
            ],

            props: [
                {name: "Tent", score: 0, numSprite: 0, probability: 0.8},
                {name: "Wooden hunt", score: 0, numSprite: 0, probability: 0.15},
                {name: "Small house", score: 0, numSprite: 0, probability: 0.05},
                {name: "House", score: 0, numSprite: 0, probability: 0},
                {name: "Villa", score: 0, numSprite: 0, probability: 0},
                {name: "Palace", score: 0, numSprite: 0, probability: 0.},
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

                //Canvas basic
                gb.context = gb.$canvas[0].getContext('2d');

                //Store canvas bounding
                gb.bounding = gb.$canvas[0].getBoundingClientRect();

                //draw map
                ut.game.drawMap();

                //Mouse event
                gb.$canvas.mousemove(ut.game.hover);
                gb.$canvas.click(ut.game.click);

                //Loop
                ut.game.loop();

                console.log(gb.cases);
            },

            drawMap: function () {
                var i = (gb.gridX * gb.gridY), row = 0,
                    col = 0, posX, posY, oneCase, color;

                for (i; i > 0; i--) {
                    posX = gb.marginLeft + (gb.square * col);
                    posY = gb.marginTop + (gb.square * row);

                    //@TODO: real grid skin
                    //random color
                    color  = '#' + Math.floor(Math.random() * 16777215).toString(16);

                    gb.context.fillStyle = color;
                    gb.context.fillRect(posX, posY, gb.square, gb.square);

                    //set case object
                    oneCase = new Cases();
                    oneCase.no = (gb.gridX * gb.gridY) - i;
                    oneCase.x = posX;
                    oneCase.y = posY;
                    oneCase.sol = color;
                    oneCase.texture = 'skin';

                    gb.cases[(gb.gridX * gb.gridY) - i] = oneCase;

                    col++;
                    if (col > (gb.gridX - 1)) {
                        col = 0;
                        row++;
                    }
                }
            },

            //Core function
            loop: function () {
                var col, row, i, client;

                //ReDraw grid
                for (i = gb.gridX * gb.gridY; i > 0; i--) {
                    //@TODO: Real grid draw
                    gb.context.fillStyle = gb.cases[i - 1].sol;
                    gb.context.fillRect(gb.cases[i - 1].x, gb.cases[i - 1].y, gb.square, gb.square);
                }

                //if cursor is in map
                client = ut.game.inCanvas(gb.client.x, gb.client.y);
                if (client) {
                    //@TODO: real hover
                    /* actual square = gb.cases[(col + (row - 1)  * 7) - 1] */
                    //rgba onHover
                    gb.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    gb.context.fillRect(gb.cases[client.square].x, gb.cases[client.square].y, gb.square, gb.square);
                }

                requestAnimationFrame(ut.game.loop);
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
                    //@TODO: click action
                    console.log(client);
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
                }
            },

            proposedObject: function () {
                var proposed,random;
                proposed = gb.props.slice(0,3);
                
                random = Math.random();                
                switch (random) {
                    case random < 0.8:
                        return proposed[0];
                    break;
                    case random > 0.8 && random < 0.95:
                        return proposed[1];
                    break;
                    case random > 0.95 && random <= 1:
                        return proposed[2];
                    break;
                    default:
                        return proposed[0];
                    break;
                }                
            }
        };

    }(ut));

    //-- CALL --//
    ut.game.init();

}(jQuery));

//@TODO: code pattern ut/game ?
