/**
 * Created by user on 29.03.2015.
 */
/*
    наша пулька
 */

var Bullet = function(Color, r, Pos, V, R, Damage) {
    this.r = r;
	this.pos = {
        x: Pos.x,
        y: Pos.y
    };
	this.V = {
        x: V.x,
        y: V.y
    };
    this.R = R;
    this.damage = Damage;
    this.color = Color;

    if (this.color == "yellow")
        this.RGB_clolor = 'rgba(255, 255, 0, ';
    else
        this.RGB_clolor = 'rgba(200, 0, 255, ';
    
    this.oldPos = [];
    for (var i = 0; i < 20; i++) {
        var pos = {
            x: this.pos.x,
            y: this.pos.y
        };
        this.oldPos[i] = pos;
    }

	this.isDestroy = false;
	this.t = 0;
}

Bullet.prototype.update = function(Game, Land, Towers) {
	this.destroy(Game, Land, Towers); // разрушим
	if (!this.isDestroy) {// если не разрушили
        this.move(Game.G, Game.wind); // подвинем
        this.SetOldPos();
    }
}

Bullet.prototype.draw = function(screen) {
	if (!this.isDestroy) { // не разрушили
		screen.fillStyle = this.color;
        for ( var i = 0, len = this.oldPos.length, j = 1; i < len; i++, j += 0.1) {
                var k =1/j;
                screen.fillStyle = this.RGB_clolor + k + ')';
                screen.beginPath();
                screen.arc(this.oldPos[i].x, this.oldPos[i].y, this.r / j, 0, 2 * Math.PI);
                screen.fill();
        }
        screen.beginPath();
        screen.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        screen.fill();
	}
}

Bullet.prototype.move = function(G, wind) {
	this.pos.x += this.V.x + wind * this.t;
	this.pos.y += this.V.y + G * this.t;
	this.t += 0.3;
}

// разрушение земли в радиусе взрыва
Bullet.prototype.boom = function(i, R, R1, R2, iR, Land, Game) {
    var end = i + iR;
    if (end > Land.blocks.length - 1)
        end = Land.blocks.length - 1;
    i -= iR;
    if (i < 0)
        i = 0;
    for (i; i <= end; i++){ // пройдем массив в радиусе взрыва по X
        var j = Math.floor((Land.size.height - this.pos.y - R) / Land.blockSize);
        if (j < 0)
            j = 0;
        var len = Math.floor((Land.size.height - this.pos.y + R) / Land.blockSize);
        if (len > Land.blocks[i].length)
            len = Land.blocks[i].length;
        for (j; j < len; j++) {  // пройдем массив в радиусе взрыва по Y
            if (Land.size.height - Land.blocks[i][j].y > 0)
                if ((Land.blocks[i][j].x - this.pos.x)*(Land.blocks[i][j].x - this.pos.x) + (Land.blocks[i][j].y - this.pos.y)*(Land.blocks[i][j].y - this.pos.y) <= R * R) { // если в большом круге
                    Land.blocks[i][j].lives -= 1; // минус жизнь
                    Game.landScreen.fillStyle = Land.blColors[Land.blocks[i][j].lives]; // перерисовали блок
                    Game.landScreen.fillRect(Land.blocks[i][j].x, Land.blocks[i][j].y, Land.blockSize, Land.blockSize);

                    if (Land.blocks[i][j].lives)
                        if ((Land.blocks[i][j].x - this.pos.x)*(Land.blocks[i][j].x - this.pos.x) + (Land.blocks[i][j].y - this.pos.y)*(Land.blocks[i][j].y - this.pos.y) <= R1 * R1) { // если в среднем
                            Land.blocks[i][j].lives -= 1;
                            Game.landScreen.fillStyle = Land.blColors[Land.blocks[i][j].lives];
                            Game.landScreen.fillRect(Land.blocks[i][j].x, Land.blocks[i][j].y, Land.blockSize, Land.blockSize);

                            if (Land.blocks[i][j].lives)
                                if ((Land.blocks[i][j].x - this.pos.x)*(Land.blocks[i][j].x - this.pos.x) + (Land.blocks[i][j].y - this.pos.y)*(Land.blocks[i][j].y - this.pos.y) <= R2 * R2) { // если в меньшем
                                    Land.blocks[i][j].lives -= 1;
                                    Game.landScreen.fillStyle = Land.blColors[Land.blocks[i][j].lives];
                                    Game.landScreen.fillRect(Land.blocks[i][j].x, Land.blocks[i][j].y, Land.blockSize, Land.blockSize);
                                }
                        }
                }
            if (!Land.blocks[i][j].lives) { // проверили блок, если его нет
                Game.landScreen.clearRect(Land.blocks[i][j].x, Land.blocks[i][j].y, Land.blockSize, Land.blockSize); // стерли
                Land.blocks[i].splice(j, 1); // удилили его из массива
                if ((Land.fulls[i] == -1) || (Land.fulls[i] > j))
                    Land.fulls[i] = j; // сказали, что, возможно, надо сдвинуть c этой позиции
                j--; // чтоб не пропустить следующий
                len--; // длина уменьшилась
            }
        }
    }
}

Bullet.prototype.destroy = function(Game, Land, Towers) {
	if (this.t > 0) { // вылетели из дула
		var i = Math.floor(this.pos.x / Land.blockSize); // позиция, где находится Х
	
		var R = this.R; // радиус поражения
		var R1 = R - 5;
		var R2 = R1 - 5;
		var iR = Math.floor(R / Land.blockSize); // радиус в ячкйчках массива
	
		if (Land.blocks[i][Land.blocks[i].length - 1].y <= this.pos.y + this.r) { // попали по Y

			this.boom(i, R, R1, R2, iR, Land, Game);

			for (var k = 0, len = Towers.length; k < len; k++) {
				var X = Towers[k].pos.x + (Towers[k].size.width / 2); // проверим башню
				var Y = Towers[k].pos.y + (Towers[k].size.height / 2);
				if ((X - this.pos.x)*(X - this.pos.x) + (Y - this.pos.y)*(Y - this.pos.y) <= R * R) {
                    if (Towers[k].color == this.color) {
						if (Towers[k].lives)	
							Towers[k].lives += 1;
					}
					else
						if (Towers[k].lives >= this.damage / 2)
							Towers[k].lives -= this.damage / 2;
                        else
                            Towers[k].lives = 0;
					this.excplosion_vector(Towers[k], R);
				}
			}
			this.isDestroy = true;
		}
		else {
			k = 0;
			while ((k < Towers.length) && (!this.isDestroy)) { // проверим все башни на попадение
				if ((this.pos.x >= Towers[k].pos.x) && (this.pos.x <= Towers[k].pos.x + Towers[k].size.width) && (this.pos.y >= Towers[k].pos.y) && (this.pos.y <= Towers[k].pos.y + Towers[k].size.height)) {
                    if (Towers[k].color == this.color) {
						if (Towers[k].lives)
							Towers[k].lives += 1;
					}
					else {
						if (Towers[k].lives >= this.damage)
							Towers[k].lives -= this.damage;
						else
                            Towers[k].lives  = 0;
					}
                    this.excplosion_vector(Towers[k], R);

                    this.boom(i, R, R1, R2, iR, Land, Game);

					for (var m = 0; m < Towers.length; m++) // зацепили ли какую-нить из отальных башен?
						if (m != k) {
							X = Towers[m].pos.x + (Towers[m].size.width / 2); // проверим башню
							Y = Towers[m].pos.y + (Towers[m].size.height / 2);
							if ((X - this.pos.x)*(X - this.pos.x) + (Y - this.pos.y)*(Y - this.pos.y) <= R * R) {
                                if (Towers[m].color == this.color) {
									if (Towers[m].lives)	
										Towers[m].lives += 1;
								}
								else
									if (Towers[m].lives >= this.damage / 2)
										Towers[m].lives -= this.damage / 2;
                                    else
                                        Towers[m].lives = 0;
                                this.excplosion_vector(Towers[k], R);
                            }
						}
					this.isDestroy = true; // добавить разрушение блоков
				}
			k++;
			}
		}
	}
}

// позиции для дыма за пулей
Bullet.prototype.SetOldPos = function() {
    for ( var i = this.oldPos.length - 1; i > 0; i--) {
        var pos = {
            x: this.oldPos[i - 1].x,
            y: this.oldPos[i - 1].y
        };
        this.oldPos[i] = pos;
    }
    this.oldPos[0].x = this.pos.x;
    this.oldPos[0].y = this.pos.y;
}

// подсчет весктора для отбрасывания башни
Bullet.prototype.excplosion_vector = function(Tower, R) {
	var x, y;
	x = Tower.pos.x + Tower.size.width / 2 - this.pos.x;
	y = Tower.pos.y + Tower.size.height / 2 - this.pos.y;

    if (x > 0)
        x = Math.max(x, 8);
    else
        x = Math.min(x, -8);

    if (y > 0)
        y = Math.max(y, 8);
    else
        y = Math.min(y, -8);

	Tower.V.x = R / x;
	Tower.V.y = R / y;

    Tower.pos.y -= 1;
    console.log(x, y,    Tower.V.x,  Tower.V.y);
}