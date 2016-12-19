

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
                x: i % 96,
                y: Math.floor(i / 96),
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
            return xScale(d.x);
        })
        .attr("y", function(d){
            return yScale(d.y);
        })
        .attr("fill", function(d){
            return "rgb("+d.c+","+d.c+","+d.c+")";
        });

    });
}


function facialKeys(index, idName){

    var width = parseInt(d3.select("#g1").style("width"),10),
    height = parseInt(d3.select("#g1").style("height"),10);

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

var h = 20, w = 20;
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
    var v1 = parseInt(d3.select(this).style("x"), 10)/20;
    var v2 = parseInt(d3.select(this).style("y"), 10)/20;
    d3.select("#g1_layer2").html(null);
    d3.select("#g2_layer2").html(null);

    console.log(v1);
    console.log(v2);
    facialKeys(v1, "g1_layer2");
    facialKeys(v2, "g2_layer2");
  });

});
}
