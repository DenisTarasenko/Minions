/**
 * Created by user on 12.06.2015.
 */
/*
 наше Окно выбор уровня
 */

var Select_Level = function(Game) {
    this.game = Game;
    this.buttonSize = {
        width: Game.gameSize.width / 11,
        height: Game.gameSize.height / 12
    };
    this.ImgButtSize = {
        width: this.buttonSize.width * 2.5,
        height: this.buttonSize.height * 2.5
    };
    this.button_center_X = Game.gameSize.width / 2 - this.ImgButtSize.width / 2;

	this.color1 = "black";
	this.color2 = "white";
	
    this.button_Back = new Button(10, 10, this.buttonSize.width, 29, this.color1, "BACK");

    this.image_g_f = new Image();
    this.image_g_f.src = "Images/Menu/land_grass_field.png";
    this.button_Level_g_f = new Button(this.button_center_X, 15, this.ImgButtSize.width, this.ImgButtSize.height, this.image_g_f);

    this.image_g_m = new Image();
    this.image_g_m.src = "Images/Menu/land_grass_mountain.png";
    this.button_Level_g_m = new Button(this.button_center_X, this.button_Level_g_f.pos.y + this.ImgButtSize.height + 30, this.ImgButtSize.width, this.ImgButtSize.height, this.image_g_m);

    this.image_e_f = new Image();
    this.image_e_f.src = "Images/Menu/land_egypt_field.png";
    this.button_Level_e_f = new Button(this.button_center_X, this.button_Level_g_m.pos.y + this.ImgButtSize.height + 30, this.ImgButtSize.width, this.ImgButtSize.height, this.image_e_f);

    this.image_e_m = new Image();
    this.image_e_m.src = "Images/Menu/land_egypt_mountain.png";
    this.button_Level_e_m = new Button(this.button_center_X, this.button_Level_e_f.pos.y + this.ImgButtSize.height + 30, this.ImgButtSize.width, this.ImgButtSize.height, this.image_e_m);

    this.background1 = new Image();
    this.background1.src = "Images/Menu/select_level_1.png";

    this.background2 = new Image();
    this.background2.src = "Images/Menu/select_level_2.png";
}

// обновление меню
Select_Level.prototype.update = function(Inputhandler) {
    if (Inputhandler.esc) // проверка ESC
        this.game.status = this.game.STATUS.MAIN_MENU;

    if (this.button_Back.isInside(Inputhandler.mouse)) { // кнопка BAACK
        this.button_Back.color = this.color2;
        if (Inputhandler.shoot)
            this.game.status = this.game.STATUS.MAIN_MENU;
    }
    else
        this.button_Back.color = this.color1;

    if (this.button_Level_g_f.isInside(Inputhandler.mouse)) { // кнопка TUTORIAL
        if (Inputhandler.shoot) {
            this.game.land_type.world = this.game.LAND_TYPE.WORLD.GRASS;
            this.game.land_type.land = this.game.LAND_TYPE.LAND.FIELD;
            this.button_Level_g_f.color = "red";
            this.button_Level_g_m.color = "yellow";
            this.button_Level_e_f.color = "yellow";
            this.button_Level_e_m.color = "yellow";
            this.game.init();
            this.game.status = this.game.STATUS.PLAY;
            this.game.audio.happy.pause();
            this.game.audio.happy.load();
        }
    }

    if (this.button_Level_g_m.isInside(Inputhandler.mouse)) { // мир 1
        if (Inputhandler.shoot) {
            this.game.land_type.world = this.game.LAND_TYPE.WORLD.GRASS;
            this.game.land_type.land = this.game.LAND_TYPE.LAND.MOUNTAIN;
            this.button_Level_g_f.color = "yellow";
            this.button_Level_g_m.color = "red";
            this.button_Level_e_f.color = "yellow";
            this.button_Level_e_m.color = "yellow";
            this.game.init();
            this.game.status = this.game.STATUS.PLAY;
            this.game.audio.happy.pause();
            this.game.audio.happy.load();
        }
    }

    if (this.button_Level_e_f.isInside(Inputhandler.mouse)) { // мир 2
        if (Inputhandler.shoot) {
            this.game.land_type.world = this.game.LAND_TYPE.WORLD.EGYPT;
            this.game.land_type.land = this.game.LAND_TYPE.LAND.FIELD;
            this.button_Level_g_f.color = "yellow";
            this.button_Level_g_m.color = "yellow";
            this.button_Level_e_f.color = "red";
            this.button_Level_e_m.color = "yellow";
            this.game.init();
            this.game.status = this.game.STATUS.PLAY;
            this.game.audio.happy.pause();
            this.game.audio.happy.load();
        }
    }

    if (this.button_Level_e_m.isInside(Inputhandler.mouse)) { // мир 3
        if (Inputhandler.shoot) {
            this.game.land_type.world = this.game.LAND_TYPE.WORLD.EGYPT;
            this.game.land_type.land = this.game.LAND_TYPE.LAND.MOUNTAIN;
            this.button_Level_g_f.color = "yellow";
            this.button_Level_g_m.color = "yellow";
            this.button_Level_e_f.color = "yellow";
            this.button_Level_e_m.color = "red";
            this.game.init();
            this.game.status = this.game.STATUS.PLAY;
            this.game.audio.happy.pause();
            this.game.audio.happy.load();
        }
    }
}

// отрисовка меню
Select_Level.prototype.draw = function(screen) {
    screen.fillStyle = "white";
    screen.fillRect(0,0,this.game.gameSize.width, this.game.gameSize.height);

	screen.font = "35px " + this.game.font;
    this.button_Back.draw(screen); // кнопка BAACK
    this.button_Level_g_f.draw(screen);
    this.button_Level_g_m.draw(screen);
    this.button_Level_e_f.draw(screen);
    this.button_Level_e_m.draw(screen);

    screen.drawImage(this.background1, this.button_center_X - this.background1.width + 2, this.game.gameSize.height - this.background1.height, this.background1.width, this.background1.height); // Фон
    screen.drawImage(this.background2, this.button_center_X + this.ImgButtSize.width - 10, this.game.gameSize.height - this.background2.height, this.background2.width, this.background2.height); // Фон
}