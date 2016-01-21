/*
 наше Окно настройки
 */

var Settings = function(Game) {
    this.game = Game;
    this.buttonSize = {
        width: Game.gameSize.width / 11,
        height: 29
    };
	
	this.color1 = "black";
	this.color2 = "white";

	this.button_Back = new Button(10, 10, this.buttonSize.width, 29, this.color1, "BACK");
	
    this.button_Time_UP = new Button(Game.gameSize.width / 2 + 40, 150, 50, 25, this.color1, ">>");
	this.button_Time_DOWN = new Button(Game.gameSize.width / 2 - 90, 150, 50, 25, this.color1, "<<");
	
	this.button_Towers_UP = new Button(Game.gameSize.width / 2 + 40, this.button_Time_DOWN.pos.y + 150, 50, 25, this.color1, ">>");
	this.button_Towers_DOWN = new Button(Game.gameSize.width / 2 - 90, this.button_Time_DOWN.pos.y + 150, 50, 25, this.color1, "<<");
	
	this.button_Lives_UP = new Button(Game.gameSize.width / 2 + 40, this.button_Towers_DOWN.pos.y + 150, 50, 25, this.color1, ">>");
	this.button_Lives_DOWN = new Button(Game.gameSize.width / 2 - 90, this.button_Towers_DOWN.pos.y + 150, 50, 25, this.color1, "<<");

    this.button_Sound = new Button(Game.gameSize.width / 2 - 40, this.button_Lives_DOWN.pos.y + 150, 80, 25, this.color1, "ON");
	
	this.background = new Image();
    this.background.src = "Images/Menu/settings.jpg";
}

// обновление меню
Settings.prototype.update = function(Inputhandler) {
	if (Inputhandler.esc) // проверка ESC
        this.game.status = this.game.STATUS.MAIN_MENU;

    if (this.button_Back.isInside(Inputhandler.mouse)) { // кнопка BAACK
        this.button_Back.color = this.color2;
        if (Inputhandler.shoot)
            this.game.status = this.game.STATUS.MAIN_MENU;
    }
    else
        this.button_Back.color = this.color1;
	
    if (this.button_Time_UP.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Time_UP.color = this.color2;
        if (Inputhandler.shoot) {
			Inputhandler.shoot = false;
			if (this.game.time_for_Round < 60)
				this.game.time_for_Round ++;
        }
    }
    else
        this.button_Time_UP.color = this.color1;
	
	    if (this.button_Time_DOWN.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Time_DOWN.color = this.color2;
        if (Inputhandler.shoot) {
			Inputhandler.shoot = false;
			if (this.game.time_for_Round > 5)
				this.game.time_for_Round --;
        }
    }
    else
        this.button_Time_DOWN.color = this.color1;
	
	if (this.button_Towers_UP.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Towers_UP.color = this.color2;
        if (Inputhandler.shoot) {
			Inputhandler.shoot = false;
			if (this.game.Towers_Amount < 10)
				this.game.Towers_Amount ++;
        }
    }
    else
        this.button_Towers_UP.color = this.color1;
	
	    if (this.button_Towers_DOWN.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Towers_DOWN.color = this.color2;
        if (Inputhandler.shoot) {
			Inputhandler.shoot = false;
			if (this.game.Towers_Amount > 1)
				this.game.Towers_Amount --;
        }
    }
    else
        this.button_Towers_DOWN.color = this.color1;

		if (this.button_Lives_UP.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Lives_UP.color = this.color2;
        if (Inputhandler.shoot) {
			Inputhandler.shoot = false;
			if (this.game.Lives_Amount < 10)
				this.game.Lives_Amount ++;
        }
    }
    else
        this.button_Lives_UP.color = this.color1;
	
	    if (this.button_Lives_DOWN.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Lives_DOWN.color = this.color2;
        if (Inputhandler.shoot) {
			Inputhandler.shoot = false;
			if (this.game.Lives_Amount > 1)
				this.game.Lives_Amount --;
        }
    }
    else
        this.button_Lives_DOWN.color = this.color1;

    if (this.button_Sound.isInside(Inputhandler.mouse)) { // кнопка PLAY
        this.button_Sound.color = this.color2;
        if (Inputhandler.shoot) {
            Inputhandler.shoot = false;
            if (this.button_Sound.text == "ON") {
                this.button_Sound.text = "OFF";
                this.game.audio.happy.muted = true;
                this.game.audio.PaPaPa.muted = true;
                this.game.audio.smeh.muted = true;
                this.game.audio.tuka.muted = true;
                this.game.audio.shoot.muted = true;
                this.game.audio.fairshow.muted = true;
            }
            else {
                this.button_Sound.text = "ON";
                this.game.audio.happy.muted = false;
                this.game.audio.PaPaPa.muted = false;
                this.game.audio.smeh.muted = false;
                this.game.audio.tuka.muted = false;
                this.game.audio.shoot.muted = false;
                this.game.audio.fairshow.muted = false;
            }
        }
    }
    else
        this.button_Sound.color = this.color1;
}

// отрисовка меню
Settings.prototype.draw = function(screen) {
	screen.font = "35px " + this.game.font;
	screen.textAlign = "center";
    screen.drawImage(this.background, 0, 0, this.game.gameSize.width, this.game.gameSize.height); // Фон
	
	screen.font = "35px " + this.game.font;
    this.button_Back.draw(screen); // кнопка BAACK
    
	screen.fillStyle = "black";
	screen.fillText("Set time for round", this.game.gameSize.width / 2, this.button_Time_DOWN.pos.y - this.button_Time_DOWN.size.height);
	screen.fillText(this.game.time_for_Round.toString(), this.game.gameSize.width / 2, this.button_Time_DOWN.pos.y + this.button_Time_DOWN.size.height);
	
	screen.fillText("Set number minions per team", this.game.gameSize.width / 2, this.button_Towers_DOWN.pos.y - this.button_Towers_DOWN.size.height);
	screen.fillText(this.game.Towers_Amount.toString(), this.game.gameSize.width / 2, this.button_Towers_DOWN.pos.y + this.button_Towers_DOWN.size.height);
	
	screen.fillText("Set lives per minion", this.game.gameSize.width / 2, this.button_Lives_DOWN.pos.y - this.button_Lives_DOWN.size.height);
	screen.fillText(this.game.Lives_Amount.toString(), this.game.gameSize.width / 2, this.button_Lives_DOWN.pos.y + this.button_Lives_DOWN.size.height);

    screen.fillText("Sound", this.game.gameSize.width / 2, this.button_Sound.pos.y - this.button_Sound.size.height);

	this.button_Time_DOWN.draw(screen);
	this.button_Time_UP.draw(screen);

	this.button_Towers_DOWN.draw(screen);
	this.button_Towers_UP.draw(screen);
	
	this.button_Lives_DOWN.draw(screen);
	this.button_Lives_UP.draw(screen);

    this.button_Sound.draw(screen);
}