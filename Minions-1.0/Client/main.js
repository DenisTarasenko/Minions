/* 
	Game 'Towers'
		main function и главный цикл игры
*/

var FPS = 40;

var game = new Game("fondScreen", "landScreen", 1 / FPS);// создаем нашу игру

// initialisation of GAME
function init() {
	game.init();
	setInterval(mainLoop, 1000 / FPS);
}

// main game loop
function mainLoop() {
	game.update();
	game.draw(game.screen, game.landScreen);
}


// run it!
init();