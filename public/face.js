

function face(index, idName){

    var width = 500,
    height = 500;

    var svg = d3.select("#g1").append("svg")
    .attr("id", "g1_svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

    var xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, 96]);

    var yScale = d3.scaleLinear()
    .range([0, height])
    .domain([0, 96]);


    var width =  d3.select("#"+idName).style("width"),
    height = d3.select("#"+idName).style("height");

    d3.csv("imageTest.csv", function(error, data){
        if (error) throw error;

        var dx = 96;
        var dy = 96;

        function randomData(data) {
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


        var ds = randomData(data[index]);

        console.log(ds);


        svg.selectAll(".dot")
        .data(ds)
        .enter().append("rect")
        .attr("class", "dot")
        .attr("width", 5)
        .attr("height", 5)
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