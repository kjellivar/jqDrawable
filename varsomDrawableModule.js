/**
 * Created by storskel on 20.12.13.
 */
(function ($) {
    "use strict";
    $.fn.varsomDrawableModule = function (options) {

        var settings = $.extend({
            // These are the defaults.
            colors: ["#00ff00", "#ff0000", "#fff000"],
            lineWidth: 5,
            canvasWidth: '600',
            canvasHeight: '400'
        }, options);

        return this.each(function () {
            var mainDiv = $(this),
                colorButtonsHtml = '',
                taskButtonsHtml = '',
                solutionButtonHtml = '<button class="varsomDrawableButton solution">Show solution</button>',
                clearButtonHtml = '<button class="varsomDrawableButton clear">Clear</button>',
                i = 0,
                canvas = $('<canvas/>', {
                    style: 'position: relative; display: block; border: 1px solid #ccc;',
                    text: 'Your browser can not show this example.'
                })
                    .attr("width", settings.canvasWidth)
                    .attr("height", settings.canvasHeight),
                context = canvas[0].getContext('2d'),
                selectedTask = 1,
                showingSolution = false;

            var history = {
                redo_list: [],
                undo_list: [],
                saveState: function (canvas, list, keep_redo) {
                    keep_redo = keep_redo || false;
                    if (!keep_redo) {
                        this.redo_list = [];
                    }

                    (list || this.undo_list).push(canvas.toDataURL());
                },
                undo: function (canvas, ctx) {
                    this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
                },
                redo: function (canvas, ctx) {
                    this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
                },
                restoreState: function (canvas, ctx,  pop, push) {
                    if (pop.length) {
                        this.saveState(canvas, push, true);
                        var restore_state = pop.pop();
                        var img = document.createElement('img');
                        img.src = restore_state;
                        img.onload = function () {
                            ctx.clearRect(0, 0, settings.canvasWidth, settings.canvasHeight);
                            ctx.drawImage(img, 0, 0, settings.canvasWidth, settings.canvasHeight, 0, 0, settings.canvasWidth, settings.canvasHeight);
                        };
                    }
                }
            };

            function changeCanvasColor(color) {
                canvas.drawable({
                    color: color,
                    lineWidth: settings.lineWidth
                });
            }

            function clearCanvas() {
                context.drawImage(mainDiv.find('.task:nth-child(' + selectedTask + ') img')[0], 0, 0);
                showingSolution = false;
            }

            for (i = 0; i < settings.colors.length; i = i + 1) {
                colorButtonsHtml += '<button class="varsomDrawableButton color" data-color="' + settings.colors[i] + '">Farge' + i + '</button>';
            }

            mainDiv.find('div.task').each(function (index) {
                taskButtonsHtml += '<button class="varsomDrawableButton task" data-task="' + (index + 1) + '">' + (index + 1)  + '</button>';
            });

            // Register Button actions
            mainDiv.on('click', '.varsomDrawableButton.color', function () {
                changeCanvasColor($(this).data("color"));
            });
            mainDiv.on('click', '.varsomDrawableButton.clear', function () {
                clearCanvas();
            });
            mainDiv.on('click', '.varsomDrawableButton.solution', function () {
                if (showingSolution === false) {
                    history.saveState(canvas[0]);
                    context.globalAlpha = 0.3;
                    context.drawImage(mainDiv.find('.task:nth-child(' + selectedTask + ') img')[1], 0, 0);
                    context.globalAlpha = 1;
                    showingSolution = true;
                } else {
                    history.undo(canvas[0], context);
                    showingSolution = false;
                }
            });
            mainDiv.on('click', '.varsomDrawableButton.task', function () {
                selectedTask = $(this).data("task");
                clearCanvas();
            });

            //Initialize canvas
            canvas.drawable({
                color: settings.colors[0],
                lineWidth: settings.lineWidth
            });

            //Hide task images
            mainDiv.find(".task img").hide();
            clearCanvas();

            mainDiv.append(colorButtonsHtml + clearButtonHtml + solutionButtonHtml + taskButtonsHtml);
            mainDiv.append(canvas);
        });
    };
}(jQuery));

