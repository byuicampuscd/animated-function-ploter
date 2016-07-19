/*jslint plusplus: true, browser: true, devel: true, evil:true*/
/*global d3, functionPlot*/
var addPoint = (function () {
   "use strict";

   return function (xIn, funPlot) {

      function getY(x) {
         return functionPlot.eval.builtIn(funPlot.options.data[0], 'fn', {
            x: x
         });
      }

      function updateTextX() {
         var zero = (0).toFixed(2);
         console.log("this outter:", this);
         return function (t) {
            var location = xIn * t;
            this.textContent = "( " + location.toFixed(2) + ", " + zero + ")";
         };
      }

      function updateTextY() {
         var xRounded = xIn.toFixed(2),
            yVal = getY(xIn);

         return function (t) {
            this.textContent = "( " + xRounded + ", " + (yVal * t).toFixed(2) + ")";
         };
      }

      var svgSelector = funPlot.options.target + ' .content',
         xScale = funPlot.meta.xScale,
         yScale = funPlot.meta.yScale,
         group = d3.select(svgSelector).append('g'),
         cir = group.append('circle'),
         label = group.append('text').text(""),
         transition;

      //center group
      group.attr('transform', "translate(" + xScale(0) + " " + yScale(0) + ")");

      //move label
      label.attr('x', 5)
         .attr('y', 15);
      //add raduis
      cir.attr('r', 4)
         .attr('class', 'point');

      //First transition - move the group in the X
      transition = group.transition().duration(2000).ease('cubic-out').attr('transform', 'translate(' + xScale(xIn) + ' ' + yScale(0) + ')');
      //sub transition - update the label
      transition.select('text').tween('text', updateTextX);

      //Second transition - move the group in the Y
      //sub transition - update the label
      transition.transition().attr('transform', 'translate(' + xScale(xIn) + ' ' + yScale(getY(xIn)) + ')')
         .select('text').tween('text', updateTextY);

   };
}());
