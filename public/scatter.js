

var labels = ["left_eye_center", "right_eye_center", "left_eye_inner_corner", "left_eye_outer_corner", "right_eye_inner_corner", "right_eye_outer_corner", "left_eyebrow_inner_end", "left_eyebrow_outer_end", "right_eyebrow_inner_end", "right_eyebrow_outer_end", "nose_tip", "mouth_left_corner", "mouth_right_corner", "mouth_center_top_lip", "mouth_center_bottom_lip"];

var margin = {top:0, right:0,bottom:20, left:50},
    width = 700,
    height = 300,
    barPadding = 1,
    label_index=0,
    diff = 0;



function init(){
	var dataset = [[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],[410, 12], [475, 44], [25, 67], [85, 21], [220, 88]];
	
	//Create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);
	console.log("hi")
	var numbers = [];
	d3.csv("clustered_data_with15keypoints_1image.csv", function(error, data){

		for (moc_label = 0; moc_label < 15; moc_label++){
			var temp = [];
			for (i = 0; i < 2140; i++){
				var temp = [];
				console.log(data[i][moc_label]);
				temp.push(data[i][moc_label]);
			}		
			numbers.push(temp);
			console.log(temp);
		}

	});

	console.log(numbers);

	svg.selectAll("circle")
	   .data(dataset)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
	   		return d[0];
		   })
	   .attr("cy", function(d) {
	   		return d[1];
		   })
	   .attr("r", 5);
}