(function ($) {

    //Javascript Ninja
    "use strict";

    //-- NAMESPACE --//
    var ut = {};

    (function (ut) {

        //-- Object to store "global" var --//
        var gb;

        gb = {
            //jQuery elem
            $canvas: '',

            //canvas var
            context: '',
            cases: []
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