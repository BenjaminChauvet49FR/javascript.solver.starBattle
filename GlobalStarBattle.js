//TODO rassembler les termes de l'objet parce que ça devient important.

function GlobalStarBattle(p_wallGrid,p_starNumber){
	Global.call(this,1,1);
	this.loadGrid(p_wallGrid);
	this.loadAnswerGrid(p_starNumber);
}

GlobalStarBattle.prototype = new Global(1,1);
GlobalStarBattle.prototype.constructor = GlobalStarBattle;
// Credits : https://www.tutorialsteacher.com/javascript/inheritance-in-javascript

//TODO Mettre en avant le fait que cette fonction est méga importante.
GlobalStarBattle.prototype.loadAnswerGrid = function(p_starNumber){
	this.length = this.wallGrid.length;
	this.listSpacesByRegion(); //spacesByRegion
	this.buildPossibilities(p_starNumber); //notPlacedYet
	this.buildAnswerGrid(); //answerGrid
	this.purifyAnswerGrid(); 
	this.happenedEvents = [];
}

/**
Starts the answerGrid
*/
GlobalStarBattle.prototype.buildAnswerGrid = function(){
	this.answerGrid = [];
	for(iy = 0; iy < this.length ; iy++){
		this.answerGrid.push([]);
		for(ix = 0; ix < this.length ; ix++){
			this.answerGrid[iy].push(UNDECIDED);
		}
	}
}

/**
Puts Xs into the answerGrid corresponding to banned spaces 
Precondition : both spacesByRegion and notPlacedYet have been refreshed and answerGrid is ok.
*/
GlobalStarBattle.prototype.purifyAnswerGrid = function(){
	//Removing banned spaces (hence the necessity to have things already updated)
	for(iy = 0; iy < this.length ; iy++){
		for(ix = 0; ix < this.length ; ix++){
			if (this.regionGrid[iy][ix] == BANNED){
				this.putNew(ix,iy,NO_STAR);
			}
		}
	}
}

/**
Sets the list of spaces for each row and column (might be exportated)
Hyphothesis : all non-banned regions are numbered from 0 to n-1 ; banned spaces have lower-than-0 numbers
Exit : all spaces within a region are in reading order (top to bottom, then left to right)
*/
GlobalStarBattle.prototype.listSpacesByRegion = function(){
	var ix,iy;
	var lastRegionNumber = 0;
	for(iy = 0;iy < this.length;iy++){
		for(ix = 0;ix < this.length;ix++){
			lastRegionNumber = Math.max(this.regionGrid[iy][ix],lastRegionNumber);
		}
	}
	
	this.spacesByRegion = [];
	for(var i=0;i<=lastRegionNumber;i++){
		this.spacesByRegion.push([]);
	}
	for(iy = 0;iy < this.length;iy++){
		for(ix = 0;ix < this.length;ix++){
			if(this.regionGrid[iy][ix] >= 0){
				this.spacesByRegion[this.regionGrid[iy][ix]].push({x:ix,y:iy});
			}
		}
	}
}

/**
Puts the number of remaining Stars (Os) and non-stars (Xs) in each region, row and column, assuming we start from scratch.
Precondition : this.spacesByRegion must be refreshed, since it will be needed for region.
*/
GlobalStarBattle.prototype.buildPossibilities = function(p_numberStarsPer){
	this.notPlacedYet = {regions:[],rows:[],columns:[]};
	const complement = this.length - p_numberStarsPer;
	for(var i=0;i<this.length;i++){
		this.notPlacedYet.rows.push({Os:p_numberStarsPer,Xs:complement});
		this.notPlacedYet.columns.push({Os:p_numberStarsPer,Xs:complement});
	}
	for(var i=0;i<this.spacesByRegion.length;i++){
		this.notPlacedYet.regions.push({Os:p_numberStarsPer,Xs:this.spacesByRegion[i].length-p_numberStarsPer});
	}
}

//----------------------

GlobalStarBattle.prototype.getAnswer = function(p_x,p_y){
	return this.answerGrid[p_y][p_x];
}

GlobalStarBattle.prototype.getOsRemainRow = function(p_i){return this.notPlacedYet.rows[p_i].Os;}
GlobalStarBattle.prototype.getOsRemainColumn = function(p_i){return this.notPlacedYet.columns[p_i].Os;}
GlobalStarBattle.prototype.getOsRemainRegion = function(p_i){return this.notPlacedYet.regions[p_i].Os;}
GlobalStarBattle.prototype.getXsRemainRow = function(p_i){return this.notPlacedYet.rows[p_i].Xs;}
GlobalStarBattle.prototype.getXsRemainColumn = function(p_i){return this.notPlacedYet.columns[p_i].Xs;}
GlobalStarBattle.prototype.getXsRemainRegion = function(p_i){return this.notPlacedYet.regions[p_i].Xs;}

GlobalStarBattle.prototype.getFirstSpaceRegion = function(p_i){return this.spacesByRegion[p_i][0];}

//----------------------

/**Tries to put a symbol into the space of a grid. 3 possibilities :
OK : it was indeed put into the grid ; the number of Os and Xs for this region, row and column are also updated.
HARMLESS : said symbol was either already put into that space OUT out of bounds beacuse of automatic operation. Don't change anything to the grid and remaining symbols
ERROR : there is a different symbol in that space. We have done a wrong hypothesis somewhere ! (or the grid was wrong at the basis !)
This is also used at grid start in order to put Xs in banned spaces, hence the check in the NO_STAR part.
*/
GlobalStarBattle.prototype.putNew = function(p_x,p_y,p_symbol){
	if ((p_x < 0) || (p_x >= this.length) || (p_y < 0) || (p_y >= this.length) || 
	(this.answerGrid[p_y][p_x] == p_symbol)){
		return HARMLESS;
	}
	if (this.answerGrid[p_y][p_x] == UNDECIDED){
		this.answerGrid[p_y][p_x] = p_symbol;
		var indexRegion = this.getRegion(p_x,p_y);
		if (p_symbol == STAR){
			this.notPlacedYet.regions[indexRegion].Os--;
			this.notPlacedYet.rows[p_y].Os--;
			this.notPlacedYet.columns[p_x].Os--;
		}
		if (p_symbol == NO_STAR){
			if (indexRegion >= 0){
				this.notPlacedYet.regions[indexRegion].Xs--;				
			}
			this.notPlacedYet.rows[p_y].Xs--;
			this.notPlacedYet.columns[p_x].Xs--;	
		}
		return OK;
	}
	if (this.answerGrid[p_y][p_x] != p_symbol){
		console.log("NOOOO !");
		return ERROR;
	}


}

/**
Well, we did something wrong so... let's remove it, right ?
*/
GlobalStarBattle.prototype.remove = function(p_x,p_y){
	var indexRegion = this.regionGrid[p_y][p_x];
	var symbol = this.answerGrid[p_y][p_x];
	this.answerGrid[p_y][p_x] = UNDECIDED;
	if (symbol == STAR){
		this.notPlacedYet.regions[indexRegion].Os++;
		this.notPlacedYet.rows[p_y].Os++;
		this.notPlacedYet.columns[p_x].Os++;
	}
	if (symbol == NO_STAR){
		this.notPlacedYet.regions[indexRegion].Xs++;
		this.notPlacedYet.rows[p_y].Xs++;
		this.notPlacedYet.columns[p_x].Xs++;	
	}

}

/**

*/
GlobalStarBattle.prototype.tryToPutNew = function(p_x,p_y,p_symbol){
	var eventsToAdd = [{x:p_x,y:p_y,symbol:p_symbol}];
	var eventsAdded = [];
	var ok = true;
	var putNewResult;
	var nextEvent;
	var x,y,r,symbol,xi,yi,ri;
	while ((eventsToAdd.length > 0) && ok){ 
		nextEvent = eventsToAdd.pop();
		x = nextEvent.x;
		y = nextEvent.y;
		symbol = nextEvent.symbol;
		console.log("Now let's try to add : "+eventToString(nextEvent));
		putNewResult = this.putNew(x, y,symbol);
		ok = (putNewResult != ERROR)
		if (putNewResult == OK){
			//(y,x) might be out of bounds, if so the putNewResult isn't supposed to be OK. Hence the check only here.
			r = this.getRegion(x,y); 
			if (symbol == STAR){
				//Add to all 7 neighbors (no one should be star if solved correctly)
				for(i=0;i<=7;i++){
					eventsToAdd.push({x:x+ROUND_X_COORDINATES[i],y:y+ROUND_Y_COORDINATES[i],symbol:NO_STAR});
				}
				//Final alert on column : fill the missing spaces in the column 
				if (this.notPlacedYet.columns[x].Os == 0){
					for(yi=0;yi<this.length;yi++){
						//there may be stars already, hence the (if UNDECIDED) guard
						if (this.answerGrid[yi][x] == UNDECIDED){
							eventsToAdd.push({x:x,y:yi,symbol:NO_STAR});
							console.log("Event pushed : "+eventToString({x:x,y:yi,symbol:NO_STAR}));
						}
					}
				}
				//Final alert on row
				if (this.notPlacedYet.rows[y].Os == 0){
					for(xi=0;xi<this.length;xi++){
						if (this.answerGrid[y][xi] == UNDECIDED){
							eventsToAdd.push({x:xi,y:y,symbol:NO_STAR});
							console.log("Event pushed : "+eventToString({x:xi,y:y,symbol:NO_STAR}));
						}
					}
				}
				//Final alert on region
				if (this.notPlacedYet.regions[r].Os == 0){
					var spaceInRegion;
					var i;
					for(i=0;i< this.spacesByRegion[r].length;i++){
						spaceInRegion = this.spacesByRegion[r][i];
						if (this.answerGrid[spaceInRegion.y][spaceInRegion.x] == UNDECIDED){
							eventsToAdd.push({x:spaceInRegion.x,y:spaceInRegion.y,symbol:NO_STAR});
							console.log("Event pushed : "+eventToString({x:spaceInRegion.x,y:spaceInRegion.y,symbol:NO_STAR}));
						}
					}
				}
			}
			if (symbol == NO_STAR){
				//Final alert on column : fill the missing spaces in the column 
				if (this.notPlacedYet.columns[x].Xs == 0){
					for(yi=0;yi<this.length;yi++){
						//there may be stars already, hence the (if UNDECIDED) guard
						if (this.answerGrid[yi][x] == UNDECIDED){
							eventsToAdd.push({x:x,y:yi,symbol:STAR});
							console.log("Event pushed : "+eventToString({x:x,y:yi,symbol:STAR}));
						}
					}
				}
				//Final alert on row
				if (this.notPlacedYet.rows[y].Xs == 0){
					for(xi=0;xi<this.length;xi++){
						if (this.answerGrid[y][xi] == UNDECIDED){
							eventsToAdd.push({x:xi,y:y,symbol:STAR});
							console.log("Event pushed : "+eventToString({x:xi,y:y,symbol:STAR}));
						}
					}
				}
				//Final alert on region
				if (this.notPlacedYet.regions[r].Xs == 0){
					var spaceInRegion;
					var i;
					for(i=0;i< this.spacesByRegion[r].length;i++){
						spaceInRegion = this.spacesByRegion[r][i];
						if (this.answerGrid[spaceInRegion.y][spaceInRegion.x] == UNDECIDED){
							eventsToAdd.push({x:spaceInRegion.x,y:spaceInRegion.y,symbol:STAR});
							console.log("Event pushed : "+eventToString({x:spaceInRegion.x,y:spaceInRegion.y,symbol:STAR}));
						}
					}
				}
			}
			eventsAdded.push(nextEvent);
		} // if OK
	}
	
	//Oops, we did a mistake ! 
	if (!ok){
		while(eventsAdded.length > 0){
			nextEvent = eventsAdded.pop();
			this.remove(nextEvent.x,nextEvent.y);
		}
	} 
	
	else{
		console.log("Yes !-----------------"); //TODO Vivement l'existence du canvas d'events quand même...
		this.happenedEvents.push({x:eventsAdded[0].x,y:eventsAdded[0].y,symbol:eventsAdded[0].symbol,cause:ASSUMED});
		for(var i=1;i<eventsAdded.length;i++){
			this.happenedEvents.push({x:eventsAdded[i].x,y:eventsAdded[i].y,symbol:eventsAdded[i].symbol,cause:FORCED});
		}
	}
}

GlobalStarBattle.prototype.massCancel = function(){
	var eventToCancel;
	if (this.happenedEvents.length == 0)
		return;
	do{
		eventToCancel = this.happenedEvents.pop();
		this.remove(eventToCancel.x,eventToCancel.y);	
	}while(eventToCancel.cause != ASSUMED);
}

//--------------
// It's "to string" time !

function eventToString(p_event){
	return ("["+p_event.x+","+p_event.y+"] ("+p_event.symbol+")");
}

function answerGridToString(p_grid){
	for(yi=0;yi<p_grid.length;yi++){
		row = "";
		for(xi=0;xi<p_grid.length;xi++){
			row+=p_grid[yi][xi];
		}
		console.log(row);
	}
}

