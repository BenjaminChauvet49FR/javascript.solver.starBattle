/**
 When you click on the canvas
*/
function clickCanvas(event,p_canvas,p_pix,p_global) {
    var rect = p_canvas.getBoundingClientRect();
    var pixMouseXInGrid = event.clientX - p_pix.marginGrid.left - rect.left;
    var pixMouseYInGrid = event.clientY - p_pix.marginGrid.up - rect.top;
	var spaceIndexX = Math.floor(pixMouseXInGrid/p_pix.sideSpace); //index of the space, calculated from the (x,y) position
	var spaceIndexY = Math.floor(pixMouseYInGrid/p_pix.sideSpace); //same - TODO maybe this should go to the Pix item ?
    if ((spaceIndexX >= 0) && (spaceIndexY >= 0) && (spaceIndexY < global.length) && (spaceIndexX < global.length)){
		console.log("Try to put new : "+spaceIndexX+" "+spaceIndexY+" "+STAR);
		p_global.tryToPutNew(spaceIndexX,spaceIndexY,STAR);
	}
}


//TODO : parameters in all functions
/** 
Loads a walled grid from local storage AND creates a region grid 
*/
loadAction = function(p_canvas,p_pix,p_global,p_name,p_starNumber){
	var grid = stringToWallGrid(localStorage.getItem("grid_is_good_"+p_name));
	p_global.loadGrid(grid);
	// fin de l'améliorable du TODO
	p_global.loadAnswerGrid(2);
	adaptCanvas(p_canvas,p_pix,p_global);
}

//TODO : copié-collé d'une version de grid_is_good, je suis sûr que c'est améliorable
function adaptCanvas(p_canvas, p_pix,p_global){
	p_canvas.width = p_global.xLength*p_pix.sideSpace+p_pix.marginGrid.left+p_pix.marginGrid.right;
	p_canvas.height = p_global.yLength*p_pix.sideSpace+p_pix.marginGrid.up+p_pix.marginGrid.down;
}