/**
 * Created by user on 13.06.2015.
 */
/*
    оружие 1: просто баузка
 */

var Gun_1 = function(Game, Tower, Land) {
    this.game = Game;
    this.tower = Tower;
    this.land = Land;

    this.size = {
        width: 45,
        height: 20
    };
    this.image1 = new Image();
    this.image1.src = "Images/Weapons/gun_1_1.png";
    this.image2 = new Image();
    this.image2.src = "Images/Weapons/gun_1_2.png";

    this.r = 4;
    this.isBullet = true;

    this.boom = {
        image: new Image(),
        count: -1,
        done: 0,
        drawX: -35.3,
        x: 0,
        y: 0,
        d: 90
    };
    this.boom.image.src = "Images/boom.png";

    this.shooting = false;
}

// обновление
Gun_1.prototype.update = function(InputHandler, state) {
    switch (state) {
        case 1:
            this.shoot(InputHandler);
            break;

        case  2:
            if (this.isBullet) { // апдейт пули
                if (!this.delBullet())
                    this.bullet.update(this.game, this.land, this.game.towers);
                else {
                    this.isBullet = false;
                    //this.game.audio.fairshow.play();
                }
            }
            else { // апдейт рисунка
                this.boom.drawX += 35.3;
                this.boom.count++;

                if (this.boom.count >= 30 && this.boom.done && this.game.allDown) {
                    this.game.RoundTime = 0;
					this.game.status = this.game.STATUS.NEXT_TERN;

                    this.boom.drawX = -35.3;
                    this.boom.count = -1;
                    this.boom.done = false;

                    this.isBullet = true;
                }
            }
            break;
    }
    this.boom.done = false;
}

// рисунок
Gun_1.prototype.draw = function(screen) {
    if (this.isBullet)
        this.bullet.draw(screen);
    else
        screen.drawImage(this.boom.image, this.boom.drawX, 0, 35.3, this.boom.image.height, this.boom.x, this.boom.y, this.boom.d, this.boom.d);
}

// выстрел
Gun_1.prototype.shoot = function(InputHandler) {
    if ((!this.tower.V.y) && (InputHandler.shoot) && !this.shooting) {// если выстрел
        this.game.status = this.game.STATUS.SHOOT;
        this.shooting = 1;
    }

    if (this.shooting && !InputHandler.shoot) {
        var pos = {
            x: this.tower.translatePoint.x + this.size.width + this.r - 10,
            y: this.tower.translatePoint.y
        };
        this.rotateP(pos);

        var V = { // начальный вектор скорости
            x: this.tower.shootPower * Math.cos(this.tower.gun_Angle),
            y: this.tower.shootPower * Math.sin(this.tower.gun_Angle)
        };
        this.bullet = new Bullet(this.tower.color, this.r, pos, V, 30, 2); // создали пулю
        this.game.status = this.game.STATUS.BULLET; // флаг
        this.tower.shootPower = 0;
        this.tower.directionPower = true;
        this.shooting = false;
        //this.game.audio.shoot.play();
    }
}

//удаление пули
Gun_1.prototype.delBullet = function() {
    if ((this.bullet.isDestroy) || (this.bullet.pos.x > this.game.gameSize.width) || (this.bullet.pos.y > this.game.gameSize.y) || (this.bullet.pos.x < 0)) { // если надо удалить
        this.boom.x = this.bullet.pos.x - this.boom.d /2;
        this.boom.y = this.bullet.pos.y - this.boom.d /2;
        delete this.bullet;	// удалили
        return true;
    }
    return false;
}

Gun_1.prototype.rotateP = function(Point) {
    var point = {
        x: Point.x,
        y: Point.y
    };
    var angle = this.tower.gun_Angle;

    Point.x = (point.x - this.tower.translatePoint.x) * Math.cos(angle) - (point.y - this.tower.translatePoint.y) * Math.sin(angle);
    Point.y = (point.x - this.tower.translatePoint.x) * Math.sin(angle) + (point.y - this.tower.translatePoint.y) * Math.cos(angle);

    Point.x += this.tower.translatePoint.x;
    Point.y += this.tower.translatePoint.y;
}

Gun_1.prototype.draw_gun = function(screen) {
    if (this.tower.gun_Angle < Math.PI / 2)
        screen.drawImage(this.image1, -10, -this.size.height / 2, this.size.width, this.size.height);
    else
        screen.drawImage(this.image2, -10, -this.size.height / 2, this.size.width, this.size.height);
}