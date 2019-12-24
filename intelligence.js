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