/**
 * Created by user on 14.06.2015.
 */
/*
 наше Окно выиграл 1 игрок
 */
 
 var Game_Over_1 = function(Game) {
    this.game = Game;
    this.image = new Image();
	this.image.src = "Images/Menu/game_over_1.png";
	
	this.txt_GameOver = "GAME OVER";
	this.txt_Enter = "p r e s s   E n t e r   t o   m a i n   m e n u";
}

// обновление меню
Game_Over_1.prototype.update = function(Inputhandler) {
    if (Inputhandler.shoot) { // проверка Enter
        this.game.status = this.game.STATUS.MAIN_MENU;
		Inputhandler.shoot = false;
        this.game.audio.tuka.pause();
        this.game.audio.tuka.load();
        this.game.audio.happy.play();
    }
}

// отрисовка меню
Game_Over_1.prototype.draw = function(screen) {
    screen.drawImage(this.game.background, 0, 0, this.game.gameSize.width, this.game.gameSize.height);
    this.game.clouds.draw(screen);
    screen.drawImage(this.game.landCanvas, 0, 0); // переносим землю на экран
    for (var i = 0, len = this.game.towers.length; i < len; i++) // все башни
        this.game.towers[i].draw(screen); // рисуем башню

    screen.fillStyle = 'rgba(0, 0, 0, 0.7)';
    screen.fillRect(0, 0, this.game.gameSize.width, this.game.gameSize.height);
	
	screen.drawImage(this.image, this.game.gameSize.width / 2 - this.image.width / 2 / 1.2, this.game.gameSize.height - this.image.height / 1.2, this.image.width / 1.2, this.image.height / 1.2);

	screen.save();
	screen.shadowBlur=7;
    screen.shadowColor="white";
    screen.fillStyle = "black";
    screen.font = "80px " + this.game.font;
    screen.fillText(this.txt_GameOver, this.game.gameSize.width / 2, 200);
	screen.restore();
	
	screen.fillStyle = "white";
	screen.font = "12px " + this.game.font;
    screen.fillText(this.txt_Enter, this.game.gameSize.width / 2, this.game.gameSize.height - 15);
}