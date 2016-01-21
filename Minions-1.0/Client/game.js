/*
	Описнаие объектра Game
		здесь мы завяжем всех игроков и игровые объекты
*/

var Game = function(fondId, landId, updTime) {
    this.canvasWidth = 1280;
    this.canvasHeight = 720;

	this.canvas = document.getElementById(fondId); // фон, главный экран (видимый)
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.screen = this.canvas.getContext('2d');

	this.landCanvas = document.getElementById(landId); // экран земли
    this.landCanvas.width = this.canvasWidth;
    this.landCanvas.height = this.canvasHeight;
	this.landScreen = this.landCanvas.getContext('2d');

    this.updTime = updTime; // время кадра

	this.gameSize = {
		width: this.canvas.width,
		height: this.canvas.height
	};
	this.G = 0.15; // ускорене свободного падения

    this.audio = {
        happy: document.getElementById("Happy"), //
        //PaPaPa: document.getElementById("PaPaPa"),
        //smeh: document.getElementById("Smeh"),
        tuka: document.getElementById("Tuka"), //
        //shoot: document.getElementById("Shoot"), //
        //fairshow: document.getElementById("Fairshow")
    };
    this.audio.happy.play();
    this.audio.happy.loop = true;
    this.audio.tuka.loop = true;

	this.time_for_Round = 20;
	this.Towers_Amount = 3;
	this.Lives_Amount = 5;
	
	this.allDown = true; // можно следующий ход
    this.font = "Snap ITC";

    this.WIN = {
        NONE: 0,
        PLAYER_1: 1,
        PLAYER_2: 2
    };
    this.win = this.WIN.NONE;

    this.LAND_TYPE = {
        WORLD : {
            GRASS: 0,
            EGYPT: 1
        },
        LAND: {
            FIELD: 0,
            MOUNTAIN: 1
        }
    };
    this.land_type = {
        world: this.LAND_TYPE.WORLD.GRASS,
        land: this.LAND_TYPE.LAND.FIELD
    };

	this.inputhandler = new InputHandler(this.canvas); // ловитель ввода
    this.background = new Image();

    this.STATUS = {
        MAIN_MENU: 0,
        PLAY: 1,
		PAUSE: 2,

        SHOOT: 3, // сила выстрела
        BULLET: 4, // полет пули
        NEXT_TERN: 5, // следующий ход

        TUTORIAL: 6,
        SELECT_LEVEL: 7,
        GAME_OVER_1: 8,
        GAME_OVER_2: 9,
		SETTINGS: 10
	};
    this.status = this.STATUS.MAIN_MENU;

    this.main_menu = new Main_Menu(this);
    this.tutorial = new Tutorial(this);
    this.select_level = new Select_Level(this);
    this.pause = new Pause(this);
    this.interface = new Interface(this);
	this.game_over_1 = new Game_Over_1(this);
	this.game_over_2 = new Game_Over_2(this);
	this.settings = new Settings(this);
}

// обновление игры
Game.prototype.update = function() {
	switch (this.status) {
		case this.STATUS.PLAY:
            if (this.inputhandler.esc) { // меню паузы
                this.status = this.STATUS.PAUSE;
                this.inputhandler.esc = false;
            }
            this.clouds.update(this.wind);

            this.towers = [];
            this.playerUpd(this.Player1);
            this.playerUpd(this.Player2);
            this.nextTern();

            this.moveTower(); // подвинем башню
            this.setAngle(); // обновим угол
            if (!this.interface.update(this.inputhandler))
                this.tower.weapons[this.tower.WNum].update(this.inputhandler, 1); // выстрел                                        !!!!

            break;

        case this.STATUS.SHOOT:
            this.tower.setShootPower();

            if (this.inputhandler.esc) { // выключить выстрел
                this.status = this.STATUS.PLAY; //                                                                              !!!!!
                this.tower.weapons[this.tower.WNum].shooting = false;
                this.tower.shootPower = 0;
                this.tower.directionPower = true;
                this.inputhandler.esc = false;
                this.inputhandler.shoot = false;
            }

            if (!this.interface.update(this.inputhandler))
                this.tower.weapons[this.tower.WNum].update(this.inputhandler, 1); // выстрел                                        !!!!!
            this.clouds.update(this.wind);

            this.towers = [];
            this.playerUpd(this.Player1);
            this.playerUpd(this.Player2);

            this.nextTern();
            break;

        case this.STATUS.BULLET:
            this.tower.weapons[this.tower.WNum].update(this.inputhandler, 2); // если мы ее сейчас не удалили              !!!!!!
            this.clouds.update(this.wind);

            this.allDown = true;
            this.towers = [];
            if (this.playerUpd(this.Player1))
                this.win = this.WIN.PLAYER_2;
            if (this.playerUpd(this.Player2))
                this.win = this.WIN.PLAYER_1;
            break;

        case this.STATUS.NEXT_TERN:
            console.log("lol");
            switch (this.win) {
                case this.WIN.PLAYER_1:
                    this.status = this.STATUS.GAME_OVER_1;
                    break;

                case this.WIN.PLAYER_2:
                    this.status = this.STATUS.GAME_OVER_2;
                    break;

                case this.WIN.NONE:
                    if ((this.inputhandler.shoot) || (this.inputhandler.move)) {
                        this.nextTern();
                        this.status = this.STATUS.PLAY;
                        this.inputhandler.shoot = false;
                        this.inputhandler.move = false;
                    }
                    this.clouds.update(this.wind);
                    break;
            }
            break;

        case this.STATUS.PAUSE:
            this.pause.update(this.inputhandler);
            break;

        case this.STATUS.MAIN_MENU:
            this.main_menu.update(this.inputhandler);
            break;

        case this.STATUS.SELECT_LEVEL:
            this.select_level.update(this.inputhandler);
            break;

        case this.STATUS.TUTORIAL:
            this.tutorial.update(this.inputhandler);
            break;

        case this.STATUS.GAME_OVER_1:
            this.audio.tuka.play();
			this.game_over_1.update(this.inputhandler);
            break;

        case this.STATUS.GAME_OVER_2:
            this.audio.tuka.play();
            this.game_over_2.update(this.inputhandler);
            break;
			
		case this.STATUS.SETTINGS:
			this.settings.update(this.inputhandler);
			break;
    }
}

// отрисовка игры
Game.prototype.draw = function(screen, landScreen) {
    switch(this.status) {
        case this.STATUS.PLAY:
            screen.drawImage(this.background, 0, 0, this.gameSize.width, this.gameSize.height);

            this.clouds.draw(screen);
			
            screen.drawImage(this.landCanvas, 0, 0); // переносим землю на экран

            for (var i = 0, len = this.towers.length; i < len; i++) // все башни
                this.towers[i].draw(screen); // рисуем башню

            this.interface.draw(screen);
            break;

        case this.STATUS.SHOOT:
            screen.drawImage(this.background, 0, 0, this.gameSize.width, this.gameSize.height);
            this.clouds.draw(screen);
			
            screen.drawImage(this.landCanvas, 0, 0); // переносим землю на экран

            for (i = 0, len = this.towers.length; i < len; i++) // все башни
                this.towers[i].draw(screen); // рисуем башню
            this.interface.draw(screen);
            break;

        case this.STATUS.BULLET:
            screen.drawImage(this.background, 0, 0, this.gameSize.width, this.gameSize.height);
            this.clouds.draw(screen);

            if (this.land.updateDraw(this.land.blocks, this.G, landScreen)) // обновляем и рисуем землю
                this.tower.weapons[this.tower.WNum].boom.done = true;
            screen.drawImage(this.landCanvas, 0, 0); // переносим землю на экран

            for (i = 0, len = this.towers.length; i < len; i++) // все башни
                this.towers[i].draw(screen); // рисуем башню
            this.tower.weapons[this.tower.WNum].draw(screen); // рисуем                                                     !!!!!
            break;

        case this.STATUS.NEXT_TERN:
            screen.drawImage(this.background, 0, 0, this.gameSize.width, this.gameSize.height);
            this.clouds.draw(screen);
            screen.drawImage(this.landCanvas, 0, 0); // переносим землю на экран
            for (i = 0, len = this.towers.length; i < len; i++) // все башни
                this.towers[i].draw(screen); // рисуем башню

            screen.fillStyle = 'rgba(10, 100, 0, 0.3)';
            screen.fillRect(0, 0, this.gameSize.width, this.gameSize.height);

            screen.fillStyle = "red";
            screen.font = "30px " + this.font;
            screen.fillText("Get Ready!", this.gameSize.width / 2, this.gameSize.height / 2);
            break;

        case this.STATUS.PAUSE:
            this.pause.draw(screen);
            break;

        case this.STATUS.MAIN_MENU:
            this.main_menu.draw(screen);
            break;

        case this.STATUS.SELECT_LEVEL:
            this.select_level.draw(screen);
            break;

        case this.STATUS.TUTORIAL:
            this.tutorial.draw(screen);
            break;

        case this.STATUS.GAME_OVER_1:
            this.game_over_1.draw(screen);
            break;

        case this.STATUS.GAME_OVER_2:
            this.game_over_2.draw(screen);
            break;
			
		case this.STATUS.SETTINGS:
            this.settings.draw(screen);
            break;
    }

}

// инициализация игры
Game.prototype.init = function() {
    this.screen.clearRect(0, 0, this.gameSize.width, this.gameSize.height);
    this.landScreen.clearRect(0, 0, this.gameSize.width, this.gameSize.height);

    this.clouds = new Clouds(this); // облака

    if (this.land_type.world == this.LAND_TYPE.WORLD.GRASS) {
        this.background.src = "Images/background_grass.jpg";
        this.clouds.init_Grass();
    }
    else {
        this.background.src = "Images/background_egypt.jpg";
        this.clouds.init_Egypt();
    }

    this.win = this.WIN.NONE;
    this.time = this.time_for_Round; // время раудна
    this.RoundTime = this.time_for_Round;
	this.switcher = 0; //переключатель игроков
	this.wind = Math.random() * (0.2) - 0.1; // ветер

	this.land = new Land(this);
    this.land.init(this.landScreen, this.land_type, this.LAND_TYPE);

	this.Player1 = {
		now: 0,
		towers: []
	};
	this.Player2 = {
		now: 0,
		towers: []
	};
	for (var i = 0; i < 2 * this.Towers_Amount; i++)
		if (i % 2) { // правые
			this.Player2.towers.push(new Tower(this, this.land, -1));
			this.Player2.towers[this.Player2.now].init(this.land.size, this.land.blocks, this.land.blockSize);
			this.Player2.now++;
		}
		else { // левые
			this.Player1.towers.push(new Tower(this, this.land, 1));
			this.Player1.towers[this.Player1.now].init(this.land.size, this.land.blocks, this.land.blockSize);
			this.Player1.now++;
		}
		this.Player1.now = 0;
		this.Player2.now = -1;
	this.tower = this.Player1.towers[0];
}

// следующий ход
Game.prototype.nextTern = function() {
    if (!this.RoundTime) { // ход закончился, обнулим, ходит след игрок
        this.time = this.time_for_Round + this.updTime;
        this.tower.shootPower = 0;
        this.tower.directionPower = true;
		this.interface.show = false;
        this.status = this.STATUS.NEXT_TERN;
        this.inputhandler.shoot = false;
        if (this.switcher) {
            this.setTower(this.Player1);
            this.switcher = 0;
        }
        else {
            this.setTower(this.Player2);
            this.switcher = 1;
        }
        this.wind = Math.random() * (0.2) - 0.1; // ветер
    }

    this.time -= this.updTime; // ситаем время
    this.RoundTime = Math.ceil(this.time);
}

// обнвлние игрока
Game.prototype.playerUpd = function(Player) {
    var allDead = true;
    for (var i = 0, len = Player.towers.length; i < len; i++)
        if (Player.towers[i].lives)
            allDead = false;

	for (i = 0, len = Player.towers.length; i < len; i++) {
        if (Player.towers[i].V.x || Player.towers[i].V.y)
            this.allDown = false;
        Player.towers[i].update(this.G); // обновим
        this.towers.push(Player.towers[i]);
    }
	if (allDead)
        return true;
    return false;
}

// выбор башни
Game.prototype.setTower = function(Player) {
    do {
        if (Player.now >= Player.towers.length - 1)
            Player.now = 0;
        else
            Player.now++;
    } while (!Player.towers[Player.now].lives);

	this.tower = Player.towers[Player.now];
}

// двигаем башню
Game.prototype.moveTower = function() {
    if (this.inputhandler.move) // если двигали
        this.tower.move(this.inputhandler.move, this.G); // двигаем
}

// устанавливаем угол дула
Game.prototype.setAngle = function() {
    if ((!this.tower.V.y) && (this.inputhandler.mouseMove))
        this.tower.setAngle(0, this.inputhandler.mouse);
    else
    if (this.inputhandler.angle)
        this.tower.setAngle(this.inputhandler.angle, this.inputhandler.mouse);
    this.inputhandler.mouseMove = false;
}