

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

        console.log("done");
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
        console.log(data);

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

