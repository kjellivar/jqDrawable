(function ($) {
    "use strict";
    $.fn.drawable = function (options) {

        var settings = $.extend({
            // These are the defaults.
            color: "#000000",
            lineWidth: 2
        }, options);

        return this.each(function () {
            var cb_ctx = null,
                cb_lastPoints = [],
                cb_canvas = this;

            // Draw a line on the canvas from (s)tart to (e)nd
            function drawLine(sX, sY, eX, eY) {
                cb_ctx.moveTo(sX, sY);
                cb_ctx.lineTo(eX, eY);
                return { x: eX, y: eY };
            }

            // Get the coordinates for a mouse or touch event
            function getCoords(e) {
                var returnValue;
                if (e.offsetX) {
                    returnValue = { x: e.offsetX, y: e.offsetY };
                } else if (e.layerX) {
                    returnValue = { x: e.layerX, y: e.layerY };
                } else {
                    returnValue = { x: e.pageX - cb_canvas.offsetLeft, y: e.pageY - cb_canvas.offsetTop };
                }
                return returnValue;
            }

            function drawMouse(e) {
                var i, p;
                if (e.touches) {
                    // Touch Enabled
                    for (i = 1; i <= e.touches.length; i += 1) {
                        p = getCoords(e.touches[i - 1]); // Get info for finger i
                        cb_lastPoints[i] = drawLine(cb_lastPoints[i].x, cb_lastPoints[i].y, p.x, p.y);
                    }
                } else {
                    // Not touch enabled
                    p = getCoords(e);
                    cb_lastPoints[0] = drawLine(cb_lastPoints[0].x, cb_lastPoints[0].y, p.x, p.y);
                }
                cb_ctx.stroke();
                cb_ctx.closePath();
                cb_ctx.beginPath();

                return false;
            }

            function startDraw(e) {
                var i;
                if (e.touches) {
                    // Touch event
                    for (i = 1; i <= e.touches.length; i += 1) {
                        cb_lastPoints[i] = getCoords(e.touches[i - 1]); // Get info for finger #1
                    }
                } else {
                    // Mouse event
                    cb_lastPoints[0] = getCoords(e);
                    cb_canvas.onmousemove = drawMouse;
                }

                return false;
            }

            // Called whenever cursor position changes after drawing has started
            function stopDraw(e) {
                e.preventDefault();
                cb_canvas.onmousemove = null;
            }

            function init() {

                if (cb_canvas.getContext) {
                    cb_ctx = cb_canvas.getContext('2d');
                    cb_ctx.lineWidth = settings.lineWidth;
                    cb_ctx.strokeStyle = settings.color;
                    cb_ctx.beginPath();

                    cb_canvas.onmousedown = startDraw;
                    cb_canvas.onmouseup = stopDraw;
                    cb_canvas.ontouchstart = startDraw;
                    cb_canvas.ontouchstop = stopDraw;
                    cb_canvas.ontouchmove = drawMouse;
                }
            }
            init();
        });
    };
}(jQuery));

