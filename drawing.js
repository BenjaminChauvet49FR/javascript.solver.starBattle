/**
Draws the around indications
*/
function drawAroundIndications(p_context,p_drawer,p_colorDigits,p_global){
	var pixFont = 30;
	//The starting point of fillText is lower-left.
	var pixXUpAndDown = p_drawer.pix.marginGrid.left;
	var pixXRight = p_drawer.pix.marginGrid.left+p_drawer.pix.sideSpace*p_global.xLength;
	var pixXLeft = 0;	
	var pixYLeftAndRight = p_drawer.pix.marginGrid.up+pixFont; 
	var pixYUp = pixFont;
	var pixYDown = p_drawer.pix.marginGrid.up+p_drawer.pix.sideSpace*p_global.yLength+pixFont;
	p_context.font = "30px Arial";
	for(var i=0;i<p_global.xyLength;i++){
		p_context.fillStyle = p_colorDigits.starIndication; //TODO perform color management
		p_context.fillText(p_global.getOsRemainColumn(i),pixXUpAndDown,pixYUp);
		p_context.fillText(p_global.getOsRemainRow(i),pixXLeft,pixYLeftAndRight);
		p_context.fillStyle = p_colorDigits.crossIndication;
		p_context.fillText(p_global.getXsRemainRow(i),pixXRight,pixYLeftAndRight);
		p_context.fillText(p_global.getXsRemainColumn(i),pixXUpAndDown,pixYDown);
		pixXUpAndDown += p_drawer.pix.sideSpace;
		pixYLeftAndRight += p_drawer.pix.sideSpace;
	}
}

/**
Draws the region indications within a space in each.
*/
function drawInsideIndications(p_context,p_drawer,p_colorDigits,p_global){
	const fontSize = p_drawer.pix.sideSpace/3;
	p_context.font = fontSize+"px Arial";
	p_context.fillStyle = p_colorDigits.regionIndication;
	var indexXFirstRegionSpace,indexYFirstRegionSpace;
	var pixLeft,pixUp;
	var textToWrite;
	var firstRegionSpace;
	for(var i=0;i<p_global.xyLength;i++){
		firstRegionSpace = p_global.getFirstSpaceRegion(i);
		pixLeft = p_drawer.pix.marginGrid.left+p_drawer.pix.sideSpace*firstRegionSpace.x+p_drawer.pix.borderSpace+1;//TODO renommer ces variables
		pixDown = p_drawer.pix.marginGrid.up+p_drawer.pix.sideSpace*firstRegionSpace.y+fontSize;
		textToWrite = p_global.getOsRemainRegion(i)+" "+p_global.getXsRemainRegion(i);
		p_context.fillText(textToWrite,pixLeft,pixDown);
	}
	
}

function drawSpaces(p_context,p_drawer,p_color,p_global){
	const fontSize = p_drawer.pix.sideSpace;
	p_context.font = fontSize+"px Arial";
	p_context.fillStyle = p_color.cross;
	const pixStartX = p_drawer.pix.marginGrid.left+p_drawer.pix.borderSpace;  
	var pixDrawX = pixStartX;	
	var pixDrawY = p_drawer.pix.marginGrid.up+p_drawer.pix.sideSpace-p_drawer.pix.borderSpace;
	var ix,iy;
	for(iy = 0;iy < p_global.xyLength;iy++){
		for(ix = 0;ix < p_global.xyLength;ix++){
			if ((p_global.getAnswer(ix,iy) != UNDECIDED) && (p_global.getRegion(ix,iy) != BANNED)){
				p_context.fillText(p_global.getAnswer(ix,iy),pixDrawX,pixDrawY);	
			}
			pixDrawX+=p_drawer.pix.sideSpace;
		}
		pixDrawY+=p_drawer.pix.sideSpace;
		pixDrawX = pixStartX;
	}
}

