function Drawer(context) {
  this.context = context;
  this.displayHelpers = false;

  this.newFrame = function () {
    this.context.clear();
  };

  this.drawHelpers = function (player) {
    this.context.drawText(player.id, player.position);
    this.drawVector(player.position, player.direction, player.radius, 'white');
  };

  this.drawPlayer = function (player) {
    if (player.sprite) {
      this.context.drawImage(player.sprite, player.position, player.radius);
    } else {
      this.context.drawCircle(player.position, player.radius, player.color);
    }

    if (this.displayHelpers) {
      this.drawHelpers(player);
    }
  };

  this.drawVector = function (initial, vector, length, color) {
    length = length || 1;

    var lookAtVector =  initial.clone().add(vector.clone().multiplyScalar(length));

    this.context.drawLine(initial, lookAtVector, color);
    this.context.drawCircle(lookAtVector, 5, color);
  }
}