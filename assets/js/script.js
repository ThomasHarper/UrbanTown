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

            //canvas var
            context: '',
            bounding: {},
            cases: [],
            client: {}
        };

        //-- Object to store game entities --//
        Cases = function (no, x, y, sol, skin) {
            this.no = no;
            this.x = x;
            this.y = y;
            this.sol = sol;
            this.skin = skin;
        };
        Client = function (x, y) {
            this.x = x;
            this.y = y;
        };

        //-- Game loop function --//
        ut.game = {

            init: function () {

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

                    //random color
                    color  = '#' + Math.floor(Math.random() * 16777215).toString(16);

                    gb.context.fillStyle = color;
                    gb.context.fillRect(posX, posY, gb.square, gb.square);

                    //set case object
                    oneCase = new Cases();
                    oneCase.no = (gb.gridX * (gb.gridY - 1)) - i;
                    oneCase.x = posX;
                    oneCase.y = posY;
                    oneCase.sol = color;
                    oneCase.skin = 'skin';

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
                var col, row, i;

                //ReDraw grid
                for (i = gb.gridX * gb.gridY; i > 0; i--) {
                    gb.context.fillStyle = gb.cases[i - 1].sol;
                    gb.context.fillRect(gb.cases[i - 1].x, gb.cases[i - 1].y, gb.square, gb.square);
                }

                //if cursor is in map
                client = ut.game.inCanvas(gb.client.x, gb.client.y);
                if (client) {
                    /* actual square = gb.cases[(col + (row - 1)  * 7) - 1] */
                    //rgba onHover
                    gb.context.fillStyle = 'rgba(255, 255, 255, 0.5)';
                    gb.context.fillRect(gb.cases[client.square].x, gb.cases[client.square].y, gb.square, gb.square);
                }

                requestAnimationFrame(ut.game.loop);
            },

            hover: function (evt) {
                var client = new Client();

                client.x = evt.pageX - gb.bounding.left;
                client.y = evt.pageY - gb.bounding.top;

                gb.client = client;
            },

            click: function () {
                //user click handle
            }
        };

    }(ut));

    //-- CALL --//
    ut.game.init();

}(jQuery));