var pix = new Pix();
pix.setMarginGrid(32,32,32,32);
var global = new GlobalStarBattle(generateWallGrid(1,1),1);
//TODO (of course the grid (1,1) is a dummy grid, but at least it has as much rows as columns as regions
var canevasInteraction = document.getElementById("canevas");
var	context = canevasInteraction.getContext("2d");
//var canevasListActions = document.getElementById("canevas_list_actions"); TODO


var colors={
	closed_wall:'#222222',
	open_wall:'#dddddd',
	edge_walls:'#000000',
	bannedSpace:'#666666',
	//star:'#ffe101', TODO
	cross:'#000000',
	starIndication:"#00cccc",
	crossIndication:"#cc0000",
	regionIndication:"#008800",
	rainbowSpaces:[]
}

//--------------------
//The main draw function (at start)
function drawCanvas(){
	drawGridUltimate(context,pix,colors,global);
	drawAroundIndications(context,pix,colors,global);
	drawInsideIndications(context,pix,colors,global);
	drawSpaces(context,pix,colors,global);
}

//--------------------

setInterval(drawCanvas,30);
var fieldName = document.getElementById("input_grid_name");
var fieldStars = document.getElementById("input_number_stars");
var submitSymbolType = document.getElementById("submit_change_sign");
var textArea = document.getElementById("textarea_happened");
submitSymbolType.addEventListener('click', function(event){submitSymbolAction(submitSymbolType)});
document.getElementById("submit_load_grid").addEventListener('click',
	function(event){loadAction(canevas,pix,textArea,global,fieldName.value,fieldStars.value)}
);
canevas.addEventListener('click', function(event){clickCanvas(event,canevas,pix,textArea,global,submitSymbolType.value)},false);
document.getElementById("submit_undo").addEventListener('click',function(event){undoAction(global,textArea)});
