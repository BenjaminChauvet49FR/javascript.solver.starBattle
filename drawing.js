/**
Draws the around indications
*/
function drawAroundIndications(p_context,p_pix,p_colorDigits,p_global){
	var pixFont = 30;
	//The starting point of fillText is lower-left.
	var pixXUpAndDown = p_pix.marginGrid.left;
	var pixXRight = p_pix.marginGrid.left+p_pix.sideSpace*p_global.xLength;
	var pixXLeft = 0;	
	var pixYLeftAndRight = p_pix.marginGrid.up+pixFont; 
	var pixYUp = pixFont;
	var pixYDown = p_pix.marginGrid.up+p_pix.sideSpace*p_global.yLength+pixFont;
	p_context.font = "30px Arial";
	for(var i=0;i<p_global.xLength;i++){
		p_context.fillStyle = p_colorDigits.starIndication; //TODO perform color management
		p_context.fillText(p_global.getOsRemainColumn(i),pixXUpAndDown,pixYUp);
		p_context.fillText(p_global.getOsRemainRow(i),pixXLeft,pixYLeftAndRight);
		p_context.fillStyle = p_colorDigits.crossIndication;
		p_context.fillText(p_global.getXsRemainRow(i),pixXRight,pixYLeftAndRight);
		p_context.fillText(p_global.getXsRemainColumn(i),pixXUpAndDown,pixYDown);
		pixXUpAndDown += p_pix.sideSpace;
		pixYLeftAndRight += p_pix.sideSpace;
	}
}

/**
Draws the region indications within a space in each.
*/
function drawInsideIndications(p_context,p_pix,p_colorDigits,p_global){
	const fontSize = p_pix.sideSpace/3;
	p_context.font = fontSize+"px Arial";
	p_context.fillStyle = p_colorDigits.regionIndication;
	var indexXFirstRegionSpace,indexYFirstRegionSpace;
	var pixLeft,pixUp;
	var textToWrite;
	var firstRegionSpace;
	for(var i=0;i<p_global.xLength;i++){
		firstRegionSpace = p_global.getFirstSpaceRegion(i);
		pixLeft = p_pix.marginGrid.left+p_pix.sideSpace*firstRegionSpace.x+p_pix.borderSpace+1;//TODO renommer ces variables
		pixDown = p_pix.marginGrid.up+p_pix.sideSpace*firstRegionSpace.y+fontSize;
		textToWrite = p_global.getOsRemainRegion(i)+" "+p_global.getXsRemainRegion(i);
		p_context.fillText(textToWrite,pixLeft,pixDown);
	}
	
}

function drawSpaces(p_context,p_pix,p_color,p_global){
	const fontSize = p_pix.sideSpace;
	p_context.font = fontSize+"px Arial";
	p_context.fillStyle = p_color.cross;
	const pixStartX = p_pix.marginGrid.left+p_pix.borderSpace;  
	var pixDrawX = pixStartX;	
	var pixDrawY = p_pix.marginGrid.up+p_pix.sideSpace-p_pix.borderSpace;
	var ix,iy;
	for(iy = 0;iy < p_global.length;iy++){
		for(ix = 0;ix < p_global.length;ix++){
			if ((p_global.getAnswer(ix,iy) != UNDECIDED) && (p_global.getRegion(ix,iy) != BANNED)){
				p_context.fillText(p_global.getAnswer(ix,iy),pixDrawX,pixDrawY);	
			}
			pixDrawX+=p_pix.sideSpace;
		}
		pixDrawY+=p_pix.sideSpace;
		pixDrawX = pixStartX;
	}
}