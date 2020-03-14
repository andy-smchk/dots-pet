var Renderer = function (context, drawer) {

  var world = new NoGravityWorld();
  var core = new Core(drawer, world);

  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback) {
      return setTimeout(callback, 1);
    };

  var mCurrentTime, mElapsedTime, mPreviousTime = Date.now(),
    mLagTime = 0;
  var kFPS = 30;
  var kFrameTime = 1 / kFPS;
  var mUpdateIntervalInSeconds = kFrameTime;
  var kMPF = 1000 * kFrameTime;


  return {
    init: function () {

      var editor = new Editor(core);

      // for (var i = 0; i < 200; i++) {
      //
      //   var angle = Helper.getRandomInt(0, 360) * Math.PI / 180;
      //   var newElement = new Player(i);
      //   newElement.direction = new Victor(Math.cos(angle), Math.sin(angle));
      //   newElement.position = new Victor(Helper.getRandomInt(0, context.width), Helper.getRandomInt(0, context.height));
      //   newElement.radius = 5;
      //   newElement.mass = 5;
      //   newElement.setSpeed(5);
      //
      //   core.addElement(newElement);
      // }

      var youLose = function () {
        alert('You lose!( Try again');
        location.reload();
      };

      var johnDoe = new Player(1);
      var sprite = new Image();
      sprite.src = 'rsz_1rsz_kindpng_1076693.png';
      johnDoe.direction = new Victor(0, 0);
      johnDoe.position = new Victor(500, 500);
      johnDoe.radius = 40;
      johnDoe.mass = 50;
      johnDoe.sprite = sprite;
      johnDoe.setSpeed(1);
      johnDoe.removeOnCollisionWithType = ['enemy'];
      johnDoe.beforeRemoveCallback = youLose;

      core.addElement(johnDoe);
      var bullets = 2000;
      var spriteBullet = new Image();
      spriteBullet.src = 'projectile-sprite-png-14.png';

      document.addEventListener('keydown', function(event) {
        if(event.keyCode === 32) {
          var bullet = new Player(bullets);
          bullet.color =  '#FFF';
          bullet.direction = new Victor(0, -1);
          bullet.position = johnDoe.position.clone().addScalarY( - johnDoe.radius - 10);
          bullet.radius = 5;
          bullet.mass = 10;
          bullet.type = 'projectile';
          bullet.sprite = spriteBullet;
          bullet.removeOnCollision = true;
          bullet.removeOnTopEdgeCollision = true;
          bullet.setSpeed(25);

          core.addElement(bullet);
          bullets++;

          return;
        }

        if(event.keyCode === 37) {
          var angle = 180 * Math.PI / 180;
        }
        else if(event.keyCode === 39) {
          var angle = 0;
        }
        else if(event.keyCode === 38) {
          var angle = 270 * Math.PI / 180;
        }
        else if(event.keyCode === 40) {
          var angle = 90 * Math.PI / 180;
        } else {
          return;
        }

        johnDoe.velocity.add((new Victor(Math.cos(angle), Math.sin(angle))).multiplyScalar(5));
      });

      var youWin = function () {
        alert('You won!!!) Try again');
        location.reload();
      };

      var enemiesLeft = 0;
      var enemyKill = function () {
        enemiesLeft--;
        if (enemiesLeft <= 0) {
          youWin();
        }
      };
      var sprite = new Image();
      sprite.src = 'rsz_asteroid-clipart-sprite-9-min.png';
      for (var i = 0; i < 10; i++) {
        enemiesLeft++;
        var angle = Helper.getRandomInt(0, 360) * Math.PI / 180;
        var newElement = new Player(1000 + i);
        newElement.direction = new Victor(Math.cos(angle), Math.sin(angle));
        newElement.position = new Victor(Helper.getRandomInt(100, context.width), Helper.getRandomInt(0, context.height * 0.2));
        newElement.setSpeed(5);
        newElement.radius = Helper.getRandomInt(20, 25);
        newElement.mass = 100;
        newElement.type = 'enemy';
        newElement.removeOnCollisionWithType = ['projectile'];
        newElement.beforeRemoveCallback = enemyKill;
        newElement.sprite = sprite;
        core.addElement(newElement);
      }

      /*
            var angle = 45 * Math.PI / 180;

            var newElement = new Player(1);
            newElement.direction = new Victor(Math.cos(angle), Math.sin(angle));
            newElement.position = new Victor(130, 300);
            newElement.setSpeed(0);
            newElement.radius = 50;
            newElement.mass = 100;
            core.addElement(newElement);

            var angle = 55 * Math.PI / 180;

            var newElement = new Player(3);
            newElement.direction = new Victor(Math.cos(angle), Math.sin(angle));
            newElement.position = new Victor(80, 500);
            newElement.setSpeed(0);
            newElement.radius = 50;
            newElement.mass = 100;
            core.addElement(newElement);
      */
      /*var angle = 0 * Math.PI / 180;

      var newElement = new Player(3);
      newElement.direction = new Victor(Math.cos(angle), Math.sin(angle));
      newElement.position = new Victor(50, 400);
      newElement.setSpeed(0);
      newElement.radius = 100;
      newElement.mass = 100;
      core.addElement(newElement);*/

      editor.init();
    },
    render: function () {
      var that = this;
      requestAnimationFrame(function () {
        that.render();
      });

      mCurrentTime = Date.now();
      mElapsedTime = mCurrentTime - mPreviousTime;
      mPreviousTime = mCurrentTime;
      mLagTime += mElapsedTime;

      while (mLagTime >= kMPF) {
        mLagTime -= kMPF;
        core.process(mUpdateIntervalInSeconds);
      }
      core.drawAll();
    }
  }

};

var context = new Canvas();
var drawer = new Drawer(context);
var renderer = new Renderer(context, drawer);
renderer.init();
