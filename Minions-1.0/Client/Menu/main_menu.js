/**
 * Created by user on 24.05.2015.
 */
/*
 наше Окно главное меню
 */

var Main_Menu = function(Game) {
    this.game = Game;
    this.buttonSize = {
        width: Game.gameSize.width / 11,
        height: 29
    };
    this.button_center_X = Game.gameSize.width / 2 - this.buttonSize.width / 2;
	
	this.color1 = "black";
	this.color2 = "white";

    this.button_Play = new Button(this.button_center_X, 150, this.buttonSize.width, this.buttonSize.height, this.color1, "PLAY");

    this.button_Select_level = new Button(this.button_center_X - 100, this.button_Play.pos.y + this.buttonSize.height + 100, this.buttonSize.width + 200, this.buttonSize.height, this.color1, "SELECT LEVEL");

	this.button_Settings = new Button(this.button_center_X - 50, this.button_Select_level.pos.y + this.buttonSize.height + 100, this.buttonSize.width + 100, this.buttonSize.height, this.color1, "SETTINGS");
	
    this.button_Tutorial = new Button(this.button_center_X - 90, this.button_Settings.pos.y + this.buttonSize.height + 100, this.buttonSize.width + 180, this.buttonSize.height, this.color1, "HOW TO PLAY");

    this.background = new Image();
    this.background.src = "Images/Menu/main_menu.jpg";
}

// обновление меню
Main_Menu.prototype.update = function(Inputhandler) {
    if (this.button_Play.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Play.color = this.color2;
        if (Inputhandler.shoot) {
			//this.loading(this.game.screen);
            this.game.init();
            this.game.status = this.game.STATUS.PLAY;
            this.game.audio.happy.pause();
            this.game.audio.happy.load();
        }
    }
    else
        this.button_Play.color = this.color1;

    if (this.button_Select_level.isInside(Inputhandler.mouse)) { // кнопка TUTORIAL
        this.button_Select_level.color = this.color2;
        if (Inputhandler.shoot) {
            Inputhandler.shoot = false;
            this.game.status = this.game.STATUS.SELECT_LEVEL;
        }
    }
    else
        this.button_Select_level.color = this.color1;
	
	if (this.button_Settings.isInside(Inputhandler.mouse)) { // кнопка TUTORIAL
        this.button_Settings.color = this.color2;
        if (Inputhandler.shoot) {
            Inputhandler.shoot = false;
            this.game.status = this.game.STATUS.SETTINGS;
        }
    }
    else
        this.button_Settings.color = this.color1;

    if (this.button_Tutorial.isInside(Inputhandler.mouse)) { // кнопка TUTORIAL
        this.button_Tutorial.color = this.color2;
        if (Inputhandler.shoot) {
            this.game.status = this.game.STATUS.TUTORIAL;
        }
    }
    else
        this.button_Tutorial.color = this.color1; 
}

// отрисовка меню
Main_Menu.prototype.draw = function(screen) {
	screen.font = "35px " + this.game.font;
    screen.drawImage(this.background, 0, 0, this.game.gameSize.width, this.game.gameSize.height); // Фон
    this.button_Play.draw(screen); // кнопка PLAY
    this.button_Select_level.draw(screen);
	this.button_Settings.draw(screen);
    this.button_Tutorial.draw(screen); // кнопка TUTORIAL
}

/*
Main_Menu.prototype.loading = function(screen) {
    var X = this.game.gameSize.width / 2;
    var Y = this.game.gameSize.height / 2;

	console.log(111);
    screen.fillStyle = "black";
    screen.fillRect(0,0,200,400);
    screen.fillText("LOADING...", X, Y);
}
*/