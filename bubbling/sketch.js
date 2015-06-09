
var root_bubble;
var num_children_bubbles = 3;
var root_bubble_diameter = 80;

function setup() {
  createCanvas(500, 500);
  frameRate(1);

  // Where will the root be?
  var rootCenter = createVector(400,250);

  // Instantiate the root bubble
  root_bubble = new Bubble(rootCenter, root_bubble_diameter, num_children_bubbles, null, true);
}

function draw() {
  background(255);
  root_bubble.draw();
}



function Bubble(_center, _diameter, _num_children, _parent_bubble, _is_root){
  this.center           = _center;
  this.diameter         = _diameter;
  this.is_root          = _is_root;
  this.child_bubble     = null;
  this.parent_bubble    = _parent_bubble;

  if(_num_children > 0){
    var defaultCenter = createVector(0,0); // Position is updated in Bubble.prototype.draw

    this.child_bubble = new Bubble(defaultCenter, _diameter * 0.5, _num_children - 1, this, false);
  }
}

Bubble.prototype.set_position = function(){
  this.center.x  = this.parent_bubble.center.x - 60;
  this.center.y  = this.parent_bubble.center.y - 60;
}


Bubble.prototype.draw = function(){

  // Determine position of non-root bubbles
  if (this.is_root == false){
    this.set_position();
  }

  // Draw this bubble
  fill(128);
  noStroke();
  ellipse(this.center.x,this.center.y,this.diameter, this.diameter);

  // Draw all of the children bubbles
  if (this.child_bubble !== null){
    this.child_bubble.draw();
  }
}


















