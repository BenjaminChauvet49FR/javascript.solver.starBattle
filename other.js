/**
Sets the list of spaces for each row and column (might be exportated)
Hyphothesis : all non-banned regions are numbered from 0 to n-1 ; banned spaces have lower-than-0 numbers
Exit : all spaces within a region are in reading order (top to bottom, then left to right)
*/
function listSpacesByRegion(p_regionGrid, p_xLength, p_yLength){
	var ix,iy;
	var lastRegionNumber = 0;
	for(iy = 0;iy < p_yLength;iy++){
		for(ix = 0;ix < p_xLength;ix++){
			lastRegionNumber = Math.max(p_regionGrid[iy][ix],lastRegionNumber);
		}
	}
	
	var listOfListsAnswer = [];
	for(var i=0;i<=lastRegionNumber;i++){
		listOfListsAnswer.push([]);
	}
	for(iy = 0;iy < p_yLength;iy++){
		for(ix = 0;ix < p_xLength;ix++){
			if(p_regionGrid[iy][ix] >= 0){
				listOfListsAnswer[p_regionGrid[iy][ix]].push({x:ix,y:iy});
			}
		}
	}
	//See hyphothesis above !
	return listOfListsAnswer;
}

