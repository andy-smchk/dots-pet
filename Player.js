function Player(id) {
  this.color = Helper.getRandomColor();
  this.direction = new Victor(0, 0);
  this.position = new Victor(0, 0);
  this.radius = 50;
  this.mass = 5;
  this.id = id;
  this.speed = 0;
  this.velocity = new Victor(0, 0);
  this.removeOnTopEdgeCollision = false;
  this.removeOnCollision = false;
  this.type = 'standard';
  this.removeOnCollisionWithType = [];
  this.beforeRemoveCallback = null;
  this.sprite = null;

  this.setSpeed = function (speed) {
    this.speed = speed;
    this.update();
  };

  this.velocityUpdate = function () {
    this.direction = this.velocity.clone().normalize();
  };

  this.update = function () {
    this.velocity = this.direction.clone().multiplyScalar(this.speed);
  };

  this.onRemove = function () {
    if (this.beforeRemoveCallback) {
      this.beforeRemoveCallback(this);
    }
  }
}