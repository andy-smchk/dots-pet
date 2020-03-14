function NoGravityWorld() {
  this.elements = [];
  this.G = new Victor(0, 0);
  this.bottomEdgeEnergyLost = 1;

  this.addElement = function (player) {
    this.elements.push(player);
  };

}