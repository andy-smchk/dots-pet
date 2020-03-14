function World() {
  this.elements = [];
  this.G = new Victor(0, 10);
  this.bottomEdgeEnergyLost = 0.5 ;

  this.addElement = function (player) {
    this.elements.push(player);
  };

}