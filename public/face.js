function face(index, idName){
    var width = 500,
    height = 500;

    console.log(document.getElementById(idName));

    d3.csv("imageTest.csv", function(error, data){
        if (error) throw error;

        console.log(data[0]);

        var dx = 96;
        var dy = 96;

        var xScale = d3.scaleLinear()
        .domain([0, 96])
        .range([0,width]);

        var yScale = d3.scaleLinear()
        .domain([0,96])
        .range([0,height]);

        d3.select("#"+idName).append("canvas")
        .attr("width", dx)
        .attr("height", dy)
        .style("width", width+"px")
        .style("height", height + "px")
        .call(drawImage);

        function drawImage(canvas) {
            var context = canvas.node().getContext("2d"),
                imageData = context.createImageData(dx, dy);

            console.log(data[index])
            for (var y = 0; y < dy; y++) {
                for (var x = 0; x < dx; x++) {
                    var c = data[index][y * 96 + x];
                    imageData.data[4*(y * 96 + x)] =c;
                    imageData.data[4*(y * 96 + x) + 1] =c;
                    imageData.data[4*(y * 96 + x) + 2] =c;
                    imageData.data[4*(y * 96 + x) + 3] =255;
                }
            }
            context.putImageData(imageData, 0, 0);
        }
    });
}