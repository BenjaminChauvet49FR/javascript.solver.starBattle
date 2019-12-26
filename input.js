/**
 When you click on the canvas
*/
function clickCanvas(event,p_canvas,p_pix,p_global) {
    var rect = p_canvas.getBoundingClientRect();
    var pixMouseXInGrid = event.clientX - p_pix.marginGrid.left - rect.left;
    var pixMouseYInGrid = event.clientY - p_pix.marginGrid.up - rect.top;
	var spaceIndexX = Math.floor(pixMouseXInGrid/p_pix.sideSpace); //index of the space, calculated from the (x,y) position
	var spaceIndexY = Math.floor(pixMouseYInGrid/p_pix.sideSpace); //same
    if ((spaceIndexX >= 0) && (spaceIndexY >= 0) && (spaceIndexY < global.length) && (spaceIndexX < global.length)){
		console.log("Try to put new : "+spaceIndexX+" "+spaceIndexY+" "+STAR);
		tryToPutNew(p_global,spaceIndexX,spaceIndexY,STAR);
	}
}


//TODO : parameters in all functions
/** Loads a walled grid from local storage AND creates a region grid */
loadAction = function(p_canvas,p_pix,p_global,p_name){
	var grid = stringToWallGrid(localStorage.getItem("grid_is_good_"+p_name));
	loadFreshNewGrid(p_canvas,p_pix,p_global,grid);
}

/**
Loads a VALID walled grid (ie that fits the hypotheses) and sets up everything (canvas, region grid, intelligence...) around it.
*hypotheses : the grid should have as many rows as columns as regions
*/
loadFreshNewGrid = function(p_canvas, p_pix, p_global,p_wallGrid){
	p_global.borderGrid = p_wallGrid;
	p_global.length = p_wallGrid[0].length;
	p_global.xLength = p_global.length;
	p_global.yLength = p_global.length;
	adaptCanvas(p_canvas,p_pix,p_global);
	p_global.regionGrid = wallGridToRegionGrid(p_wallGrid);
	
	//Intelligence starts here (the grid is assumed to be square)
	p_global.spacesByRegion = listSpacesByRegion(p_global.regionGrid,p_global.xLength,p_global.yLength);
	p_global.answerGrid = [];
	var ix,iy;

	//Building answer grid
	for(iy = 0; iy < p_global.length ; iy++){
		p_global.answerGrid.push([]);
		for(ix = 0; ix < p_global.length ; ix++){
			p_global.answerGrid[iy].push(UNDECIDED);
		}
	}
	
	p_global.notPlacedYet = {
		regions:buildPossibilitiesStarBattleRegion(global.spacesByRegion,2),
		rows:buildPossibilitiesStarBattle(global.length,2),
		columns:buildPossibilitiesStarBattle(global.length,2)
	}
	
	//Removing banned spaces
	for(iy = 0; iy < p_global.length ; iy++){
		for(ix = 0; ix < p_global.length ; ix++){
			if (p_global.regionGrid[iy][ix] == BANNED){
				putNew(p_global,ix,iy,NO_STAR);
			}
		}
	}
}

