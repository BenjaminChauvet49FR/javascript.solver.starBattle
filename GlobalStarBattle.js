function GlobalStarBattle(p_wallGrid,p_starNumber){
	Global.call(this,1,1);
	this.loadGrid(p_wallGrid);
	this.answerGrid = [];
	this.spacesByRegion =  [];
	this.notPlacedYet = {regions:[],rows:[],columns:[]};
	this.happenedEvents = [];	
	this.loadIntelligence(p_starNumber); 
	//xyLength : size of the grids.
	//answerGrid : array(length, length) of int ; contains the desired answers (STAR,NO_STAR,UNDECIDED)
	//notPlacedYet : object{regions{Os,Xs},rows{Os,Xs},columns{Os,Xs}} ; contains the Os and Xs that are yet to be placed in each region (ordered by index), row or column (left to right, top to bottom)
	//spacesByRegion : array(length) of variable arrays of {x,y} ; returns the spaces contained in each region
	//happenedEvents : array of array(Event) ; contains an array of an array of events : for each supposed, the list of itself and all events that were forced by it.
}

GlobalStarBattle.prototype = new Global(1,1);
GlobalStarBattle.prototype.constructor = GlobalStarBattle;
// Credits : https://www.tutorialsteacher.com/javascript/inheritance-in-javascript

/**
Calls the function that launches the intelligence of the grid. Very important !
*/
GlobalStarBattle.prototype.loadIntelligence = function(p_starNumber){
	this.xyLength = this.wallGrid.length;
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
	for(iy = 0; iy < this.xyLength ; iy++){
		this.answerGrid.push([]);
		for(ix = 0; ix < this.xyLength ; ix++){
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
	for(iy = 0; iy < this.xyLength ; iy++){
		for(ix = 0; ix < this.xyLength ; ix++){
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
	for(iy = 0;iy < this.xyLength;iy++){
		for(ix = 0;ix < this.xyLength;ix++){
			lastRegionNumber = Math.max(this.regionGrid[iy][ix],lastRegionNumber);
		}
	}
	
	this.spacesByRegion = [];
	for(var i=0;i<=lastRegionNumber;i++){
		this.spacesByRegion.push([]);
	}
	for(iy = 0;iy < this.xyLength;iy++){
		for(ix = 0;ix < this.xyLength;ix++){
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
	const complement = this.xyLength - p_numberStarsPer;
	for(var i=0;i<this.xyLength;i++){
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
	if ((p_x < 0) || (p_x >= this.xyLength) || (p_y < 0) || (p_y >= this.xyLength) || 
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
	console.log("Removing the following : "+p_x+" "+p_y+" "+symbol);
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
	
	if (this.answerGrid[p_y][p_x] != UNDECIDED){
		console.log("Warning ! Trying to put "+p_symbol+" at "+p_x+","+p_y+" ; there is already "+this.answerGrid[p_y][p_x]+" in this place !");
		return;
	}
	
	var eventsToAdd = [new SpaceEvent(p_symbol,p_x,p_y)];
	var eventsAdded = [];
	var ok = true;
	var putNewResult;
	var spaceEventToApply;
	var spaceEventToAdd;
	var x,y,r,symbol,xi,yi,roundi;
	while ((eventsToAdd.length > 0) && ok){ 
		spaceEventToApply = eventsToAdd.pop();
		x = spaceEventToApply.x;
		y = spaceEventToApply.y;
		symbol = spaceEventToApply.symbol;
		console.log("Now let's try to add : "+spaceEventToApply.toString());
		putNewResult = this.putNew(x, y,symbol);
		ok = (putNewResult != ERROR);
		if (putNewResult == OK){
			r = this.getRegion(x,y); //(y,x) might be out of bounds, if so the putNewResult isn't supposed to be OK. Hence the check only here.
			if (symbol == STAR){
				//Add to all 7 neighbors (no one should be star if solved correctly)
				for(roundi=0;roundi<=7;roundi++){
					spaceEventToAdd = new SpaceEvent(NO_STAR,x+ROUND_X_COORDINATES[roundi],y+ROUND_Y_COORDINATES[roundi]);
					eventsToAdd.push(spaceEventToAdd);
					console.log("Event pushed : "+spaceEventToAdd.toString());
				}
				//Final alert on column : fill the missing spaces in the column 
				if (this.notPlacedYet.columns[x].Os == 0){
					for(yi=0;yi<this.xyLength;yi++){
						//there may be stars already, hence the (if UNDECIDED) guard
						if (this.answerGrid[yi][x] == UNDECIDED){
							spaceEventToAdd = new SpaceEvent(NO_STAR,x,yi);
							eventsToAdd.push(spaceEventToAdd);
							console.log("Event pushed : "+spaceEventToAdd.toString());
						}
					}
				}
				//Final alert on row
				if (this.notPlacedYet.rows[y].Os == 0){
					for(xi=0;xi<this.xyLength;xi++){
						if (this.answerGrid[y][xi] == UNDECIDED){
							spaceEventToAdd = new SpaceEvent(NO_STAR,xi,y);
							eventsToAdd.push(spaceEventToAdd);
							console.log("Event pushed : "+spaceEventToAdd.toString());
						}
					}
				}
				//Final alert on region
				if (this.notPlacedYet.regions[r].Os == 0){
					var spaceInRegion;
					for(var si=0;si< this.spacesByRegion[r].length;si++){
						spaceInRegion = this.spacesByRegion[r][si];
						if (this.answerGrid[spaceInRegion.y][spaceInRegion.x] == UNDECIDED){
							spaceEventToAdd = new SpaceEvent(NO_STAR,spaceInRegion.x,spaceInRegion.y);
							eventsToAdd.push(spaceEventToAdd);
							console.log("Event pushed : "+spaceEventToAdd.toString());
						}
					}
				}
			}
			if (symbol == NO_STAR){
				//Final alert on column : fill the missing spaces in the column 
				if (this.notPlacedYet.columns[x].Xs == 0){
					for(yi=0;yi<this.xyLength;yi++){
						//there may be stars already, hence the (if UNDECIDED) guard
						if (this.answerGrid[yi][x] == UNDECIDED){
							spaceEventToAdd = new SpaceEvent(STAR,x,yi);
							eventsToAdd.push(spaceEventToAdd);
							console.log("Event pushed : "+spaceEventToAdd.toString());
						}
					}
				}
				//Final alert on row
				if (this.notPlacedYet.rows[y].Xs == 0){
					for(xi=0;xi<this.xyLength;xi++){
						if (this.answerGrid[y][xi] == UNDECIDED){
							spaceEventToAdd = new SpaceEvent(STAR,xi,y);
							eventsToAdd.push(spaceEventToAdd);
							console.log("Event pushed : "+spaceEventToAdd.toString());
						}
					}
				}
				//Final alert on region
				if (this.notPlacedYet.regions[r].Xs == 0){
					var spaceInRegion;
					for(var si=0;si< this.spacesByRegion[r].length;si++){
						spaceInRegion = this.spacesByRegion[r][si];
						if (this.answerGrid[spaceInRegion.y][spaceInRegion.x] == UNDECIDED){
							spaceEventToAdd = new SpaceEvent(STAR,spaceInRegion.x,spaceInRegion.y);
							eventsToAdd.push(spaceEventToAdd);
							console.log("Event pushed : "+spaceEventToAdd.toString());
						}
					}
				}
			}
			eventsAdded.push(spaceEventToApply);
		} // if OK
	}
	
	//Mistakes were made, we should undo everything 
	if (!ok){
		var spaceEventToUndo
		while(eventsAdded.length > 0){
			spaceEventToUndo = eventsAdded.pop();
			this.remove(spaceEventToUndo.x,spaceEventToUndo.y);
		}
	} 
	
	else{
		console.log("Yes !-----------------"); 
		this.happenedEvents.push(eventsAdded) 
	}
}

/**
Cancel the last list of events
*/
GlobalStarBattle.prototype.massUndo = function(){
	var spaceEventToUndo;
	if (this.happenedEvents.length == 0)
		return;
	var spaceEventsListToUndo = this.happenedEvents.pop();
	while (spaceEventsListToUndo.length !=0){
		spaceEventToUndo = spaceEventsListToUndo.pop();
		this.remove(spaceEventToUndo.x,spaceEventToUndo.y);
	}
} 

//--------------
// It's "to string" time !

function answerGridToString(p_grid){
	for(yi=0;yi<p_grid.length;yi++){
		row = "";
		for(xi=0;xi<p_grid.length;xi++){
			row+=p_grid[yi][xi];
		}
		console.log(row);
	}
}

/**
Returns the events to the text
p_onlyAssumed : true if only the assumed events should be written.
*/
GlobalStarBattle.prototype.happenedEventsToString = function(p_onlyAssumed){
	var ei,li;
	var answer = "";
	if (p_onlyAssumed){
		this.happenedEvents.forEach(function(eventList){
			answer+=eventList[0].toString()+"\n";
		});
	}
	else{
		this.happenedEvents.forEach(function(eventList){
			eventList.forEach(function(spaceEvent){
				answer+=spaceEvent.toString()+"\n" 
			});
			answer+="--------\n";
		});
	}
	return answer;
}