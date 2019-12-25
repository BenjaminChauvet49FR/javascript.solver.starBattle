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
	p_global.xLength = p_wallGrid[0].length;
	p_global.yLength = p_wallGrid.length;
	adaptCanvas(p_canvas,p_pix,p_global);
	p_global.regionGrid = wallGridToRegionGrid(p_wallGrid);
	
	//Intelligence starts here (the grid is assumed to be square)
	p_global.spacesByRegion = listSpacesByRegion(p_global.regionGrid,p_global.xLength,p_global.yLength);
	
	p_global.notPlacedYet = {
		regions:buildPossibilitiesStarBattle(global.xLength,2),
		rows:buildPossibilitiesStarBattle(global.xLength,2),
		columns:buildPossibilitiesStarBattle(global.xLength,2)
	}
}