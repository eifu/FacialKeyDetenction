

var labels = ["left_eye_center", "right_eye_center", "left_eye_inner_corner", "left_eye_outer_corner", "right_eye_inner_corner", "right_eye_outer_corner", "left_eyebrow_inner_end", "left_eyebrow_outer_end", "right_eyebrow_inner_end", "right_eyebrow_outer_end", "nose_tip", "mouth_left_corner", "mouth_right_corner", "mouth_center_top_lip", "mouth_center_bottom_lip"];


var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    index1 = 0,
    index2 = 1;

var numbers = new Array(2140);

function draw(index1, index2){
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	d3.csv("clustered_data_with15keypoints_1image.csv", function(error, data){

		data.forEach(function(d){
			d[labels[index1]] = +d[labels[index1]];
			d[labels[index2]] = +d[labels[index2]];
						// console.log(d);

		});

		var xScale = d3.scale.linear()
							.domain([d3.min(data, function(d){return d[labels[index1]]}), 
									 d3.max(data, function(d){return d[labels[index1]]})
									 ])  
							.range([0, width]);

		var xAxis = d3.svg.axis()
						 .scale(xScale)
						 .orient("bottom");


  		var yScale = d3.scale.linear()
  							.domain([d3.min(data, function(d){return d[labels[index2]]}), 
  									 d3.max(data, function(d){return d[labels[index2]]})])
  							.range([height, 0])

  		var yAxis = d3.svg.axis()
  						 .scale(yScale)
  						 .orient("left");

  		// x-axis
 		svg.append("g")
  		    .attr("class", "x axis")
 		     .attr("transform", "translate(0," + height + ")")
 		     .call(xAxis)
 		    .append("text")
		     .attr("class", "label")
   		     .attr("x", width)
   		     .attr("y", -6)
      		 .style("text-anchor", "end")
      		 .text(labels[index1]);

		  // y-axis
  		svg.append("g")
    	    .attr("class", "y axis")
    	    .call(yAxis)
    	   .append("text")
    	    .attr("class", "label")
     	    .attr("transform", "rotate(-90)")
    	    .attr("y", 6)
    	    .attr("dy", ".71em")
    	    .style("text-anchor", "end")
    	    .text(labels[index2]);


		svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 1)
			.attr("cx", function(d){
				return xScale(d[labels[index1]]);
			})
			.attr("cy", function(d){
				return yScale(d[labels[index2]]);
			})
	});
}

function changeX(new_i){
	index1 = new_i;
	console.log(index1);
	change(index1, index2);
}

function changeY(new_i){
	index2 = new_i;
	change(index1, index2);
}

function change(index1, index2){
	d3.select("svg").remove();
	draw(index1, index2);
}


function init(){
  var selectX = document.getElementById("selectX"); 
  var selectY = document.getElementById("selectY");
  for(var i = 0; i < labels.length; i++) {
    var el = document.createElement("option");
    el.textContent =labels[i];
    el.value = i;
    el.id = "option"+i;
    selectX.appendChild(el);
    
    var el = document.createElement("option");
    el.textContent =labels[i];
    el.value = i;
    el.id = "option"+i;
    selectX.appendChild(el);
    selectY.appendChild(el);
  }



	draw(index1, index2);
}