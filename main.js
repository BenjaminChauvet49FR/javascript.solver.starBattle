//--------------------
//Everything that suits the initialization of a grid
//TODO merge this initialization with the one in "input". It should be possible, right ?
var xyLength = 8; //TODO dieu que c'est moche
global.borderGrid = generateGridWall(xyLength, xyLength); //TODO we assume it's a square space
global.xLength = xyLength;
global.yLength = xyLength;
pix.marginGrid = {left:32,up:32,right:32,down:32};
global.notPlacedYet = {
	regions:buildPossibilitiesStarBattle(global.xLength,2),
	rows:buildPossibilitiesStarBattle(global.xLength,2),
	columns:buildPossibilitiesStarBattle(global.xLength,2)
}
global.regionGrid = wallGridToRegionGrid(global.borderGrid);
global.spacesByRegion = listSpacesByRegion(global.regionGrid,global.xLength,global.yLength);
adaptCanvas(canevas,pix,global);

//--------------------
//The main draw function (at start)
function drawCanvas(){
	drawGridUltimate(context,pix,colors,global);
	drawAroundIndications(context,pix,colors,global);
	drawInsideIndications(context,pix,colors,global);
}

//--------------------
console.log(global.spacesByRegion);
console.log(global.spacesByRegion[0][0]);

setInterval(drawCanvas,30);
var fieldName = document.getElementById("input_grid_name");
document.getElementById("submit_load_grid").addEventListener('click',function(event){loadAction(canevas,pix,global,fieldName.value)});
