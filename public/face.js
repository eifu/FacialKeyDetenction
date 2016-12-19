function face(index, idName){
    var width =  d3.select("#"+idName).style("width"),
    height = d3.select("#"+idName).style("height");

    d3.csv("imageTest.csv", function(error, data){
        if (error) throw error;

        var dx = 96;
        var dy = 96;

        d3.select("#"+idName).append("canvas")
        .attr("width", dx)
        .attr("height", dy)
        .style("width", width)
        .style("height", height)
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