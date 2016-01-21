/**
 * Created by user on 13.06.2015.
 */
/*
 оружие 1: просто баузка
 */

var Gun_2 = function(Game, Tower, Land) {
    this.game = Game;
    this.tower = Tower;
    this.land = Land;

    this.size = {
        width: 45,
        height: 20
    };
    this.image1 = new Image();
    this.image1.src = "Images/Weapons/gun_2_1.png";
    this.image2 = new Image();
    this.image2.src = "Images/Weapons/gun_2_2.png";

    this.r = 4;
    this.isBullet = true;
    this.isBullet1 = 0;
    this.isBullet2 = 0;

    this.boom = {
        image: new Image(),
        count: -1,
        done: false,
        drawX: -35.3,
        x: 0,
        y: 0,
        d: 90
    };
    this.boom.image.src = "Images/boom.png";

    this.boom1 = {
        image: new Image(),
        count: -1,
        drawX: -35.3,
        x: 0,
        y: 0,
        d: 90
    };
    this.boom1.image.src = "Images/boom.png";

    this.boom2 = {
        image: new Image(),
        count: -1,
        drawX: -35.3,
        x: 0,
        y: 0,
        d: 90
    };
    this.boom2.image.src = "Images/boom.png";

    this.newPos = {
        x: 0,
        y: 0
    };
    this.V1 = {
        x: 1,
        y: -2
    };
    this.V2 = {
        x: -1,
        y: -2
    };

    this.shooting = false;
}

// обновление
Gun_2.prototype.update = function(InputHandler, state) {
    switch (state) {
        case 1:
            this.shoot(InputHandler);
            break;

        case  2:
            if (this.isBullet) { // апдейт 1 пули
                if (!this.delBullet())
                    this.bullet.update(this.game, this.land, this.game.towers);
                else {
                    this.newBullet();
                    this.isBullet1 = 1;
                    this.isBullet2 = 1;
                    this.isBullet = false;
                }
            }
            else { // апдейт рисунка
                this.boom.drawX += 35.3;
                this.boom.count++;

                if (this.isBullet1 == 1) { // апдейт 2 пули
                    if (!this.delBullet1())
                        this.bullet1.update(this.game, this.land, this.game.towers);
                    else {
                        this.isBullet1 = 2;
                    }
                }
                else
                    if (this.isBullet1 == 2) { // апдейт рисунка
                        this.boom1.drawX += 35.3;
                        this.boom1.count++;
                    }

                if (this.isBullet2 == 1) { // апдейт 3 пули
                    if (!this.delBullet2())
                        this.bullet2.update(this.game, this.land, this.game.towers);
                    else {
                        this.isBullet2 = 2;
                    }
                }
                else
                    if (this.isBullet2 == 2) { // апдейт рисунка
                        this.boom2.drawX += 35.3;
                        this.boom2.count++;
                    }
            }
            if (this.boom.count >= 30 && this.boom1.count >= 30 && this.boom2.count >= 30 && this.boom.done && this.game.allDown) {
				this.game.RoundTime = 0;
                this.game.status = this.game.STATUS.NEXT_TERN;

                this.boom.drawX = -35.3;
                this.boom.count = -1;

                this.boom1.drawX = -35.3;
                this.boom1.count = -1;

                this.boom2.drawX = -35.3;
                this.boom2.count = -1;

                this.isBullet = true;
                this.isBullet1 = 0;
                this.isBullet2 = 0;
            }
            break;
    }
    this.boom.done = false;
}

// рисунок
Gun_2.prototype.draw = function(screen) {
    if (this.isBullet)
        this.bullet.draw(screen);
    else {
        if (this.boom.count < 30)
            screen.drawImage(this.boom.image, this.boom.drawX, 0, 35.3, this.boom.image.height, this.boom.x, this.boom.y, this.boom.d, this.boom.d);

        if (this.isBullet1 == 1)
            this.bullet1.draw(screen);
        else
            if (this.isBullet1 == 2)
                if (this.boom1.count < 30)
                    screen.drawImage(this.boom1.image, this.boom1.drawX, 0, 35.3, this.boom1.image.height, this.boom1.x, this.boom1.y, this.boom1.d, this.boom1.d);

        if (this.isBullet2 == 1)
            this.bullet2.draw(screen);
        else
            if (this.isBullet2 == 2)
                if (this.boom2.count < 30)
                    screen.drawImage(this.boom2.image, this.boom2.drawX, 0, 35.3, this.boom2.image.height, this.boom2.x, this.boom2.y, this.boom2.d, this.boom2.d);
    }
}

// выстрел
Gun_2.prototype.shoot = function(InputHandler) {
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
Gun_2.prototype.delBullet = function() {
    if ((this.bullet.isDestroy) || (this.bullet.pos.x > this.game.gameSize.width) || (this.bullet.pos.y > this.game.gameSize.y) || (this.bullet.pos.x < 0)) { // если надо удалить
        this.boom.x = this.bullet.pos.x - this.boom.d /2;
        this.boom.y = this.bullet.pos.y - this.boom.d /2;

        this.newPos.x = this.bullet.pos.x;
        this.newPos.y = this.bullet.pos.y;

        delete this.bullet;	// удалили
        return true;
    }
    return false;
}

Gun_2.prototype.newBullet = function() {
    this.bullet1 = new Bullet(this.tower.color, this.r / 2, this.newPos, this.V1, 25, 2); // создали пулю
    this.bullet2 = new Bullet(this.tower.color, this.r / 2, this.newPos, this.V2, 25, 2); // создали пулю
}

Gun_2.prototype.delBullet1 = function() {
    if ((this.bullet1.isDestroy) || (this.bullet1.pos.x > this.game.gameSize.width) || (this.bullet1.pos.y > this.game.gameSize.y) || (this.bullet1.pos.x < 0)) { // если надо удалить
        this.boom1.x = this.bullet1.pos.x - this.boom1.d /2;
        this.boom1.y = this.bullet1.pos.y - this.boom1.d /2;

        delete this.bullet1;	// удалили
        return true;
    }
    return false;
}

Gun_2.prototype.delBullet2 = function() {
    if ((this.bullet2.isDestroy) || (this.bullet2.pos.x > this.game.gameSize.width) || (this.bullet2.pos.y > this.game.gameSize.y) || (this.bullet2.pos.x < 0)) { // если надо удалить
        this.boom2.x = this.bullet2.pos.x - this.boom2.d /2;
        this.boom2.y = this.bullet2.pos.y - this.boom2.d /2;

        delete this.bullet2;	// удалили
        return true;
    }
    return false;
}

Gun_2.prototype.rotateP = function(Point) {
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

Gun_2.prototype.draw_gun = function(screen) {
    if (this.tower.gun_Angle < Math.PI / 2)
        screen.drawImage(this.image1, -10, -this.size.height / 2, this.size.width, this.size.height);
    else
        screen.drawImage(this.image2, -10, -this.size.height / 2, this.size.width, this.size.height);
}