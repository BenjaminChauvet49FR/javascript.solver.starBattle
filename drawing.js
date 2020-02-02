/**
Draws the around indications
*/
function drawAroundIndications(p_context,p_drawer,p_colorDigits,p_global){
	var pixFont = p_drawer.pix.sideSpace-p_drawer.pix.borderSpace;
	savedTextAlign = p_context.textAlign;
	savedTextBaseline = p_context.textBaseline;
	p_context.textAlign = 'center';
	p_context.textBaseline = 'middle';
	var pixXUpAndDown = p_drawer.getCenterX(0);
	var pixXLeft = p_drawer.getCenterX(-1);	
	var pixXRight = p_drawer.getCenterX(p_global.xyLength);
	var pixYLeftAndRight = p_drawer.getCenterY(0); 
	var pixYUp = p_drawer.getCenterY(-1);
	var pixYDown = p_drawer.getCenterY(p_global.xyLength);
	p_context.font = pixFont+"px Arial";
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
	p_context.textAlign = savedTextAlign;
	p_context.textBaseline = savedTextBaseline;
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
		pixLeft = p_drawer.getInnerXLeft(firstRegionSpace.x);
		pixDown = p_drawer.getInnerYUp(firstRegionSpace.y)+fontSize;
		textToWrite = p_global.getOsRemainRegion(i)+" "+p_global.getXsRemainRegion(i);
		p_context.fillText(textToWrite,pixLeft,pixDown);
	}
	
}

/**
Draws what's inside spaces
*/
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

