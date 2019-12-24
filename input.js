/** Loads a walled grid from local storage AND creates a region grid */
loadAction = function(p_canvas,p_pix,p_global,p_name){
	var grid = stringToWallGrid(localStorage.getItem("grid_is_good_"+p_name));
	p_global.borderGrid = grid;
	p_global.xLength = grid[0].length;
	p_global.yLength = grid.length;
	adaptCanvas(p_canvas,p_pix,p_global);
	p_global.regionGrid = wallGridToRegionGrid(grid);
	listSpacesPerRegion(p_global.regionGrid,p_global.xLength,p_global.yLength);
}