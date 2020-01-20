var drawer = new Drawer();
drawer.setMarginGrid(32,32,32,32);
var global = new GlobalStarBattle(generateWallGrid(1,1),1);
//TODO (of course the grid (1,1) is a dummy grid, but at least it has as much rows as columns as regions
var canevasInteraction = document.getElementById("canevas");
var	context = canevasInteraction.getContext("2d");
//var canevasListActions = document.getElementById("canevas_list_actions"); TODO
var actionToDo;

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
	drawer.drawGrid(context,global);
	drawAroundIndications(context,drawer,colors,global);
	drawInsideIndications(context,drawer,colors,global);
	drawSpaces(context,drawer,colors,global);
}

//--------------------

setInterval(drawCanvas,30);
var fieldName = document.getElementById("input_grid_name");
var starSpan = document.getElementById("span_stars");
var textArea = document.getElementById("textarea_happened");

document.getElementById("submit_load_grid").addEventListener('click',
	function(event){loadAction(canevas,drawer,textArea,global,fieldName.value,starSpan)}
);
canevas.addEventListener('click', function(event){clickCanvas(event,canevas,drawer,textArea,global,actionToDo)},false);
document.getElementById("submit_undo").addEventListener('click',function(event){undoAction(global,textArea)});
document.getElementById("submit_multiPass").addEventListener('click',function(event){multiPassAction(global,textArea)});

//Submits of click on a grid : what will happen ? (TODO : the word action is pretty generic)
var submitPutStar = document.getElementById("submit_put_star");
var submitPutX = document.getElementById("submit_put_X");
var submitPassRegion = document.getElementById("submit_pass_region");
var submitPassRow = document.getElementById("submit_pass_row");
var submitPassColumn = document.getElementById("submit_pass_column");

var textAction = document.getElementById("text_canvas_action");
textAction.innerHTML = ACTION_PUT_STAR.caption;
actionToDo = ACTION_PUT_STAR.id;
addEventListenerAndCaptionActionSubmit(submitPutStar,ACTION_PUT_STAR);
addEventListenerAndCaptionActionSubmit(submitPutX,ACTION_PUT_NO_STAR);
addEventListenerAndCaptionActionSubmit(submitPassRegion,ACTION_PASS_REGION);
addEventListenerAndCaptionActionSubmit(submitPassRow,ACTION_PASS_ROW);
addEventListenerAndCaptionActionSubmit(submitPassColumn,ACTION_PASS_COLUMN);

//TODO the word "action" is pretty generic

/**
Adds the event listener of an action submit by linking it to an action for the canvas (warning : changes a text element
*/
function addEventListenerAndCaptionActionSubmit(p_submitElement,p_action){
	p_submitElement.value = p_action.caption;
	p_submitElement.addEventListener('click',function(event){
		textAction.innerHTML = p_action.caption;
		actionToDo = p_action.id;
	});
}


//----------------
//Debug room. 
//TODO create a separate file ?

function debugTryToPutNew(p_string){
	//console.log(p_string)
}
function debugPass(p_string){
	console.log(p_string);
}
function debugHumanMisclick(p_string){
	console.log("Human misclick ? "+p_string);
}
function alertPass(p_string){
	alert(p_string);
}