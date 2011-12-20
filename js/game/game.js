function basicGame(canvasID){
	var scorePane = new Pane("score");
	pane = new Pane(canvasID);
	var gridCount = 50;
	var sizeFactor = pane.getWidth()/gridCount;
	
	var gridColor = "rgb(20,20,20)"
	
	var foods = [];
	var foodColor = "white";

	var points = 0;

	var cent = [];
	direction = new GameMath.Vector2f(0,-1);

	this.startup = function(){
		for(var i = 0;i<3;i++){
			foods[i] =(new GameMath.Vector2f(GameMath.Random.randInt(0,gridCount-1),GameMath.Random.randInt(0,gridCount-1)));
		}
		cent[0] = new GameMath.Vector2f(gridCount-3,gridCount-3);
		cent[1] = new GameMath.Vector2f(gridCount-2,gridCount-2);
	}

	//////////////////////
	/////// UPDATE ///////
	//////////////////////

	this.update = function(){
		var nCent = [];
		nCent[0] = cent[0];
		for(var i=1;i<cent.length;i++){
			nCent[i]=cent[i-1].clone();
		}
		cent = nCent;		

		cent[0].plusEquals(direction);	
		cent[0].x=(cent[0].x +50 )% gridCount;
		cent[0].y=(cent[0].y +50 )% gridCount;		

		var lower;
		// Check for food collision
		for(var i=0; i<foods.length;i++){
			if(cent[0].equals(foods[i]))
			{
				//Add the foods
				foods[i] = new GameMath.Vector2f(GameMath.Random.randInt(5,gridCount-5),GameMath.Random.randInt(5,gridCount-5)); 
		
				// Add the new pieces to the snake
				for(var i=0;i<5;i++){	
					cent[cent.length] = cent[cent.length-1].clone();
				}
				
				//increment the score
				score ++;
			}
		}

		// Check for snake collision
		for(var i=1; i<cent.length;i++){
			if(cent[0].equals(cent[i])){
				stop();
			}
		}
	}



	this.render = function(){
		pane.drawRectFill(0,0,pane.getWidth(),pane.getHeight(),"black");

		// Draw the food
		for(var i=0;i<foods.length;i++){
			pane.drawCircleFill(sizeFactor*foods[i].x+sizeFactor/2,sizeFactor*foods[i].y+sizeFactor/2,sizeFactor/2,foodColor);
		}
		//Draw the grid
		for(var i=0;i<gridCount;i++){
			for(var k=0;k<gridCount;k++){
				pane.drawLine(i*sizeFactor,k*sizeFactor,i*sizeFactor,k+gridCount*sizeFactor,gridColor);
				pane.drawLine(i*sizeFactor,k*sizeFactor,i*sizeFactor+gridCount*sizeFactor,k*sizeFactor,gridColor);
			}
		}

		//Draw the centepede
		for(var i=0; i<cent.length;i++){
			//do color setting
			centColor = getColor(i,cent);

			// The head
			if(i==0){
				//Circle Part
				pane.drawCircleFill(sizeFactor*cent[i].x+sizeFactor/2,sizeFactor*cent[i].y+sizeFactor/2,sizeFactor/2,centColor);
				//round it off
				if(cent.length>1){
					if(cent[0].x>cent[1].x){
						pane.drawRectFill(sizeFactor*cent[0].x,sizeFactor*cent[i].y,sizeFactor/2,sizeFactor,centColor);
					}else if(cent[0].x<cent[1].x){
						pane.drawRectFill(sizeFactor*cent[0].x+sizeFactor/2,sizeFactor*cent[0].y,sizeFactor/2,sizeFactor,centColor);
					}

					if(cent[0].y>cent[1].y){
						pane.drawRectFill(sizeFactor*cent[0].x,sizeFactor*cent[i].y,sizeFactor,sizeFactor/2,centColor);	
					}
					else if(cent[0].y<cent[1].y){
						pane.drawRectFill(sizeFactor*cent[0].x,sizeFactor*cent[0].y+sizeFactor/2,sizeFactor,sizeFactor/2,centColor);
					}
						
				}
			}else if(i==cent.length-1){ //The tail
				pane.drawRectFill(sizeFactor*cent[i].x,sizeFactor*cent[i].y,sizeFactor,sizeFactor,centColor);
			}else{
				var foodHere = false;
				for(var k=0;k<foods.length;k++){
					if(cent[i].equals(foods[k])){
						foodHere = true;
						break;
					}
				}
				pane.drawRectFill(sizeFactor*cent[i].x,sizeFactor*cent[i].y,sizeFactor,sizeFactor,centColor);

				
				if(foodHere){
					centColor="white";
					pane.drawCircleFill(sizeFactor*cent[i].x+sizeFactor/2,sizeFactor*cent[i].y+sizeFactor/2,sizeFactor/2,centColor);
				}
			}
		}
	}

	this.isRunning = function(){
		return true;
	}
}

inputHandler = function(e){
	var key = event.keyCode;
	var newDirection;
	if(key==87||key==38){        //Up
		newDirection=new GameMath.Vector2f(0,-1);
	} else if(key==83||key==40){ // Down
		newDirection=new GameMath.Vector2f(0,1);
	} else if(key==68||key==39){ // Right
		newDirection = new GameMath.Vector2f(1,0);
	} else if(key==65||key==37){ // Left
		newDirection = new GameMath.Vector2f(-1,0);
	}

	if(direction.y != newDirection.y){
		if(direction.x != newDirection.x){
			direction = newDirection.clone();
		}
	}
	
};


function getColor(index,array){
	var hue = index/array.length*360;
	return "hsl("+hue+",100%,50%)";
}

function start(){
	myGame = new basicGame("canvas");
	game = new Engine(myGame,10);
	game.run();
}
function stop(){
	game.stop();
}
