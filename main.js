//The main draw function (at start)
function drawCanvas(){
	drawGridUltimate(context,pix,colors,global);
}

pix.marginGrid = {left:32,up:32,right:32,down:32};
adaptCanvas(canevas,pix,global);
setInterval(drawCanvas,30);

var fieldName = document.getElementById("input_grid_name");
document.getElementById("submit_load_grid").addEventListener('click',function(event){loadAction(canevas,pix,global,fieldName.value)});
