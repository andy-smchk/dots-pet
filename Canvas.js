function Canvas() {
  this.canvas = document.getElementById("board");
  this.ctx = this.canvas.getContext("2d");

  this.width = window.innerWidth;
  this.height = window.innerHeight;
  this.canvas.width  = this.width;
  this.canvas.height = this.height;

  this.clear = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  this.drawImage = function (sprite, point, radius) {
    var width = radius * 2.3;
    var height = radius * 2.3;

    this.ctx.drawImage(sprite, point.x - width/2, point.y - height/2, width, height);
  };

  this.drawCircle = function (point, radius, color) {
    var prevColor = this.ctx.fillStyle;

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius, 0, 2*Math.PI);
    this.ctx.fillStyle = color || prevColor;
    this.ctx.fill();

    this.ctx.fillStyle = prevColor;
  };

  this.drawLine = function (start, end, color) {
    var prevColor = this.ctx.fillStyle;
    this.ctx.strokeStyle = color || prevColor;

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();

    this.ctx.strokeStyle = prevColor;
  };

  this.drawText = function (text, point, color, font) {
    var prevColor = this.ctx.fillStyle;
    var prevFont = this.ctx.font;

    this.ctx.font = font || prevFont;
    this.ctx.fillStyle =  color || prevColor;
    this.ctx.fillText(text, point.x, point.y);

    this.ctx.fillStyle = prevColor;
    this.ctx.font = prevFont;
  }
}