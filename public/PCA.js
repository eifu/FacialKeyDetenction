var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var numbers = new Array(2140);

function init(){
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	d3.csv("PCA.csv", function(error, data){

		data.forEach(function(d){
			d["left_eye_center"] = +d["left_eye_center"];
			d["left_eye_outer_corner"] = +d["left_eye_outer_corner"];
		})

    console.log(data);

		var xScale = d3.scale.linear()
							.domain([d3.min(data, function(d){return d["left_eye_center"]}), 
									 d3.max(data, function(d){return d["left_eye_center"]})
									 ])  
							.range([0, width]);

  		var yScale = d3.scale.linear()
  							.domain([d3.min(data, function(d){return d["left_eye_outer_corner"]}), 
  									 d3.max(data, function(d){return d["left_eye_outer_corner"]})])
  							.range([height, 0])

    var xAxis = d3.svg.axis()
             .scale(xScale)
             .orient("bottom");

    var yAxis = d3.svg.axis()
               .scale(yScale)
               .orient("left");

      // x-axis
    svg.append("g")
          .attr("class", "x axis")
         .attr("transform", "translate(0," + height/2 + ")")
         .call(xAxis)
        .append("text")
         .attr("class", "label")
           .attr("x", width)
           .attr("y", -6)
           .style("text-anchor", "end")
           .text("left eye center");

      // y-axis
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+width/2+",0)")
          .call(yAxis)
         .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("left eye outer corner");

		svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 1)
			.attr("cx", function(d){
				return xScale(d["left_eye_center"]);
			})
			.attr("cy", function(d){
				return yScale(d["left_eye_outer_corner"]);
			})
	});
}
