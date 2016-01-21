/**
 * Created by user on 24.05.2015.
 */
/*
 наше Окно паузы
 */

var Pause = function(Game) {
    this.game = Game;
    this.buttonSize = {
        width: Game.gameSize.width / 11,
        height: Game.gameSize.height / 12
    };
    this.button_center_X = Game.gameSize.width / 2 - this.buttonSize.width / 2;
	
	this.color1 = "black";
	this.color2 = "white";

    this.button_Resume = new Button(this.button_center_X - 35, 240, this.buttonSize.width + 70, 29, this.color1, "RESUME");
    this.button_Restart = new Button(this.button_center_X - 40, 240 + this.buttonSize.height + 50, this.buttonSize.width + 80, 29, this.color1, "RESTART");
    this.button_Main_menu = new Button(this.button_center_X - 70, 240 + 2 * (this.buttonSize.height + 50), this.buttonSize.width + 140, 29, this.color1, "MAIN MENU");

}

// обновление меню
Pause.prototype.update = function(Inputhandler) {
    if (Inputhandler.esc) { // проверка ESC
        this.game.status = this.game.STATUS.PLAY;
		Inputhandler.esc = false;
    }

    if (this.button_Resume.isInside(Inputhandler.mouse)) { // кнопка RESUME
        this.button_Resume.color = this.color2;
        if (Inputhandler.shoot) {
            Inputhandler.shoot = false;
            this.game.status = this.game.STATUS.PLAY;
        }
    }
    else
        this.button_Resume.color = this.color1;

    if (this.button_Restart.isInside(Inputhandler.mouse)) { // кнопка RESTART
        this.button_Restart.color = this.color2;
        if (Inputhandler.shoot) {
            this.game.init();
            this.game.status = this.game.STATUS.PLAY;
        }
    }
    else
        this.button_Restart.color = this.color1;

    if (this.button_Main_menu.isInside(Inputhandler.mouse)) { // кнопка MAIN MENU
        this.button_Main_menu.color = this.color2;
        if (Inputhandler.shoot) {
            this.game.status = this.game.STATUS.MAIN_MENU;
            Inputhandler.shoot = false;
            this.game.audio.happy.play()
        }
    }
    else
        this.button_Main_menu.color = this.color1;

    this.wi = this.game.wind / 12;
    this.game.clouds.update(this.wi);
}

// отрисовка меню
Pause.prototype.draw = function(screen) {
    screen.drawImage(this.game.background, 0, 0, this.game.gameSize.width, this.game.gameSize.height);
    this.game.clouds.draw(screen);
    screen.drawImage(this.game.landCanvas, 0, 0); // переносим землю на экран
    for (var i = 0, len = this.game.towers.length; i < len; i++) // все башни
        this.game.towers[i].draw(screen); // рисуем башню

    screen.fillStyle = 'rgba(0, 0, 0, 0.7)';
    screen.fillRect(0, 0, this.game.gameSize.width, this.game.gameSize.height);

	screen.font = "35px " + this.game.font;
    this.button_Resume.draw(screen);
    this.button_Restart.draw(screen);
    this.button_Main_menu.draw(screen);

    screen.fillStyle = "red";
    screen.font = "50px " + this.game.font;
    screen.fillText("PAUSE", this.game.gameSize.width / 2, 150); // PAUSE
}