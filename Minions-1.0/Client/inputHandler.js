/**
 * Created by user on 25.03.2015.
 */
/*
    ловим мышку и клаву
 */

var InputHandler = function(canvas) {
    this.KEY = {
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		SPACE: 32,
		ENTER: 13,
		W: 87,
        ESC: 27
	};
	this.mouse = {
        x: 0,
        y: 0
    };
	this.mouseMove = false;
	this.angle = 0;
    this.shoot = false;
	this.move = 0;
	this.W = false;
    this.esc = false;

    var self = this;	

    canvas.onmousemove = function(event) {
        self.mouse.x = event.offsetX == undefined ? event.layerX : event.offsetX;
        self.mouse.y = event.offsetY == undefined ? event.layerY : event.offsetY;
		self.mouseMove = true;
    };

    canvas.onmousedown = function(event) {
        if (event.which == 1) // выстрел
            self.shoot = 1;
    };

    canvas.onmouseup = function(event) {
        if (event.which == 1) // выстрел
            self.shoot = false;
    };
    
	window.onkeydown = function(event) {
		if (event.keyCode == self.KEY.ENTER) // выстрел
            self.shoot = 1;
		if (event.keyCode == self.KEY.LEFT) // лево
			self.move = -1;
		if (event.keyCode == self.KEY.RIGHT) // право
			self.move = 1;
		if (event.keyCode == self.KEY.SPACE) // прыжок
			self.move = 2;
		if (event.keyCode == self.KEY.UP) // угол вверх
			self.angle = 1;
		if (event.keyCode == self.KEY.DOWN) // угол вниз
			self.angle = -1;

        if (event.keyCode == self.KEY.ESC)
            self.esc = true;
		
		if (event.keyCode == self.KEY.W)
            self.W = true;
	};

    window.onkeyup = function(event) {
        self.angle = 0;
        self.shoot = false;
        self.move = 0;
        self.esc = false;
		self.W = false;
    }
}