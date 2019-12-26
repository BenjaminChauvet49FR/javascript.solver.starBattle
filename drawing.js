//TODO description convaincante
function drawAroundIndications(p_context,p_pix,p_colorDigits,p_global){
	//Well, since the lower-left corner is taken into account instad of upper-left, I have to shift everything down 30 px
	//TODO make it cleaner
	var pixXUpAndDown = p_pix.marginGrid.left;
	var pixXRight = p_pix.marginGrid.left+p_pix.sideSpace*p_global.xLength;
	var pixXLeft = 0;	
	var pixYLeftAndRight = p_pix.marginGrid.up+30; 
	var pixYUp = 30;
	var pixYDown = p_pix.marginGrid.up+p_pix.sideSpace*p_global.yLength+30;
	p_context.font = "30px Arial";
	for(var i=0;i<p_global.xLength;i++){
		p_context.fillStyle = "#00cccc"; //TODO perform color management
		p_context.fillText(p_global.notPlacedYet.columns[i].Os,pixXUpAndDown,pixYUp);
		p_context.fillText(p_global.notPlacedYet.rows[i].Os,pixXLeft,pixYLeftAndRight);
		p_context.fillStyle = "#cc0000";
		p_context.fillText(p_global.notPlacedYet.rows[i].Xs,pixXRight,pixYLeftAndRight);
		p_context.fillText(p_global.notPlacedYet.columns[i].Xs,pixXUpAndDown,pixYDown);
		pixXUpAndDown += p_pix.sideSpace;
		pixYLeftAndRight += p_pix.sideSpace;
	}
}

//TODO hypothèse grave : il se peut qu'à l'initialisation le code ci-dessous ne soit pas VALIDE ! (il n'y a pas autant de régions que de lignes et de colonnes. En plus la grille n'est même pas carrée !)
//TODO là aussi
//Hyphothesis (non mandatory but better) : in each region, the first space is true.
function drawInsideIndications(p_context,p_pix,p_colorDigits,p_global){
	const fontSize = p_pix.sideSpace/3;
	p_context.font = fontSize+"px Arial";
	p_context.fillStyle = "#008800";
	var indexXFirstRegionSpace,indexYFirstRegionSpace;
	var pixLeft,pixUp;
	var textToWrite;
	for(var i=0;i<p_global.xLength;i++){
		indexXFirstRegionSpace = p_global.spacesByRegion[i][0].x;
		indexYFirstRegionSpace = p_global.spacesByRegion[i][0].y;
		pixLeft = p_pix.marginGrid.left+p_pix.sideSpace*indexXFirstRegionSpace+p_pix.borderSpace+1;//TODO renommer ces variables
		pixDown = p_pix.marginGrid.up+p_pix.sideSpace*indexYFirstRegionSpace+10;//TODO Le 10 est arbitraire, y penser
		textToWrite = p_global.notPlacedYet.regions[i].Os+" "+p_global.notPlacedYet.regions[i].Xs;
		p_context.fillText(textToWrite,pixLeft,pixDown);
	}
	
}

function drawSpaces(p_context,p_pix,p_global){
	const fontSize = p_pix.sideSpace;
	p_context.font = fontSize+"px Arial";
	p_context.fillStyle = "#000000";
	const pixStartX = p_pix.marginGrid.left+p_pix.borderSpace;  
	var pixDrawX = pixStartX;	
	var pixDrawY = p_pix.marginGrid.up+p_pix.sideSpace-p_pix.borderSpace;
	var ix,iy;
	var logDebug;
	for(iy = 0;iy < p_global.length;iy++){
		logDebug = "";
		for(ix = 0;ix < p_global.length;ix++){
			if ((p_global.answerGrid[iy][ix] != UNDECIDED) && (p_global.regionGrid[iy][ix] != BANNED)){
				p_context.fillText(p_global.answerGrid[iy][ix],pixDrawX,pixDrawY);	
			}
			pixDrawX+=p_pix.sideSpace;
		}
		pixDrawY+=p_pix.sideSpace;
		pixDrawX = pixStartX;
	}
}