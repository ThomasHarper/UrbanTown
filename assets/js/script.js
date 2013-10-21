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
            }
        };

    }(ut));

    //-- CALL --//
    ut.game.init();

}(jQuery));