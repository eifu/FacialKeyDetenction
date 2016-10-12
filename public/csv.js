var labels = ["left_eye_center", "right_eye_center", "left_eye_inner_corner", "left_eye_outer_corner", "right_eye_inner_corner", "right_eye_outer_corner", "left_eyebrow_inner_end", "left_eyebrow_outer_end", "right_eyebrow_inner_end", "right_eyebrow_outer_end", "nose_tip", "mouth_left_corner", "mouth_right_corner", "mouth_center_top_lip", "mouth_center_bottom_lip"];

var margin = {top:0, right:0,bottom:20, left:50},
    width = 700,
    height = 300,
    barPadding = 1,
    label_index=0,
    diff = 0;

function change(new_data_index){
  d3.select("svg").remove();


  var svg = d3.select("body")
              .append("svg")
              .attr("width", "100%")
              .attr("height", "100%")
              .attr("viewBox", "0 0 " + width + " " + height);


  var xScale = d3.scale.ordinal()
                  .rangeRoundBands([0, width - margin.right - margin.left], .1);

  var yScale = d3.scale.linear()
                 .range([height - margin.top - margin.bottom, 0]);



  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  label_index = new_data_index;
  d3.csv("equi_width_count_data.csv", function(error, data){

    data = data.map(function(d){ 
      d[labels[label_index]+"_count"] = +d[labels[label_index]+"_count"]; 
      d[labels[label_index]] = +d[labels[label_index]]; 
      return d;
    });

    diff = (data[1][labels[label_index]] - data[0][labels[label_index]]).toFixed(2);

    yScale.domain([0, d3.max(data, function(d){ return d[labels[label_index]+"_count"]; })]);

    xScale.domain(data.map(function(d){ return d[labels[label_index]].toFixed(2); }));

    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom");

    svg.append("g")  // "g" group element
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "bars")
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d){ return xScale(d[labels[label_index]].toFixed(2)); })
    .attr("y", function(d){ return yScale(d[labels[label_index]+"_count"]); })
    .attr("height", function(d){ return height - margin.top - margin.bottom - yScale(d[labels[label_index]+"_count"]); })
    .attr("width", function(d){ return xScale.rangeBand(); })
    .attr("fill", function(d) {
          return "rgb(50, 50, " + parseInt(255-(d[labels[label_index]+"_count"]/600)*256) + ")";
         })
    .on("mouseover", function(d) {

      d3.select(this)
      .transition()
      .duration(100)
      .attr("fill", function(d){
                  return "rgb(50," + parseInt(255-(d[labels[label_index]+"_count"]/(600))*256) + ",50)";
      })
      .attr("x", function(d){ return xScale(d[labels[label_index]].toFixed(2))- xScale.rangeBand()*0.25;})
      .attr("width", function(d){return 1.5*xScale.rangeBand()});

      //Get this bar's x/y values, then augment for the tooltip
      var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
      var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

      //Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px"); 

      d3.select("#value")
        .text(d[labels[label_index]+"_count"]);
          
      d3.select("#label")
        .text(labels[label_index]);

      d3.select("#range")
        .text(d[labels[label_index]].toFixed(2) + "~" + (parseFloat(d[labels[label_index]].toFixed(2)) + parseFloat(diff)).toFixed(2) );

         
      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);

    })
    .on("mouseout", function(){

      d3.select("#tooltip").classed("hidden", true);

      d3.select(this)
        .transition()
        .duration(250)
        .attr("fill", function(d){
          return "rgb(50, 50, " + parseInt(255-(d[labels[label_index]+"_count"]/600)*256) + ")";
        })
        .attr("x", function(d){ return xScale(d[labels[label_index]].toFixed(2))})
        .attr("width", function(d){return xScale.rangeBand()});
    })
    .on("click", function(){
      change((label_index+1)%15);
    });

    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(yAxis);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
    .call(xAxis);
  })  
}

function init(){

  var select = document.getElementById("selectData"); 
  for(var i = 0; i < labels.length; i++) {
    var opt = labels[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = i;
    select.appendChild(el);
  }


  var svg = d3.select("body")
              .append("svg")
              .attr("width", "100%")
              .attr("height", "100%")
              .attr("viewBox", "0 0 " + width + " " + height);


  var xScale = d3.scale.ordinal()
                 .rangeRoundBands([0, width - margin.right - margin.left], .1);

  var yScale = d3.scale.linear()
                 .range([height - margin.top - margin.bottom, 0]);


  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");


  d3.csv("equi_width_count_data.csv", function(error, data){

    data = data.map(function(d){ 
      d[labels[label_index]+"_count"] = +d[labels[label_index]+"_count"]; 
      d[labels[label_index]] = +d[labels[label_index]]; 
      return d;
    });
    diff = (data[1][labels[label_index]] - data[0][labels[label_index]]).toFixed(2);

    yScale.domain([0, d3.max(data, function(d){ return d[labels[label_index]+"_count"];})]);

    xScale.domain(data.map(function(d){ return d[labels[label_index]].toFixed(2); }));


    var rects = svg.append("g")  // "g" group element
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("id", "bars")
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d){ return xScale(d[labels[label_index]].toFixed(2)); })
      .attr("y", function(d){ return yScale(d[labels[label_index]+"_count"]); })
      .attr("height", function(d){ return height - margin.top - margin.bottom - yScale(d[labels[label_index]+"_count"]); })
      .attr("width", function(d){ return xScale.rangeBand(); })
      .attr("fill", function(d) {
          return "rgb(50, 50, " + parseInt(255-(d[labels[label_index]+"_count"]/600)*256) + ")";
         });

    d3.selectAll(".bar")
      .on("mouseover", function(d) {

      d3.select(this)
      .transition()
      .duration(100)
      .attr("fill", function(d){
                  return "rgb(50, " + parseInt(255-(d[labels[label_index]+"_count"]/600)*256) + ",50)";
      })
      .attr("x", function(d){ return xScale(d[labels[label_index]].toFixed(2))- xScale.rangeBand()*0.25;})
      .attr("width", function(d){return 1.5*xScale.rangeBand()});

      //Get this bar's x/y values, then augment for the tooltip
      var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
      var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

      //Update the tooltip position and value
      d3.select("#tooltip")
        .style("left", xPosition + "px")
        .style("top", yPosition + "px"); 

      d3.select("#value")
        .text(d[labels[label_index]+"_count"]);
          
      d3.select("#label")
        .text(labels[label_index]);

      d3.select("#range")
        .text(d[labels[label_index]].toFixed(2) + "~" + (parseFloat(d[labels[label_index]].toFixed(2)) + parseFloat(diff)).toFixed(2));
         
      //Show the tooltip
      d3.select("#tooltip").classed("hidden", false);

    })
    .on("mouseout", function(){

      d3.select("#tooltip").classed("hidden", true);

      d3.select(this)
        .transition()
        .duration(250)
        .attr("fill", function(d){
          return "rgb(50, 50, " + parseInt(255-(d[labels[label_index]+"_count"]/600)*256) + ")";
        })
        .attr("x", function(d){ return xScale(d[labels[label_index]].toFixed(2))})
        .attr("width", function(d){return xScale.rangeBand()});
    })
    .on("click", function(){
      change((label_index+1)%15);
    });

    svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(yAxis);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
    .call(xAxis);
  })          
}