/**
 When you click on the canvas
*/
function clickCanvas(event,p_canvas,p_pix,p_textArea,p_global,p_symbol) {
    var rect = p_canvas.getBoundingClientRect();
    var pixMouseXInGrid = event.clientX - p_pix.marginGrid.left - rect.left;
    var pixMouseYInGrid = event.clientY - p_pix.marginGrid.up - rect.top;
	var spaceIndexX = Math.floor(pixMouseXInGrid/p_pix.sideSpace); //index of the space, calculated from the (x,y) position
	var spaceIndexY = Math.floor(pixMouseYInGrid/p_pix.sideSpace); //same - TODO maybe this should go to the Pix item ?
    if ((spaceIndexX >= 0) && (spaceIndexY >= 0) && (spaceIndexY < global.xyLength) && (spaceIndexX < global.xyLength)){
		console.log("Try to put new : "+spaceIndexX+" "+spaceIndexY+" "+p_symbol);
		p_global.tryToPutNew(spaceIndexX,spaceIndexY,p_symbol);
		p_textArea.innerHTML = p_global.happenedEventsToString(false); //TODO manage true/false
	}
}

//--------------------------

/** 
Loads a walled grid from local storage and its region grid (cf. super-function), updates intelligence, updates canvas
TODO doc
*/
loadAction = function(p_canvas,p_pix,p_textArea,p_global,p_name,p_starNumber){
	var grid = stringToWallGrid(localStorage.getItem("grid_is_good_"+p_name));
	p_global.loadGrid(grid);
	p_global.loadIntelligence(p_starNumber);
	adaptCanvas(p_canvas,p_pix,p_global);
	p_textArea.innerHTML = ""; //TODO manage true/false
}

submitSymbolAction = function(p_documentElement){
	if (p_documentElement.value != STAR){
		p_documentElement.value = STAR; return;
	}
	p_documentElement.value = NO_STAR; 
}

undoAction = function(p_global,p_textArea){
	p_global.massUndo();
	p_textArea.innerHTML = p_global.happenedEventsToString(false); //TODO manage true/false
}

//TODO : passer le travail à pix
function adaptCanvas(p_canvas, p_pix,p_global){
	p_canvas.width = p_global.xyLength*p_pix.sideSpace+p_pix.marginGrid.left+p_pix.marginGrid.right;
	p_canvas.height = p_global.xyLength*p_pix.sideSpace+p_pix.marginGrid.up+p_pix.marginGrid.down;
}