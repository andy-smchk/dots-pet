function Editor(core) {
  this.world = core.world;
  this.core = core;
  this.currentMousePosition = new Victor(0, 0);
  this.selectedElement = null;

  this.init = function () {
    var that = this;
    this.gui = new dat.GUI( { width: 200 });
    this.settings = {
      'Pause Simulation': this.core.pause,
      'Draw mode': this.core.drawMode,
      'Display helpers': this.core.drawer.displayHelpers,
      'Drag Selected Element': false,
      'Enable creating': false,
      'mass': 0,
      'radius': 0,
      'Direction': 0,
      'Color': '#fff',
      'Speed': 0
    };

    this.commonFolder = this.gui.addFolder( 'Common' );
    this.selectedElementFolder = this.gui.addFolder( 'Selected Element' );

    this.commonFolder.add(this.settings, 'Pause Simulation').onChange(function(pause){
      that.core.pause = pause;
    });

    this.commonFolder.add(this.settings, 'Enable creating');

    this.commonFolder.add(this.settings, 'Display helpers').onChange(function(val){
      that.core.drawer.displayHelpers = val;
    });

    this.commonFolder.add(this.settings, 'Draw mode').onChange(function(val){
      that.core.drawMode = val;
    });

    this.selectedElementFolder.add(this.settings, 'mass').onChange(function (mass) {
      if (that.selectedElement) {
        that.selectedElement.mass = mass;
      }
    });

    this.selectedElementFolder.add(this.settings, 'radius').onChange(function (radius) {
      if (that.selectedElement) {
        that.selectedElement.radius = radius;
      }
    });

    this.selectedElementFolder.add(this.settings, 'Direction', -360, 360).onChange(function (val) {
      if (that.selectedElement) {
        var angle = val * Math.PI / 180;
        that.selectedElement.direction = new Victor(Math.cos(angle), Math.sin(angle));
        that.selectedElement.direction.normalize();
        that.selectedElement.update();
      }
    });

    this.selectedElementFolder.addColor(this.settings, 'Color').onChange(function (val) {
      if (that.selectedElement) {
        that.selectedElement.color = val;
      }
    });

    this.selectedElementFolder.add(this.settings, 'Speed').onChange(function (val) {
      if (that.selectedElement) {
        that.selectedElement.setSpeed(val);
      }
    });

    this.selectedElementFolder.add(this.settings, 'Drag Selected Element');

    this.commonFolder.update = update;
    this.selectedElementFolder.update = update;

    function update () {
      for (var i in this.__controllers) {
        this.__controllers[i].updateDisplay();
      }
    }

    var canvas = document.getElementById("board");
    canvas.addEventListener('click', function (e) {
      that.clickTrack(e);
    });
    canvas.addEventListener('mousemove', function (e) {
      that.trackMouse(e);
    });

    document.onkeydown = function(e){
      if (e.keyCode == '8' || e.keyCode == '46') {
        that.deleteElement();
      }
    };
  };


  this.clickTrack = function (e) {

    if (this.selectedElement && this.settings['Drag Selected Element']) {
      this.releaseElement();
      return;
    }

    for(var i = 0; i < this.world.elements.length; i++) {
      var element = this.world.elements[i];
      var distance = this.currentMousePosition.distance(element.position);

      if (distance >= element.radius) {
        continue;
      }

      this.selectElement(element);
      return;
    }

    if (!this.settings['Enable creating']) {
      return;
    }

    var newElement = new Player(this.world.elements.length + 1);
    newElement.direction = new Victor(0, 0);
    newElement.position = this.currentMousePosition.clone();
    this.world.addElement(newElement);

    this.selectElement(newElement);
  };

  this.deleteElement = function () {
    if (!this.selectedElement) {
      return;
    }

    for(var i = 0; i < this.world.elements.length; i++) {
      var element = this.world.elements[i];
      if (this.selectedElement.id == element.id) {
        this.world.elements.splice(i, 1);
        this.releaseElement();
        return;
      }
    }

  };


  this.releaseElement = function () {
    this.selectedElement = null;
    this.settings.mass = 0;
    this.settings.radius = 0;
    this.settings['Direction'] = 0;
    this.settings['Color'] = '#fff';
    this.settings['Speed'] = 0;
    this.selectedElementFolder.update();
  };

  this.selectElement = function (element) {
    console.log(element);

    this.selectedElement = element;
    this.settings.mass = element.mass;
    this.settings.radius = element.radius;
    this.settings['Direction'] = element.direction.horizontalAngleDeg();
    this.settings['Color'] = element.color;
    this.settings['Speed'] = element.speed;
    this.selectedElementFolder.update();
  };

  this.trackMouse = function (e) {
    this.currentMousePosition.x = e.clientX;
    this.currentMousePosition.y = e.clientY;

    if (this.selectedElement && this.settings['Drag Selected Element']) {
      this.selectedElement.position = this.currentMousePosition.clone();
    }
  };
}