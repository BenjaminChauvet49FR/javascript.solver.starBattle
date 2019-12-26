/**
Returns an array allowing to know the number of remaining Os (stars) / Xs within the grid
*/
function buildPossibilitiesStarBattle(p_sizeStarBattle,p_numberStarsPer){
	const complement = p_sizeStarBattle-p_numberStarsPer;
	var answer = [];
	for(var i=0;i<p_sizeStarBattle;i++){
		answer.push({Os:p_numberStarsPer,Xs:complement});
	}
	return answer;
}

/**
Same, but only for region
*/
function buildPossibilitiesStarBattleRegion(p_regionList,p_numberStarsPer){
	var answer = [];
	for(var i=0;i<p_regionList.length;i++){
		answer.push({Os:p_numberStarsPer,Xs:p_regionList[i].length-p_numberStarsPer});
	}
	return answer;
}

/**Tries to put a symbol into the space of a grid. 3 possibilities :
OK : it was indeed put into the grid ; the number of Os and Xs for this region, row and column are also updated.
HARMLESS : said symbol was either already put into that space OUT out of bounds beacuse of automatic operation. Don't change anything to the grid and remaining symbols
ERROR : there is a different symbol in that space. We have done a wrong hypothesis somewhere ! (or the grid was wrong at the basis !)
This is also used at grid start in order to put Xs in banned spaces, hence the check in the NO_STAR part.

*/
function putNew(p_global,p_x,p_y,p_symbol){
	if ((p_x < 0) || (p_x >= p_global.length) || (p_y < 0) || (p_y >= p_global.length) || 
	(p_global.answerGrid[p_y][p_x] == p_symbol)){
		return HARMLESS;
	}
	if (p_global.answerGrid[p_y][p_x] == UNDECIDED){
		p_global.answerGrid[p_y][p_x] = p_symbol;
		var indexRegion = p_global.regionGrid[p_y][p_x];
		if (p_symbol == STAR){
			p_global.notPlacedYet.regions[indexRegion].Os--;
			p_global.notPlacedYet.rows[p_y].Os--;
			p_global.notPlacedYet.columns[p_x].Os--;
		}
		if (p_symbol == NO_STAR){
			if (indexRegion >= 0){
				p_global.notPlacedYet.regions[indexRegion].Xs--;				
			}
			p_global.notPlacedYet.rows[p_y].Xs--;
			p_global.notPlacedYet.columns[p_x].Xs--;	
		}
		return OK;
	}
	if (p_global.answerGrid[p_y][p_x] != p_symbol){
		return ERROR;
	}


}

/**
Well, we did something wrong so... let's remove it, right ?
*/
remove = function(p_global,p_x,p_y){
	var indexRegion = p_global.regionGrid[p_y][p_x];
	var symbol = p_global.answerGrid[p_y][p_x];
	p_global.answerGrid[p_y][p_x] = UNDECIDED;
	if (p_symbol == STAR){
		p_global.notPlacedYet.regions[indexRegion].Os++;
		p_global.notPlacedYet.rows[p_y].Os++;
		p_global.notPlacedYet.columns[p_x].Os++;
	}
	if (p_symbol == NO_STAR){
		p_global.notPlacedYet.regions[indexRegion].Xs++;
		p_global.notPlacedYet.rows[p_y].Xs++;
		p_global.notPlacedYet.columns[p_x].Xs++;	
	}

}

//Add to global : anwerGrid

/**

*/
function tryToPutNew(p_global,p_x,p_y,p_symbol){
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
		putNewResult = putNew(p_global,x, y,symbol);
		console.log("Now let's try to add : "+eventToString(nextEvent));
		if (putNewResult == OK){
			//(y,x) might be out of bounds, if so the putNewResult isn't supposed to be OK. Hence the check only here.
			r = p_global.regionGrid[y][x]; 
			if (symbol == STAR){
				//Add to all 7 neighbors (no one should be star if solved correctly)
				for(i=0;i<=7;i++){
					eventsToAdd.push({x:x+ROUND_X_COORDINATES[i],y:y+ROUND_Y_COORDINATES[i],symbol:NO_STAR});
				}
				//Final alert on column : fill the missing spaces in the column 
				/*if (p_global.notPlacedYet.columns[x].Os == 0){
					for(yi=0;yi<global.length;yi++){
						//there may be stars already, hence the (if UNDECIDED) guard
						if (p_global.answerGrid[yi][x] == UNDECIDED){
							eventsToAdd.push({x:x,y:yi,symbol:NO_STAR});
						}
					}
				}*/
				//Final alert on row
				/*if (p_global.notPlacedYet.rows[y].Os == 0){
					for(xi=0;xi<global.length;xi++){
						if (p_global.answerGrid[y][xi] == UNDECIDED){
							eventsToAdd.push({x:xi,y:y,symbol:NO_STAR});
						}
					}
				}*/
				//Final alert on region
				/*if (p_global.notPlacedYet.regions[r].Os == 0){
					var spaceInRegion;
					var i;
					for(i=0;i< p_global.spacesByRegion[r].length;i++){
						spaceInRegion = p_global.spacesByRegion[r][i];
						if (p_global.answerGrid[spaceInRegion.y][spaceInRegion.x] == UNDECIDED){
							eventsToAdd.push({x:spaceInRegion.x,y:spaceInRegion.y,symbol:NO_STAR});
						}
					}
				}*/
			}
			if (symbol == NO_STAR){
				//Final alert on column : fill the missing spaces in the column 
				/*if (p_global.notPlacedYet.columns[x].Xs == 0){
					for(yi=0;yi<global.length;yi++){
						//there may be stars already, hence the (if UNDECIDED) guard
						if (p_global.answerGrid[yi][x] == UNDECIDED){
							eventsToAdd.push({x:x,y:yi,symbol:STAR});
						}
					}
				}*/
				//Final alert on row
				/*if (p_global.notPlacedYet.rows[y].Xs == 0){
					for(xi=0;xi<global.length;xi++){
						if (p_global.answerGrid[y][xi] == UNDECIDED){
							eventsToAdd.push({x:xi,y:y,symbol:STAR});
						}
					}
				}*/
				//Final alert on region
				/*if (p_global.notPlacedYet.regions[r].Xs == 0){
					var spaceInRegion;
					var i;
					for(i=0;i< p_global.spacesByRegion[r].length;i++){
						spaceInRegion = p_global.spacesByRegion[r][i];
						if (p_global.answerGrid[spaceInRegion.y][spaceInRegion.x] == UNDECIDED){
							eventsToAdd.push({x:spaceInRegion.x,y:spaceInRegion.y,symbol:STAR});
						}
					}
				}*/
			}
			eventsAdded.push(nextEvent);
		} // if OK
	}
	
	//Oops, we did a mistake ! 
	if (!ok){
		while(eventsAdded.length > 0){
			nextEvent = eventsAdded.pop();
			remove(p_global,nextEvent.x,nextEvent.y);
		}
	}
	
	//PARTIE LOG
	var row="";
	for(yi=0;yi<global.length;yi++){
		row = "";
		for(xi=0;xi<global.length;xi++){
			row+=p_global.answerGrid[yi][xi];
		}
		console.log(row);
	}
}

function eventToString(p_event){
	return ("["+p_event.x+","+p_event.y+"] ("+p_event.symbol+")");
}