function Core(drawer, world) {

  this.drawer = drawer;
  this.world = world;
  this.context = drawer.context;
  this.pairs = [];
  this.pause = false;
  this.drawMode = false;
  this.toRemove = [];

  this.time = 0;
  var that = this;

  document.onkeydown = function(e){
    if (e.keyCode == '32') {
      that.pause = false;
    }
  };

  this.addElement = function (player) {
    this.world.elements.push(player);
  };

  this.removeElements = function () {
    for(var j = 0; j < this.toRemove.length; j++) {
      var player = this.toRemove[j];
      for (var i = 0; i < this.world.elements.length; i++) {
        if (this.world.elements[i].id === player.id) {
          player.onRemove();
          this.world.elements.splice(i, 1);
          return;
        }
      }
    }
    this.toRemove = [];
  };

  this.toRemoveElement = function (player) {
    this.toRemove.push(player);
  };

  this.process = function (dt) {
    if (this.pause) {
      return;
    }
    this.time++;

    if (!this.drawMode) {
      for(var i = 0; i < this.world.elements.length; i++) {
        this.update(this.world.elements[i], dt);
      }

      this.processCollisions(dt);
      this.removeElements();
    }
  };

  this.drawAll = function () {
    this.drawer.newFrame();

    for(var j = 0; j < this.world.elements.length; j++) {
      this.drawer.drawPlayer(this.world.elements[j]);
    }
  };


  this.update = function (player, dt) {
    var position = player.position;
    var g = this.world.G.clone().multiplyScalar(dt);

    if(position.y + player.radius >= this.context.height){
      position.y = this.context.height - player.radius;
      player.velocity.invertY();
      player.velocity.multiplyScalarY(this.world.bottomEdgeEnergyLost);
      player.velocity.subtract(g);
    }

    if(position.y - player.radius <= 0){
      position.y = player.radius ;
      player.velocity.invertY();
      if (player.removeOnTopEdgeCollision) {
        this.toRemoveElement(player);
      }
    }

    if(position.x + player.radius >= this.context.width){
      position.x = this.context.width - player.radius;
      player.velocity.invertX();
    }

    if(position.x - player.radius <= 0){
      position.x =  player.radius ;
      player.velocity.invertX();
    }
    player.velocity.add(g);
    player.speed = player.velocity.magnitude();

    if (player.speed <= 0.1) {
      player.velocity.multiplyScalar(0);
      player.speed = 0;
    }

    player.direction = player.velocity.clone().normalize();
    player.position.add(player.velocity);
  };


  this.createPairs = function () {
    this.pairs = [];

    for(var i = 0; i < this.world.elements.length; i++) {
      var first = this.world.elements[i];

      for(var j = i + 1; j < this.world.elements.length; j++) {
        var second = this.world.elements[j];

        var closestPossible = Math.pow(second.radius + first.radius, 2);
        var distance = Math.round(first.position.distanceSq(second.position));

        if (distance >= closestPossible) {
         continue;
        }

        this.pairs.push({
          first: first,
          second: second
        })

      }
    }
  };

  this.processCollisions  = function () {
    this.createPairs();

    for(var i = 0; i < this.pairs.length; i++) {
      var pair = this.pairs[i];
      this.collide(pair.first, pair.second)
    }
  };

  this.collide = function (player, anotherPlayer) {
    var distance = Math.round(player.position.distanceSq(anotherPlayer.position));
    var closestPossible = Math.pow(anotherPlayer.radius + player.radius, 2);

    //var collisionVector = anotherPlayer.position.clone().subtract(player.position);
    //var direction90 = player.direction.clone().rotate(Math.PI / 2);
   // var h = Math.pow(collisionVector.dot(direction90), 2);
    //var overflow = Math.sqrt(Math.abs(closestPossible - h)) - Math.sqrt(Math.abs(distance - h));
    var diff = anotherPlayer.position.clone().subtract(player.position).normalize();
    var normalY = diff.clone();
    var normalX = normalY.clone().rotate(Math.PI / 2);

    var massSum = player.mass + anotherPlayer.mass;
    var massSub = player.mass - anotherPlayer.mass;

    var v1 = player.velocity.dot(normalY);
    var v2 = anotherPlayer.velocity.dot(normalY);

    var penetrationDepth = Math.sqrt(closestPossible) - Math.sqrt(distance);
    var correction = normalY.clone().multiplyScalar(penetrationDepth / (1 / player.mass + 1 / anotherPlayer.mass));

    player.position.add(correction.clone().multiplyScalar(-1 / player.mass));
    anotherPlayer.position.add(correction.clone().multiplyScalar(1 / anotherPlayer.mass));

    if (v1*v2 > 0 && ((v1 > 0 && Math.abs(v1) <= Math.abs(v2)) || (v1 < 0 && Math.abs(v2) <= Math.abs(v1)))) {
      return;
    }

    var newV1 = massSub / massSum * v1 + 2 * anotherPlayer.mass / massSum * v2;
    var newV2 = 2 * player.mass / massSum * v1 - massSub / massSum * v2;

    var ownY = normalY.clone().multiplyScalar(newV1 * this.world.bottomEdgeEnergyLost);
    var anotherY = normalY.clone().multiplyScalar(newV2 * this.world.bottomEdgeEnergyLost);

    var ownX = normalX.clone().multiplyScalar(player.velocity.dot(normalX));
    var anotherX = normalX.clone().multiplyScalar(anotherPlayer.velocity.dot(normalX));

    player.velocity = ownY.add(ownX) ;
    anotherPlayer.velocity = anotherY.add(anotherX);
    if (player.removeOnCollision || player.removeOnCollisionWithType.indexOf(anotherPlayer.type) > -1) {
      this.toRemoveElement(player);
    }

    if (anotherPlayer.removeOnCollision || anotherPlayer.removeOnCollisionWithType.indexOf(player.type) > -1) {
      this.toRemoveElement(anotherPlayer);
    }
  };
}
