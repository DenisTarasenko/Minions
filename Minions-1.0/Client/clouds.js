/**
 * Created by user on 16.04.2015.
 */
/*
    наши облака, будут показывать направление и силу ветра
 */

var Clouds = function(Game) {
    this.game = Game;
    this.gameSize = Game.gameSize;

    this.old_wind = 1;
    this.wind_Power = 0;
    this.trend = 1;
    this.symbol_1 = '>';
    this.symbol_2 = '<';

    this.type = true;
    this.amount = 0;
}

// обновление облаков
Clouds.prototype.update = function(wind) {
    switch (this.type) {
        case true: // ТРАВА
            var V1 = wind / Math.abs(wind),
                V2 = 2 * V1;
            for (var i = 0; i < this.amount; i++) {
                this.layout1[i].pos.x += V1;
                this.cloudCycle(this.layout1[i]);

                this.layout2[i].pos.x += V2;
                this.cloudCycle(this.layout2[i]);
            }
            break;

        case  false: // ЕГИПЕТ
            V1 = wind / Math.abs(wind);
            for (var i = 0; i < this.amount; i++) {
                this.layout1[i].pos.x += V1;
                this.cloudCycle(this.layout1[i]);
            }
            break;
    }
    this.set_wind_power(wind);
}

// отрисовка облаков
Clouds.prototype.draw = function(screen) {
    switch (this.type) {
        case true: // ТРАВА
            for (var i = 0; i < this.amount; i++)
                screen.drawImage(this.layout1[i].image, this.layout1[i].pos.x, this.layout1[i].pos.y, this.layout1[i].size.width, this.layout1[i].size.height);
            for (i = 0; i < this.amount; i++)
                screen.drawImage(this.layout2[i].image, this.layout2[i].pos.x, this.layout2[i].pos.y, this.layout2[i].size.width, this.layout2[i].size.height);
            break;

        case  false: // ЕГИПЕТ
            for (i = 0; i < this.amount; i++)
                screen.drawImage(this.layout1[i].image, this.layout1[i].pos.x, this.layout1[i].pos.y, this.layout1[i].size.width, this.layout1[i].size.height);
            break;
    }
    this.draw_wind(screen);
}

// инициализация облаков в мире Трава
Clouds.prototype.init_Grass = function() {
    this.type = true;
    this.amount = 5;
    this.layout1 = [];
    for (var i = 0; i < this.amount; i++) {
        var cloud = {
            pos: {
                x: 10 + i * 310,
                y: Math.random() * (this.gameSize.height / 10 - 20) + 20
            },
            size: {width: 250, height: 120},
            image: new Image()
        };
        cloud.image.src = "Images/Clouds/Grass/Cloud_" + i + ".png";
        this.layout1[i] = cloud;
    }

    this.layout2 = [];
    for (i = 0; i < this.amount; i++) {
        cloud = {
            pos: {
                x: 10 + i * 320,
                y: Math.random() * (this.gameSize.height / 6 - this.gameSize.height / 7) + this.gameSize.height / 7
            },
            size: {width: 310, height: 160},
            image: new Image()
        };
        cloud.image.src = "Images/Clouds/Grass/Cloud_" + i + ".png";
        this.layout2[i] = cloud;
    }
}

// инициализация облаков в мире Египет
Clouds.prototype.init_Egypt = function() {
    this.amount = 3;
    this.type = false;
    this.layout1 = [];
    for (var i = 0; i < this.amount; i++) {
        var cloud = {
            pos: {
                x: 10 + i * 640,
                y: Math.random() * (this.gameSize.height / 7 - 30) + 30
            },
            size: {width: 650, height: 300},
            image: new Image()
        };
        cloud.image.src = "Images/Clouds/Egypt/Cloud_" + i + ".png";
        this.layout1[i] = cloud;
    }
}

// проверка на выход за границы окна
Clouds.prototype.cloudCycle = function (cloud) {
    if (cloud.pos.x > this.gameSize.width)
        cloud.pos.x = -cloud.size.width;
    if (cloud.pos.x + cloud.size.width < 0)
        cloud.pos.x = this.gameSize.width;
}

// обозначим силу ветра, чтоб потом нарисовать
Clouds.prototype.set_wind_power = function(wind) {
    if (this.old_wind != wind) {
        var ABSwind = Math.abs(wind);
        if (ABSwind <= 0.01)
            this.wind_Power = 1;
        else
            if (ABSwind <= 0.02)
                this.wind_Power = 2;
            else
                if (ABSwind <= 0.03)
                    this.wind_Power = 3;
                else
                    if (ABSwind <= 0.04)
                        this.wind_Power = 4;
                    else
                        if (ABSwind <= 0.05)
                            this.wind_Power = 5;
        if (wind > 0)
            this.trend = 1;
        else
            this.trend = 0;
    }
}

// нарисуем силу ветра
Clouds.prototype.draw_wind = function(screen) {
    screen.textAlign = "center";
    screen.fillStyle = "red";
    if (this.trend)
        var string = this.symbol_1;
    else
        string = this.symbol_2;

    for (var i = 1; i < this.wind_Power; i++)
        if (this.trend)
            string += " " + this.symbol_1;
        else
            string += " " + this.symbol_2;

	screen.font = "25px " + this.game.font;
	screen.fillStyle = "white";
	screen.save();
	screen.shadowBlur=7;
    screen.shadowColor="black";
    screen.fillText(string, this.gameSize.width / 2, 30); // ветер
	screen.restore();
}