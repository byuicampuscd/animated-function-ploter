/*jslint plusplus: true, browser: true, devel: true*/
/*global d3, functionPlot*/
var plotGraph = (function () {
   "use strict";
   var graphLocationSelector,
      currentEquation,
      funPlot,
      freeId = 0;

   function updateTextX(d) {
      var zero = (0).toFixed(2);

      return function (t) {
         var location = d.x * t;
         this.textContent = "( " + location.toFixed(2) + ", " + zero + ")";
      };
   }

   function updateTextY(d) {
      var xRounded = d.x.toFixed(2),
         yVal = d.y;

      return function (t) {
         this.textContent = "( " + xRounded + ", " + (yVal * t).toFixed(2) + ")";
      };
   }

   function filterAndUpdateIds(aniOptions) {

      return aniOptions.datapoints.reduce(function (newArray, dataPoint, index) {
         //give it a fresh id if it's the one being animated and it needs to be updated
         if (index === aniOptions.currentRound && dataPoint.updatePoint) {
            dataPoint.id = freeId;
         }
         freeId += 1;
         //keep it if we like it
         if (index <= aniOptions.currentRound || !dataPoint.updatePoint) {
            newArray.push(dataPoint);
         }

         return newArray;
      }, []);
   }

   function update(aniOptions, callback) {
      var dotLocation = graphLocationSelector + ' .content',
         xScale = funPlot.meta.xScale,
         yScale = funPlot.meta.yScale,
         filteredDataPoints = filterAndUpdateIds(aniOptions),

         points = d3.select(dotLocation).selectAll(".point").data(filteredDataPoints, function (d) {
            return d.id;
         }),
         enterG,
         transition;
      console.log(JSON.stringify(filteredDataPoints, null, ' '));

      //take care of the exit
      points.exit().remove();

      //Enter
      enterG = points.enter().append('g')
         .attr('class', 'point')
         .attr('transform', 'translate(' + xScale(0) + ' ' + yScale(0) + ')');


      //add and set up circle
      enterG.append('circle')
         .attr('r', 4)
         .attr('cx', 0)
         .attr('cy', 0);

      //set up and place label
      enterG.append('text')
         .text('(0, 0)')
         .attr('x', 5)
         .attr('y', 15);

      //First transition - move the group in the X
      transition = enterG
         .transition()
         .duration(1500)
         .ease('cubic-out')
         .attr('transform', function (d) {
            return 'translate(' + xScale(d.x) + ' ' + yScale(0) + ')';
         });
      //sub transition - update the label
      transition.select('text').tween('text', updateTextX);

      //Second transition - move the group in the Y
      //sub transition - update the label
      transition.transition()
         .duration(1500)
         .ease('cubic-out')
         .attr('transform',
            function (d) {
               return 'translate(' + xScale(d.x) + ' ' + yScale(d.y) + ')';
            })
         .each('end', function () {
            callback(aniOptions);
         })
         .select('text').tween('text', updateTextY);




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
      //update(aniOptions);

   }

   return {
      update: update,
      setup: setup
   };
}());
