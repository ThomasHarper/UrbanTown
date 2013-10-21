(function ($) {

    //Javascript Ninja
    "use strict";

    //-- NAMESPACE --//
    var ut = {};

    (function (ut) {

        //-- Object to store "global" var --//
        var gb, Cases;

        gb = {
            //jQuery elem
            $canvas: '',

            //canvas var
            context: '',
            cases: []
        };
        Cases = function (no, x, y, sol, skin) {
            this.no = no;
            this.x = x;
            this.y = y;
            this.sol = sol;
            this.skin = skin;
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
            },

            drawMap: function () {
                var i = 42, row = 0, col = 0, oneCase;

                for (i; i > 0; i--) {
                    gb.context.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    gb.context.fillRect(20 + (100 * col), 20 + (100 * row), 100, 100);

                    oneCase = new Cases();
                    oneCase.no = 43 - i;
                    oneCase.x = 20 + (100 * col);
                    oneCase.y = 20 + (100 * row);
                    oneCase.sol = 'sol';
                    oneCase.skin = 'skin';

                    gb.cases[43 - i] = oneCase;

                    col++;
                    if (col > 5) {
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