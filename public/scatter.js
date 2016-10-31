

var labels = ["left_eye_center", "right_eye_center", "left_eye_inner_corner", "left_eye_outer_corner", "right_eye_inner_corner", "right_eye_outer_corner", "left_eyebrow_inner_end", "left_eyebrow_outer_end", "right_eyebrow_inner_end", "right_eyebrow_outer_end", "nose_tip", "mouth_left_corner", "mouth_right_corner", "mouth_center_top_lip", "mouth_center_bottom_lip"];

var margin = {top:0, right:0,bottom:20, left:50},
    width = 1000,
    height =1000,
    label_index1=0,
    label_index2=1,
    diff = 0;

var numbers = new Array(2140);

function draw(index1, index2){
	

	// svg.selectAll("circle")
	//    .data(numbers)
	//    .enter()
	//    .append("circle")
	//    .attr("cx", function(d) {
	//    		console.log(d);
	//    		return d[0];
	// 	   })
	//    .attr("cy", function(d) {
	//    		return d[1];
	// 	   })
	//    .attr("r", 5);

}


function init(){
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	// setup x 
	var xValue = function(d) { return d[labels[label_index1]];}, // data -> value
    	xScale = d3.scale.linear().range([0, width]), // value -> display
    	xMap = function(d) { return xScale(xValue(d));}, // data -> display
    	xAxis = d3.svg.axis().scale(xScale).orient("bottom");

	// setup y
	var yValue = function(d) { return d[labels[label_index2]];}, // data -> value
    	yScale = d3.scale.linear().range([height, 0]), // value -> display
    	yMap = function(d) { return yScale(yValue(d));}, // data -> display
    	yAxis = d3.svg.axis().scale(yScale).orient("left");


	d3.csv("clustered_data_with15keypoints_1image.csv", function(error, data){

		data.forEach(function(d){
			d[labels[label_index1]] = +d[labels[label_index1]];
			d[labels[label_index2]] = +d[labels[label_index2]];
						// console.log(d);

		});

		svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("class", "dot")
			.attr("r", 3)
			.attr("cx", function(d){
				return d[labels[label_index1]]/10;
			})
			.attr("cy", function(d){
				return d[labels[label_index2]]/10;
			})


	});

	draw(label_index1, label_index2)
}