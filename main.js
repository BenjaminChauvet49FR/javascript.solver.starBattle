var pix = new Pix();
pix.setMarginGrid(32,32,32,32);
var global = new GlobalStarBattle(generateWallGrid(1,1),1);
//TODO (of course the grid (1,1) is a dummy grid, but at least it has as much rows as columns as regions
var canevas = document.getElementById("canevas");
var	context = canevas.getContext("2d");


var colors={
	closed_wall:'#222222',
	open_wall:'#dddddd',
	edge_walls:'#000000',
	bannedSpace:'#666666',
	rainbowSpaces:[]
}

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