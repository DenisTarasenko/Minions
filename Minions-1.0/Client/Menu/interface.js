/**
 * Created by user on 14.06.2015.
 */
/*
 наше Окно нтерфейс: прозрачное, накладывается поверх экрана игры!
 */

var Interface = function(Game) {
    this.game = Game;
    this.buttonSize = {
        width: Game.gameSize.width / 11,
        height: Game.gameSize.height / 12
    };
	
    this.color1 = "black";
	this.color2 = "white";
	
	this.image_1 = new Image();
	this.image_1.src = "Images/Menu/Weapons/gun_1.png";
	
	this.image_2 = new Image();
	this.image_2.src = "Images/Menu/Weapons/gun_2.png";

    this.image_3 = new Image();
    this.image_3.src = "Images/Menu/Weapons/gun_3.png";

	this.show = false;
	
    this.button_Pause = new Button(10, 10, this.buttonSize.width, 25, this.color1, "PAUSE");
	
	this.button_Gun_1 = new Button(10, 10, 40, 25, this.image_1);
	this.button_Gun_2 = new Button(10, 10, 40, 25, this.image_2);
    this.button_Gun_3 = new Button(10, 10, 40, 25, this.image_3);
}

// обновление меню
Interface.prototype.update = function(Inputhandler) {
    if (this.button_Pause.isInside(Inputhandler.mouse)) { // кнопка BAACK
        this.button_Pause.color = this.color2;
        if (Inputhandler.shoot)
            this.game.status = this.game.STATUS.PAUSE;
        return true;
    }
    else
        this.button_Pause.color = this.color1;
	
	if (Inputhandler.W) {
		this.show = !this.show;
		Inputhandler.W = false;
	}
	
	this.button_Gun_1.pos.x = this.game.tower.pos.x + this.game.tower.size.width / 2 - this.button_Gun_1.size.width - 5;
	this.button_Gun_1.pos.y = this.game.tower.pos.y - this.button_Gun_1.size.height - 60;
	
	this.button_Gun_2.pos.x = this.game.tower.pos.x + this.game.tower.size.width / 2 + 5;
	this.button_Gun_2.pos.y = this.game.tower.pos.y - this.button_Gun_1.size.height - 60;

    this.button_Gun_3.pos.x = this.game.tower.pos.x + this.game.tower.size.width / 2  - this.button_Gun_1.size.width / 2;
    this.button_Gun_3.pos.y = this.game.tower.pos.y - 2 * this.button_Gun_1.size.height - 60;
	
	if (this.show) {
		if (this.button_Gun_1.isInside(Inputhandler.mouse)) { // кнопка BAACK
			this.button_Gun_1.color = this.color2;
			if (Inputhandler.shoot) {
                Inputhandler.shoot = false;
                this.game.tower.WNum = 0;
                this.show = false;
            }
            return true;
		}
		else
			this.button_Gun_1.color = this.color1;
		
		if (this.button_Gun_2.isInside(Inputhandler.mouse)) { // кнопка BAACK
			this.button_Gun_2.color = this.color2;
			if (Inputhandler.shoot) {
                Inputhandler.shoot = false;
                this.game.tower.WNum = 1;
                this.show = false;
            }
            return true;
		}
		else
			this.button_Gun_2.color = this.color1;

        if (this.button_Gun_3.isInside(Inputhandler.mouse)) { // кнопка BAACK
            this.button_Gun_3.color = this.color2;
            if (Inputhandler.shoot) {
                Inputhandler.shoot = false;
                this.game.tower.WNum = 2;
                this.show = false;
            }
            return true;
        }
        else
            this.button_Gun_3.color = this.color1;
	}
    return false;
}

// отрисовка меню
Interface.prototype.draw = function(screen) {
	screen.font = "18px " + this.game.font;
	
	screen.fillStyle = "white";
	screen.save();
	screen.shadowBlur=7;
    screen.shadowColor="black";
	screen.fillText("TIME LEFT: " + this.game.RoundTime, this.game.gameSize.width - 100, 30); // время раунда
    screen.restore();
	
	screen.fillStyle = "red";
	screen.fillText("!", this.game.tower.pos.x + this.game.tower.size.width / 2, this.game.tower.pos.y - 40); // кто сейчас ходит
	
	screen.font = "28px " + this.game.font;
    this.button_Pause.draw(screen); // кнопка BAACK
	
	if (this.show) {
		this.button_Gun_1.draw(screen);
		this.button_Gun_2.draw(screen);
        this.button_Gun_3.draw(screen);
	}
}