

function face(index, idName){

    var width = parseInt(d3.select("#g1").style("width"),10),
    height = parseInt(d3.select("#g1").style("height"),10);

    var xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, 96]);

    var yScale = d3.scaleLinear()
    .range([0, height])
    .domain([0, 96]);


    d3.csv("imageTest.csv", function(error, data){
        if (error) throw error;

        var dx = 96;
        var dy = 96;

        function retrieveData(data) {
            var d = [];
            for (i = 0; i < 96*96; i++) {
                d.push({
                // x: i % 96,
                // y: Math.floor(i / 96),
                i:i,
                c: +data[i]
                });
            }
            return d;
        }


        var ds = retrieveData(data[index]);

        d3.select("#"+idName).selectAll(".pixel")
        .data(ds)
        .enter().append("rect")
        .attr("class", "pixel")
        .attr("width", width/dx)
        .attr("height", height/dy)
        .attr("x", function(d){
            return xScale(d.i % 96);
        })
        .attr("y", function(d){
            return yScale(Math.floor(d.i / 96));
        })
        .attr("fill", function(d){
            return "rgb("+d.c+","+d.c+","+d.c+")";
        });

    });
}
var labels = ["left_eye_center", "right_eye_center", 
          "left_eye_inner_corner", "left_eye_outer_corner", 
          "right_eye_inner_corner", "right_eye_outer_corner", 
          "left_eyebrow_inner_end", "left_eyebrow_outer_end", 
          "right_eyebrow_inner_end", "right_eyebrow_outer_end", 
          "nose_tip", "mouth_left_corner", "mouth_right_corner", 
          "mouth_center_top_lip", "mouth_center_bottom_lip"];


function facialKeys(index, idName){

    var width = parseInt(d3.select("#g1").style("width"),10),
    height = parseInt(d3.select("#g1").style("height"),10);

    d3.select("#text"+idName).append("text")
    .text(labels[index])
    .style("fill", "#ec7014")
    .attr("y", height)
    .attr("alignment", "center")
    .attr("font-family", "Roboto")
    .attr("font-size",18);

    d3.csv("xy_data.csv", function(error, data){
        data.forEach(function(d){
            d[labels[index]+"_x"] = +d[labels[index]+"_x"];
            d[labels[index]+"_y"] = +d[labels[index]+"_y"];
        });

        var xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0, 96]);

        var yScale = d3.scaleLinear()
        .range([0, height])
        .domain([0, 96]);

        var dot = d3.select("#"+idName).selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .attr("cx", function(d){return xScale(d[labels[index]+"_x"])})
        .attr("cy", function(d){return yScale(d[labels[index]+"_y"])})
        .attr("opacity", 0.7)
        .style("fill", "#4292c6");

        d3.select("#"+idName).append("g")
        .call(d3.brush().extent([[0, 0], [width, height]])
            .on("brush", brushed)
            .on("end", brushended));

        function brushed() {
            var s = d3.event.selection,
            x0 = s[0][0],
            y0 = s[0][1],
            dx = s[1][0] - x0,
            dy = s[1][1] - y0;
            
            d3.select("body").selectAll('circle')
            .style("fill", function (d) {
                var xValue = d[labels[index]+"_x"];
                var yValue = d[labels[index]+"_y"];
                if ( xScale(xValue) >= x0 && xScale(xValue) <= x0 + dx &&
                yScale(yValue) >= y0 && yScale(yValue) <= y0 + dy)
                     { return "#ec7014"; }
                else { return "#4292c6"; }
            });
        }  

        function brushended() {
            if (!d3.event.selection) {

                d3.select("body").selectAll('circle')
                .transition()
                .duration(150)
                .ease(d3.easeLinear)
                .style("fill", "#4292c6");
            }
        }

    });
}


function heatmap(idName){

var h = 12, w = 12;
var colorScale = d3.scaleLinear()
.domain([-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1])
.range(["#3182bd", "#6baed6", "#6baed6", "#6baed6","white", "#6baed6","#6baed6", "#fd8d3c","#e6550d" ])
d3.csv("corr.csv", function(error, data){
  var data_foruse=[];
  data.forEach(function(d){
    var x = d[""];
    delete d[""];
    for (p in d){
      data_foruse.push({
        x:x,
        y:p,
        value: +d[p]  
      })
    }
  });

  d3.select("#"+idName).selectAll(".heatmap")
  .data(data_foruse)
  .enter().append("rect")
  .attr("x", function(d){return labels.indexOf(d.x) * w})
  .attr("y", function(d) { return labels.indexOf(d.y) * h; })
  .attr("width", function(d) { return w; })
  .attr("height", function(d) { return h; })
  .style("fill", function(d) { return colorScale(d.value); })
  .on("click", function(d){
    console.log(d3.select(this).style("x"));
    var v1 = parseInt(d3.select(this).style("x"), 10)/w;
    var v2 = parseInt(d3.select(this).style("y"), 10)/h;
    d3.select("#textg1_layer2").html(null);
    d3.select("#textg2_layer2").html(null);
    d3.select("#g1_layer2").html(null);
    d3.select("#g2_layer2").html(null);
    console.log(v1);
    console.log(v2);
    facialKeys(v1, "g1_layer2");
    facialKeys(v2, "g2_layer2");
  });

});
}

function bar(index, idName){
var xScale = d3.scaleBand()
                 .range([0, width]);

var yScale = d3.scaleLinear()
                 .range([height, 0]);

var tooltip = d3.select("#"+idName).append("div")
          .attr("class", "tooltip")
          .attr("id", "tooltip"+idName)
          .style("opacity", 0);

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale);

d3.csv("equi_width_count_data.csv", function(error, data){

    data = data.map(function(d){ 
      d[labels[index]+"_count"] = +d[labels[index]+"_count"]; 
      d[labels[index]] = +d[labels[index]]; 
      return d;
    });
    diff = (data[1][labels[index]] - data[0][labels[index]]).toFixed(2);

    yScale.domain([0, d3.max(data, function(d){ return d[labels[index]+"_count"];})]);

    xScale.domain(data.map(function(d){ return d[labels[index]].toFixed(2); }));


    var rects = d3.select("#"+idName+"_svg").append("g")  // "g" group element
      .attr("transform", "translate(" + 50 + "," +  0 + ")")
      .attr("id", "bars")
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d){ return xScale(d[labels[index]].toFixed(2)); })
      .attr("y", function(d){ return yScale(d[labels[index]+"_count"]); })
      .attr("height", function(d){
        if (height - 20 - yScale(d[labels[index]+"_count"]) < 0){
          return 0;
        }
        return height - 20 - yScale(d[labels[index]+"_count"]); 
      })
      .attr("width", function(d){ return xScale.bandwidth(); })
      .attr("fill", function(d) {
          return "rgb(161,190,230)";
         });

    d3.selectAll(".bar")
    .on("mouseover", function(d) {

      d3.select("#tooltip"+idName).transition()
      .duration(200)
      .style("opacity",.9);
      d3.select("#tooltip"+idName).html('<div id="tooltip">' + 
                     '<p>label: <span id="'+idName+'_label"></span></p>' +
                     '<p><span id="' + idName+'_value"></span> counts</p>' +
                     '<p><span id="'+ idName +'_range"></span></p>' +
                   '</div>')
      .style("left", (d3.event.pageX) + "px")    
      .style("top", (d3.event.pageY - 28) + "px");  


      d3.select(this)
      .transition()
      .duration(100)
      .attr("fill", function(d){return "rgb(50,124,203)";})
      .attr("x", function(d){ return xScale(d[labels[index]].toFixed(2))- xScale.bandwidth()*0.1;})
      .attr("width", function(d){return 1.2*xScale.bandwidth()});

      console.log(parseFloat(d3.select(this).attr("y"))+ "px");

      d3.select("#"+idName+"_value")
        .text(d[labels[index]+"_count"]);
          
      d3.select("#"+idName+"_label")
        .text(labels[index]);

      d3.select("#"+idName+"_range")
        .text(d[labels[index]].toFixed(2) + "~" + (parseFloat(d[labels[index]].toFixed(2)) + parseFloat(diff)).toFixed(2));
         

    })
    .on("mouseout", function(){
      tooltip.style("opacity", 0);
      d3.select(this)
        .transition()
        .duration(250)
        .attr("fill", function(d){return "rgb(161,190,230)";})
        .attr("x", function(d){ return xScale(d[labels[index]].toFixed(2))})
        .attr("width", function(d){return xScale.bandwidth()});
    })

    d3.select("#"+idName+"_svg").append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + 50 + "," + 0 + ")")
    .call(yAxis);

    d3.select("#"+idName+"_svg").append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + 50 + "," + (height - 20) + ")")
    .call(xAxis);
  })


}