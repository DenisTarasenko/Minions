/*
	Описание объекта Land
		это наше игровое поле
*/

var Land = function(Game) {
	this.blColors = [ // по количеству жизней
		"#111111",	// 0 - верхний слой
		"#FF4136",  // 1 жизнь - красный "#FF0000"
		"#FF851B",	// 2 - оранжевый "#FFA500"
		"#2ECC40"	// 3 - зеленый "#00FF00"
	];
	this.size = {
		width: Game.gameSize.width,
		height: Game.gameSize.height
	};
	this.blockSize = 1; // размер блока зависит от ширины игры
	this.blocks = []; // массив блоков из которых состоит земля
	this.fulls = [];
    this.allDone = true; // флаг на продолжение игры

    this.images = {
        grass: new Image(),
        egypt: new Image()
    };
    this.images.grass.src = "Images/land_Grass.jpeg";
    this.images.egypt.src = "Images/land_Egypt.jpg";
    this.image = new Image();
}

Land.prototype.init = function(screen, land_type, LAND_TYPE) {
    if (land_type.world == LAND_TYPE.WORLD.GRASS) {
        this.blockSize = 1;
        this.init_Grass(screen, land_type, LAND_TYPE);
        this.image = this.images.grass;
    }
    else {
        this.blockSize = 4;
        this.init_Egypt(screen, land_type, LAND_TYPE);
        this.image = this.images.egypt;
    }
}

// инрциализация хломами травы
Land.prototype.init_Grass = function(screen, land_type, LAND_TYPE) {
    switch (land_type.land) {
        case LAND_TYPE.LAND.FIELD:
            var y1 = Math.floor(Math.random() * (this.size.height / 4 - this.size.height / 5) + this.size.height / 5); // мах высота первого холма
            var y2 = Math.floor(Math.random() * (40) + y1 - 20); // мах высота второго холма
            var y3 = Math.floor(Math.random() * (40) + y1 - 20); // мах высота 3 холма
            var y4 = Math.floor(Math.random() * (40) + y1 - 20); // мах высота 4 холма
            var y5 = Math.floor(Math.random() * (40) + y1 - 20); // мах высота 5 холма
            break;

        case LAND_TYPE.LAND.MOUNTAIN:
            y1 = Math.floor(Math.random() * (this.size.height / 4 - this.size.height / 5) + this.size.height / 5); // мах высота первого холма
            y2 = Math.floor(Math.random() * (5 / 6 * y1)); // мах высота второго холма
            y3 = Math.floor(Math.random() * (3 / 2 * y1) + y1); // мах высота 3 холма
            y4 = Math.floor(Math.random() * (y1) + y1 / 2); // мах высота 4 холма
            y5 = Math.floor(Math.random() * (y1)); // мах высота 5 холма
            break;
    }

    for (var x = 0, i = 0; x <= this.size.width * this.blockSize; x += this.blockSize, i++) { // идем по Х с шагом в наш блок
        var temp1 = Math.abs(Math.sin(x / 1.35 * Math.PI / 180) * y1); // Y для 1 горы
        var temp2 = Math.abs(Math.sin(x / 1.65 * Math.PI / 180 - 30) * y2); // Y для 2 горы
        var temp3 = Math.abs(Math.sin(x / 1.85 * Math.PI / 180 + 30) * y3); // Y для 2 горы
        var temp4 = Math.abs(Math.sin(x / 1.75 * Math.PI / 180 + 60) * y4); // Y для 2 горы
        var temp5 = Math.abs(Math.sin(x / 1.55 * Math.PI / 180 - 60) * y5); // Y для 2 горы

        this.blocks[i] = []; // массив игриков

        for (var y = 0, j = 0; y <= temp1 || y <= temp2 || y <= temp3 || y <= temp4 || y <= temp5; y += this.blockSize, j++) { // идем по Y
            var block = { // создаем блок с этими параметрами
                x: x,
                y: this.size.height - y, // помним, что начало отсчета по Y сверу
                drawX: x,
                drawY: this.size.height - y,
                lives: 3 // в зеленый цвет
            };
            this.blocks[i][j] = block; // кладем блок в массив
            screen.drawImage(this.images.grass, this.blocks[i][j].x, this.blocks[i][j].y, this.blockSize, this.blockSize, this.blocks[i][j].x, this.blocks[i][j].y, this.blockSize, this.blockSize); // собственно, рисуем
        }
        screen.fillStyle = "rgb(0, 128, 0)";
        for (j = this.blocks[i].length - 5; j < this.blocks[i].length; j++)
            screen.fillRect(this.blocks[i][j].x, this.blocks[i][j].y, this.blockSize, this.blockSize); // собственно, рисуем
        this.fulls[i] = -1; // флаг, что он полный
    }
}

// инициализация египтом
Land.prototype.init_Egypt = function(screen, land_type, LAND_TYPE) {
    switch (land_type.land) {
        case LAND_TYPE.LAND.FIELD:
            var w1 = Math.floor(Math.random() * (this.size.width / 3 - this.size.width / 3.3) + this.size.width / 3.3); // мах высота первого холма
            var w2 = Math.floor(Math.random() * (20) + w1 - 10); // мах высота второго холма
            break;

        case LAND_TYPE.LAND.MOUNTAIN:
            w1 = Math.floor(Math.random() * (this.size.width / 4 - this.size.width / 4.3) + this.size.width / 4.3); // мах высота первого холма
            w2 = Math.floor(Math.random() * (w1 / 2) + 5/3 * w1); // мах высота второго холма
            break;
    }

    for (var x = 0, i = 0; x <= this.size.width * this.blockSize; x += this.blockSize, i++) { // идем по Х с шагом в наш блок

        var down = this.size.height / 15; // Y для пола

        var temp1 = (x) + w1/10 + down; // Y для 1 горы
        var temp2 = -(x) + w1/10 + w1 + down; // Y для 1 горы

        var temp3 = (x - w1/10 - w1) + down; // Y для 2 горы
        var temp4 = -(x - w1/10 - w1) + w2 + down; // Y для 2 горы

        var temp5 = (x - w1/10 - w1 - w2) + down; // Y для 3 горы
        var temp6 = -(x) + this.size.width + w1/10 + down; // Y для 3 горы

        this.blocks[i] = []; // массив игриков

        for (var y = 0, j = 0; (y <= temp1 && y <= temp2) || (y <= temp3 && y <= temp4) || (y <= temp5 && y <= temp6) || y <= down; y += this.blockSize, j++) { // идем по Y
            var block = { // создаем блок с этими параметрами
                x: x,
                y: this.size.height - y, // помним, что начало отсчета по Y сверу
                drawX: x,
                drawY: this.size.height - y,
                lives: 3 // в зеленый цвет
            };
            this.blocks[i][j] = block; // кладем блок в массив
            screen.drawImage(this.images.egypt, this.blocks[i][j].drawX, this.blocks[i][j].drawY, this.blockSize, this.blockSize, this.blocks[i][j].x, this.blocks[i][j].y, this.blockSize, this.blockSize); // собственно, рисуем
        }
        this.fulls[i] = -1; // флаг, что он полный
    }
}

// падение блока
Land.prototype.updateDraw = function(blocks, G, screen) {
    if (blocks.length) { // если блоки есть
		screen.fillStyle = this.blColors[blocks[0][0].lives]; // берем цвет
		screen.fillRect(blocks[0][0].x, blocks[0][0].y, this.blockSize, this.blockSize); // собственно, рисуем

		for (var i = 0, len = blocks.length; i < len; i++) { 
			screen.fillStyle = this.blColors[blocks[i][0].lives]; // берем цвет
			screen.fillRect(blocks[i][0].x, blocks[i][0].y, this.blockSize, this.blockSize); // собственно, рисуем
			
			if (this.fulls[i] != -1) { // если есть дырки в столбце
                this.allDone = false;
				var flag = true;
				for (var j = this.fulls[i]; j < blocks[i].length; j++) {
					screen.clearRect(blocks[i][j].x, blocks[i][j].y, this.blockSize, this.blockSize);
					if (blocks[i][j].y + this.blockSize < blocks[i][j - 1].y) {
						blocks[i][j].y += this.blockSize; // опускаем по  Y					
						flag = false;
					}
                    if (blocks[i][j].lives == 3)
                        screen.drawImage(this.image, this.blocks[i][j].drawX, this.blocks[i][j].drawY, this.blockSize, this.blockSize, this.blocks[i][j].x, this.blocks[i][j].y, this.blockSize, this.blockSize); // собственно, рисуем
                    else {
                        screen.fillStyle = this.blColors[blocks[i][j].lives]; // берем цвет
                        screen.fillRect(blocks[i][j].x, blocks[i][j].y, this.blockSize, this.blockSize); // собственно, рисуем
                    }
				}
				if (flag) // если не двигали ничего
                    this.fulls[i] = -1; // дырок нет
			}
		}
        if (this.allDone)
            return true;
        else {
            this.allDone = true;
            return false;
        }
	}
    else
        return true;
}