/** Loads a walled grid from local storage AND creates a region grid */
loadAction = function(p_canvas,p_pix,p_global,p_name){
	var grid = stringToWallGrid(localStorage.getItem("grid_is_good_"+p_name));
	p_global.borderGrid = grid;
	p_global.xLength = grid[0].length;
	p_global.yLength = grid.length;
	adaptCanvas(p_canvas,p_pix,p_global);
	p_global.regionGrid = wallGridToRegionGrid(grid);
	
	//Intelligence starts here (the grid is assumed to be square)
	p_global.spacesByRegion = listSpacesByRegion(p_global.regionGrid,p_global.xLength,p_global.yLength);
	
	p_global.notPlacedYet = {
		regions:buildPossibilitiesStarBattle(global.xLength,2),
		rows:buildPossibilitiesStarBattle(global.xLength,2),
		columns:buildPossibilitiesStarBattle(global.xLength,2)
	}

	
}