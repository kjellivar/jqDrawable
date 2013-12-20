/**
 * Created by storskel on 20.12.13.
 */
(function ($) {
    "use strict";
    $.fn.varsomDrawableModule = function (options) {

        var settings = $.extend({
            // These are the defaults.
            colors: ["#00ff00", "#ff0000"],
            lineWidth: 2
        }, options);

        return this.each(function () {

            $(this).find("canvas").drawable({
                color: settings.colors[0],
                lineWidth: settings.lineWidth
            });

        });
    };
}(jQuery));

