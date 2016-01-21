/**
 * Created by user on 22.05.2015.
 */
/*
    кнопка в меню
 */

var Button = function(posX, posY, width, hight, color, text) {
    this.pos = {
        x: posX,
        y: posY
    };
    this.size = {
        width: width,
        height: hight
    };
    if (text == undefined){
        this.isImage = true;
        this.image = color;
        this.color = "yellow";
    }
    else {
        this.isImage = false;
        this.text = text;
        this.color = color;
    }
}

Button.prototype.isInside = function(mouse) {
    if (mouse.x >= this.pos.x)
        if (mouse.x <= this.pos.x + this.size.width)
            if (mouse.y >= this.pos.y)
                if (mouse.y <= this.pos.y + this.size.height)
                    return true;
                else
                    return false;
            else
                return false;
        else
            return false;
    else
        return false;
}

Button.prototype.draw = function(screen) {
    screen.save();
    screen.shadowBlur = 7;
    if (this.color == "black") {
        screen.shadowColor = "white";
        screen.fillStyle = this.color;
    }
    else {
        screen.shadowColor = "black";
        screen.fillStyle = "white";
    }

    if (this.isImage) {
        screen.drawImage(this.image, this.pos.x, this.pos.y, this.size.width, this.size.height);
    }
    else {
        //screen.strokeRect(this.pos.x, this.pos.y, this.size.width, this.size.height); // кнопка

        screen.textAlign = "center";
        screen.fillText(this.text, this.pos.x + this.size.width / 2, this.pos.y + this.size.height); // текст кнопки
    }

    screen.restore();
}