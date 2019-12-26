pix.marginGrid = {left:32,up:32,right:32,down:32};
loadFreshNewGrid(canevas, pix, global, generateGridWall(1,1)); 
//TODO (of course the grid (1,1) is a dummy grid, but at least it has as much rows as columns as regions

//--------------------
//The main draw function (at start)
function drawCanvas(){
	drawGridUltimate(context,pix,colors,global);
	drawAroundIndications(context,pix,colors,global);
	drawInsideIndications(context,pix,colors,global);
	drawSpaces(context,pix,global);
}

//--------------------

setInterval(drawCanvas,30);
var fieldName = document.getElementById("input_grid_name");
document.getElementById("submit_load_grid").addEventListener('click',function(event){loadAction(canevas,pix,global,fieldName.value)});
canevas.addEventListener('click', function(event){clickCanvas(event,canevas,pix,global)},false);