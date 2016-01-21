/*
    Описание обЪекта Tower
        это наша башня
 */

var Tower = function(Game, Land, Look) {
	this.game = Game;
    this.land = Land; // копируем землю
    this.look = Look; // куда смотрим

    this.WNum = 0;
    this.weapons = [];
    this.weapons[0] = new Gun_1(Game, this, Land);
    this.weapons[1] = new Gun_2(Game, this, Land);
    this.weapons[2] = new Gun_3(Game, this, Land);

    this.gun_Angle = 0;

    this.images = {
        jump_L: new Image(),
        jump_R: new Image(),
        moving_L: [],
        moving_R: [],
        stop: []
    };

    if (this.look == 1) {
        for (var i = 1; i <= 13; i++) {
            this.images.stop[i - 1] = new Image();
            this.images.stop[i - 1].src = "Images/Minions/Evil/Minion Stop/Minion_Stop_0" + i + ".png";
        }
        for (i = 1; i <= 8; i++) {
            this.images.moving_L[i - 1] = new Image();
            this.images.moving_L[i - 1].src = "Images/Minions/Yellow/Minion Moving_L/Minion_Moving_0" + i + ".png";
        }
        for (i = 1; i <= 8; i++) {
            this.images.moving_R[i - 1] = new Image();
            this.images.moving_R[i - 1].src = "Images/Minions/Yellow/Minion Moving_R/Minion_Moving_0" + i + ".png";
        }
        this.images.jump_L.src = "Images/Minions/Yellow/Minion Moving_L/Minion_Moving_03.png";
        this.images.jump_R.src = "Images/Minions/Yellow/Minion Moving_R/Minion_Moving_03.png";

        this.size = {
            width: this.images.moving_R[0].width / 2.5,
            height: this.images.moving_R[0].height / 2.5
        };
        this.gun_Angle =  -0.5;
        this.color = "yellow";
	}
	else {
        for (i = 1; i <= 9; i++) {
            this.images.stop[i - 1] = new Image();
            this.images.stop[i - 1].src = "Images/Minions/Yellow/Minion Stop/Minion_Stop_0" + i + ".png";
        }
        for (i = 1; i <= 8; i++) {
            this.images.moving_L[i - 1] = new Image();
            this.images.moving_L[i - 1].src = "Images/Minions/Evil/Minion Moving_L/Minion_Moving_0" + i + ".png";
        }
        for (i = 1; i <= 8; i++) {
            this.images.moving_R[i - 1] = new Image();
            this.images.moving_R[i - 1].src = "Images/Minions/Evil/Minion Moving_R/Minion_Moving_0" + i + ".png";
        }
        this.images.jump_L.src = "Images/Minions/Evil/Minion Moving_L/Minion_Moving_01.png";
        this.images.jump_R.src = "Images/Minions/Evil/Minion Moving_R/Minion_Moving_01.png";

        this.size = {
            width: this.images.moving_R[0].width / 7,
            height: this.images.moving_R[0].height / 7
        };
        this.gun_Angle = Math.PI + 0.5;
        this.color = "purple";
	}

    this.pos = {
        x: 0,
        y: 0
    };

    this.V = {
        x: 0,
        y: 0
    };

    this.gradient = new Image();
    this.gradient.src = "Images/gradient.jpg";

    this.shootPower = 0;
    this.directionPower = true;
    this.translatePoint = {
        x: 0,
        y: 0
    };

    this.count = 0;
    this.fallHeight = 0; // высота, с которой падает башня (для дамага)
    this.lives = Game.Lives_Amount;
    this.isMove = 0;
}

// обновление башни
Tower.prototype.update = function(G) {
    this.setTranslatePoint();
    if (this.towerMove(this.land.blocks, this.land.blockSize, G)) // не падаем
        this.isMove = 0;

    if (!this.lives)
        if (this.color == "yellow") {
            this.size.width = 348 / 5.5;
            this.size.height = 445 / 5.5;
        }
        else {
            this.size.width = 72 / 2.5;
            this.size.height = 121 / 2.5;
        }
}

// отрисовка башни, аналогично отрисовки земли
Tower.prototype.draw = function(screen) {
    //screen.strokeRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    if (this.lives) {
        switch (this.isMove) { // рисуем разные рисунки (идем, тоим, прыгаем)
            case 0:
                if (this.look == 1)
                    screen.drawImage(this.images.moving_R[0], this.pos.x, this.pos.y, this.size.width, this.size.height);
                else
                    screen.drawImage(this.images.moving_L[0], this.pos.x, this.pos.y, this.size.width, this.size.height);
                break;
            case -1:
                screen.drawImage(this.images.moving_L[Math.floor(this.count)], this.pos.x, this.pos.y, this.size.width, this.size.height);

                if (Math.ceil(this.count) < this.images.moving_L.length)
                    this.count += 0.2;
                else
                    this.count = 0;
                break;
            case 1:
                screen.drawImage(this.images.moving_R[Math.floor(this.count)], this.pos.x, this.pos.y, this.size.width, this.size.height);

                if (Math.ceil(this.count) < this.images.moving_R.length)
                    this.count += 0.2;
                else
                    this.count = 0;
                break;
            case 2:
                if (this.look == 1)
                    screen.drawImage(this.images.jump_R, this.pos.x, this.pos.y, this.size.width, this.size.height);
                else
                    screen.drawImage(this.images.jump_L, this.pos.x, this.pos.y, this.size.width, this.size.height);
                break
        }

        screen.save();
        screen.translate(this.translatePoint.x, this.translatePoint.y);
        screen.rotate(this.gun_Angle);

        this.weapons[this.WNum].draw_gun(screen);
        screen.drawImage(this.gradient, 0, 0, this.shootPower * 5, 10, this.weapons[this.WNum].size.width - 8, -5, this.shootPower * 5, 10); // сила выстрела
        screen.restore();

        screen.fillStyle = "red";
        screen.textAlign = "center";
		screen.font = "20px " + this.game.font;
        screen.fillText(this.lives.toString(), this.pos.x + this.size.width / 2, this.pos.y - 15); // жизни
    }
    else {
        screen.drawImage(this.images.stop[Math.floor(this.count)], this.pos.x, this.pos.y, this.size.width, this.size.height);

        if (Math.ceil(this.count) < this.images.stop.length)
            this.count += 0.2;
        else
            this.count = 0;
    }
}

// первое создание башни, инициализация
Tower.prototype.init = function(size, blocks, blockSize) {
	if (this.look == 1)
		this.pos.x = Math.floor(Math.random() * (size.width / 2 - this.size.width - size.width / 20) + size.width / 20); // где-то слева
    else
		this.pos.x = Math.floor(Math.random() * (size.width - this.size.width - size.width / 20 - size.width / 2) + size.width / 2); // где-то справа
	
	var i = Math.floor(this.pos.x / blockSize); // нашли ячейку
    this.pos.y = blocks[i][blocks[i].length - 1].y - this.land.size.height / 7.5; // чуть выше холма
}

// падение башни
Tower.prototype.towerMove = function(blocks, blockSize, G) {
	var bottom = this.pos.y + this.size.height; // низ башни
	var i = Math.floor((this.pos.x + this.size.width / 2) / blockSize); // нашли ячейку
	
    if (blocks.length > 0) {  // если есть блоки
		if (bottom >= blocks[i][blocks[i].length - 1].y) { // если низ башни на уровне или ниже блока
			if (this.V.y){ // если она падала
				var H = Math.floor(this.fallHeight / (this.land.size.height / 8)); // считаем сколько жизней отнять

				if (H >= this.lives)
					this.lives = 0;	
				else
					this.lives -= H; // отнимаем

				this.V.x = 0;
				this.V.y = 0; // обнуляем скорость по Y
				this.fallHeight = 0; // обнуляем расстояние падения
				
				bottom = this.pos.y + this.size.height; // низ башни новый
				i = Math.floor((this.pos.x + this.size.width / 2) / blockSize); // нашли ячейку
				var gap = bottom - blocks[i][blocks[i].length - 1].y; // разница
				if (gap > 0) // если бвшня в текстуре
					this.pos.y -= gap; // то поднимем ее
			}
			return true; // не добавляли
		}
	}
	else {
		if (bottom >= this.land.size.height) {// если башня стоит на самом низу
			if (this.V.y){
				var H = Math.floor(this.fallHeight / (this.land.size.height / 8)); // считаем сколько жизней отнять
	
				if (H >= this.lives)
					this.lives = 0;
				else
					this.lives -= H; // отнимаем
				
				this.V.x = 0;
				this.V.y = 0; // обнуляем скорость по Y
				this.fallHeight = 0; // обнуляем расстояние падения
				
				bottom = this.pos.y + this.size.height; // низ башни новый
				i = Math.floor((this.pos.x + this.size.width / 2) / blockSize); // нашли ячейку
				var gap = bottom - blocks[i][blocks[i].length - 1].y; // разница
				if (gap > 0) // если бвшня в текстуре
					this.pos.y -= gap; // то поднимем ее
			}
			return true; // не добавляли
		}
	}
	
	if (this.V.y > 0) // если падаем вниз
		this.fallHeight += this.V.y; // увеличим расстояние падения
	else
		this.fallHeight = 0;
	
	if (this.V.x > 0) { // если скорость вправо
		//if (this.land.blocks[i + 1].length - this.land.blocks[i].length < 5) // ближняя ячейка
			if (this.pos.x + this.size.width <= this.land.size.width - this.V.x - 1) // размер экрана
				this.pos.x += this.V.x; // двигаемся
	}
	else
		if (this.V.x < 0) // если скорость влево
			//if (this.land.blocks[i - 1].length - this.land.blocks[i].length > 0) // ближняя ячейка
				if (this.pos.x >= -this.V.x + 1) // размер экрана
					this.pos.x += this.V.x; // двигаемся
	
	this.V.y += G; // добавим ускорение по Y, и башня начнет падат
	this.pos.y += this.V.y; // ПАДАЕМ

	bottom = this.pos.y + this.size.height; // низ башни новый
	i = Math.floor((this.pos.x + this.size.width / 2) / blockSize); // нашли ячейку
	var gap = bottom - blocks[i][blocks[i].length - 1].y; // разница
	if (gap > 0) // если бвшня в текстуре
		this.pos.y -= gap; // то поднимем ее
	
	return false; // скажем, что добавили
}

// угол для дула и выстрела
Tower.prototype.setAngle = function(trigger, mouse) {
	switch (trigger) {
		case 0: // установим по мышке
			var kat1 = this.pos.y + 3 - mouse.y; // высота
    
			if (this.look == 1) { // если смотрим вправо
				var kat2 = mouse.x - (this.pos.x + this.size.width - 3);
				if (kat2 > 0)
					this.gun_Angle = -Math.atan(kat1 / kat2);
			}
			else { // если смотрим влево
				kat2 = mouse.x - this.pos.x + 3;
				if (kat2 < 0)
					this.gun_Angle = Math.PI - Math.atan(kat1 / kat2);
			}
			break;
		case 1: // поднимем
			if (this.look == 1) {
				if (this.gun_Angle > -Math.PI / 2 + 0.1)
					this.gun_Angle -= 0.1;
			}
			else {
				if (this.gun_Angle < 3 * Math.PI / 2 - 0.1)
					this.gun_Angle += 0.1;
			}
			break;
		case -1: // опустим
			if (this.look == 1) {
				if (this.gun_Angle < Math.PI / 2 - 0.1)
					this.gun_Angle += 0.1;
			}
			else {
				if (this.gun_Angle > Math.PI / 2 + 0.1)
					this.gun_Angle -= 0.1;
			}
			break
	}
    
}

// движение башни
Tower.prototype.move = function(move, G) {
	var i = Math.floor((this.pos.x + this.size.width / 2) / this.land.blockSize); // нашли ячейку

    if (this.V.y <= 2 * G) { // если не падаем, то можно подвигаться ????????????????????????????????????????????????????????????????????????????????????????????????????
        switch (move) {
            case -1: // ВЛЕВО
                if (this.pos.x >= this.land.blockSize + 1) { // двигаемся влево
                    if (this.look == 1) { // если смотрели в другую сторону, просто повернемся
                        this.look = -1;
                        this.gun_Angle = Math.PI - this.gun_Angle;
                    }
                    else { // двинемся
                        var temp = this.land.blocks[i - 1].length - this.land.blocks[i].length;
                        if (temp <= 0) {
                            this.pos.x -= this.land.blockSize / 2;
                            this.fallHeight = 0;
                        }
                        else
                            switch (temp) {
                                case 1:
                                    if (this.pos.y + this.size.height >= this.land.blocks[i][this.land.blocks[i].length - 1].y)
                                        this.pos.y -= this.land.blockSize;
                                    this.pos.x -= this.land.blockSize / 2;
                                    this.fallHeight = 0;
                                    break;
                                case 2:
                                    if (this.pos.y + this.size.height >= this.land.blocks[i][this.land.blocks[i].length - 1].y)
                                        this.pos.y -= 2 * this.land.blockSize;
                                    this.pos.x -= this.land.blockSize / 2;
                                    this.fallHeight = 0;
                                    break
                            }
                    }
                }
                this.isMove = -1;
                break;

            case 1: // ВПРАВО
                if (this.pos.x + this.size.width <= this.land.size.width - this.land.blockSize - 1) { // двигаемся вправо
                    if (this.look == -1) { // если смотрели в другую сторону, просто повернемся
                        this.look = 1;
                        this.gun_Angle = Math.PI - this.gun_Angle;
                    }
                    else { // двинемся
                        temp = this.land.blocks[i + 1].length - this.land.blocks[i].length; // разница в блоках там, куда мы двигаемся
                        if (temp <= 0) {
                            this.pos.x += this.land.blockSize / 2;
                            this.fallHeight = 0;
                        }
                        else
                            switch (temp) {
                                case 1: // 1 блок
                                    if (this.pos.y + this.size.height >= this.land.blocks[i][this.land.blocks[i].length - 1].y) // если на земле
                                        this.pos.y -= this.land.blockSize;
                                    this.pos.x += this.land.blockSize / 2;
                                    this.fallHeight = 0;
                                    break;
                                case 2: // 2 блока
                                    if (this.pos.y + this.size.height >= this.land.blocks[i][this.land.blocks[i].length - 1].y) // если на земле
                                        this.pos.y -= 2 * this.land.blockSize;
                                    this.pos.x += this.land.blockSize / 2;
                                    this.fallHeight = 0;
                                    break
                            }
                    }
                }
                this.isMove = 1;
                break;

            case 2: // ПРЫЖОК
				if (!this.V.y) {
					this.V.x += this.look * 0.8;
					this.V.y -= 2.5;
					this.pos.y += this.V.y;	
				}
                this.isMove = 2;
                break
        }
    }
}

// меняем силу выстрела
Tower.prototype.setShootPower = function() {
    if (!this.shootPower)
        this.shootPower = 1;

    if (this.directionPower)
        if (this.shootPower < 10)
            this.shootPower += 0.2;
        else
            this.directionPower = false;
    else
        if (this.shootPower > 1)
            this.shootPower -= 0.2;
        else
            this.directionPower = true;
}

Tower.prototype.setTranslatePoint = function() {
    this.translatePoint.x = this.pos.x + this.size.width / 2;
    this.translatePoint.y = this.pos.y + this.size.height * 3 / 4;
    if (this.look == 1)
        this.translatePoint.x += 5;
    else
        this.translatePoint.x -= 5;
}