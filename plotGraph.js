/*jslint plusplus: true, browser: true, devel: true*/
/*global d3, functionPlot*/
var plotGraph = (function () {
   "use strict";
   var graphLocationSelector,
      currentEquation,
      funPlot;

   function update(aniOptions) {
      var dotLocation = graphLocationSelector + ' .content',
         xScale = funPlot.meta.xScale,
         yScale = funPlot.meta.yScale,
         points = d3.select(dotLocation).selectAll(".point").data(aniOptions.datapoints),
         enterG;

      //take care of the exit
      points.exit().remove();

      //Enter
      enterG = points.enter().append('g')
         .attr('class', 'point');


      //add and set up circle
      enterG.append('circle')
         .attr('r', 4)
         .attr('cx', 0)
         .attr('cy', 0);

      //set up and place label
      enterG.append('text')
         .text("")
         .attr('x', 5)
         .attr('y', 15);

      console.log(points);

      //do this after the enter and for each update
      points.attr('transform', function (d) {
         return 'translate(' + xScale(d.x) + ' ' + yScale(d.y) + ')';
      });

      points.select('text').text(function (d) {
         return '(' + d.x + ', ' + d.y + ')';
      });


   }

   function setup(aniOptions, selector) {

      //sugar
      var optsIn = aniOptions.graphOpt,
         graphOptions = {
            target: selector,
            xAxis: {
               domain: [optsIn.view.x.min, optsIn.view.x.max]
            },
            yAxis: {
               domain: [optsIn.view.y.min, optsIn.view.y.max]
            }
         };

      if (!optsIn.graphHide) {
         graphOptions.data = [{
            fn: optsIn.equation
         }];
      }

      //save some things for later
      graphLocationSelector = selector;
      currentEquation = optsIn.equation;

      //make the plot
      funPlot = functionPlot(graphOptions);

      //call update
      update(aniOptions);

   }

   return {
      update: update,
      setup: setup
   };
}());
