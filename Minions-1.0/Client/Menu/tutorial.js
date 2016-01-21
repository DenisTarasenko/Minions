/**
 * Created by user on 24.05.2015.
 */
/*
    наше Окно туториала
 */

var Tutorial = function(Game) {
    this.game = Game;
    this.buttonSize = {
        width: Game.gameSize.width / 11,
        height: Game.gameSize.height / 12
    };
    this.center_X = Game.gameSize.width / 2;
	
    this.color1 = "black";
	this.color2 = "white";
	
    this.button_Back = new Button(10, 10, this.buttonSize.width, 29, this.color1, "BACK");

    this.button_Lang = new Button(this.game.gameSize.width - 200, 10, this.buttonSize.width + 60, 20, this.color1, "ENG -> RUS");

    this.text_EN = [
        "LEFT - move left",
        "RIGHT - move right",
        "SPACE - jump",
        "UP - move up gun",
        "DOWN - move down gun",
        "ENTER - shoot (than longer you hold, than stronger the shoot)",
        "W - weapons' selection",
        "ESC - pause",
        "",
        "",
        "Arrows shows wind direction and power (from 1 to 5)",
        "Clouds moves towards wind",
        "",
        "You may use mouse to control the gun", //
        "",
        "Bullet hit in the enemy minion takes 2 lives from him",
        "Blast hit in the enemy minion takes 1 live from him",
        "Bullet hit in the friendly minion gives him 1 live"
    ];

    this.text_RU = [
        "LEFT - движение влево",
        "RIGHT - движение вправо",
        "SPACE - прыжок",
        "UP - поднять дуло",
        "DOWN - опустить дуло",
        "ENTER - выстрел (чем дольше держишь, тем сильнее выстрел)",
		"W - выбор оружия",
        "ESC - пауза",
        "",
        "",
        "Стрелочки указывают направление и силу ветра (от 1 до 5)",
        "Облака движутся по направлению ветра",
        "",
        "Мышью также можно управлять оружием",
        "",
		"Попадание пули во вражеского миньона отнимает у него 2 жизни",
		"Попадание во вражеского миньона взрывной волной отнимает у него 1 жизнь",
		"Попадание пули в дружественного миньона добавляет ему 1 жизнь"
    ];

    this.text = this.text_EN;

    this.background1 = new Image();
    this.background1.src = "Images/Menu/tutorial_1.png";

    this.background2 = new Image();
    this.background2.src = "Images/Menu/tutorial_2.jpg";
}

// обновление меню
Tutorial.prototype.update = function(Inputhandler) {
    if (Inputhandler.esc) // проверка ESC
        this.game.status = this.game.STATUS.MAIN_MENU;

    if (this.button_Back.isInside(Inputhandler.mouse)) { // кнопка BAACK
        this.button_Back.color = this.color2;
        if (Inputhandler.shoot)
            this.game.status = this.game.STATUS.MAIN_MENU;
    }
    else
        this.button_Back.color = this.color1;

    if (this.button_Lang.isInside(Inputhandler.mouse)) { // кнопка BAACK
        this.button_Lang.color = this.color2;
        if (Inputhandler.shoot) {
            Inputhandler.shoot = false;
            if (this.button_Lang.text == "ENG -> RUS") {
                this.button_Lang.text = "RUS -> ENG";
                this.text = this.text_RU;
            }
            else {
                this.button_Lang.text = "ENG -> RUS";
                this.text = this.text_EN;
            }
        }
    }
    else
        this.button_Lang.color = this.color1;
}

// отрисовка меню
Tutorial.prototype.draw = function(screen) {
    screen.fillStyle = "white";
    screen.fillRect(0,0,this.game.gameSize.width, this.game.gameSize.height);
    screen.drawImage(this.background1, 80, 0, this.background1.width / 2, this.background1.height / 2); // Фон
    screen.drawImage(this.background2, this.game.gameSize.width - this.background2.width / 2, this.game.gameSize.height - this.background2.height / 2, this.background2.width / 2, this.background2.height / 2); // Фон

	screen.font = "35px " + this.game.font;
    this.button_Back.draw(screen); // кнопка BAACK
    screen.font = "25px " + this.game.font;
    this.button_Lang.draw(screen);

    var space = 100;
	screen.font = "20px " + this.game.font;
    screen.fillStyle = "black";
	screen.textAlign = "center";
    for (var i = 0; i < this.text.length; i++) { // Текст
        screen.fillText(this.text[i], this.center_X, space);
        space += 25;
    }
	
	screen.font = "15px " + this.game.font;
	screen.fillText("Deweloped by Denis Tarasenko.	Dezigned by Polly Korzhennko.	Almost all rights reserved :)", this.game.gameSize.width / 2, this.game.gameSize.height - 15);
}