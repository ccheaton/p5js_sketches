var debug = false;

var screen_width  = 5760;
var screen_height = 2304;

// Adjust for different screen sizes;
var run_factor    = 0.2;

// Values for working
var width_functional  = screen_width * run_factor;
var height_functional = screen_height * run_factor;

// Colors
var colors = [];

// Initialization
var golden_ratio        = 1.61803398875;
var arc_start           = width_functional / golden_ratio;
var arc_initial_dim     = 2 * (width_functional - arc_start);
var initial_arc         = null;
var angle               = 0;
var total_arcs          = 2;

// For the recursive creation of child arcs
var dist_along_arc = 80.0; // Where the next arc attaches to the parent arc.

//var angle_delta    = 30.0; // The rotation at the attachment point.

var size_delta     = 0.6;  // How much smaller a child should be than its parent

function setup() {
  createCanvas(width_functional, height_functional);

  // Create the colors for the sketch
  colors.push(color('#D40000'));
  colors.push(color('#FF3800'));
  colors.push(color('#B31B1B'));
  colors.push(color('#F94D00'));
  colors.push(color('#FF7E00'));
  colors.push(color('#FF2400'));
  colors.push(color('#E48400'));

  // Initialize the arcs
  initial_arc = new Arc(arc_start, height_functional, arc_initial_dim, total_arcs, 1.0, 0, false, null, 0);
}

function draw() {
  background(255);
  var targetX = mouseX;
  var targetY = mouseY;


  // initial_arc.x -= 1;
  // initial_arc.y -= 1;

  angleMode(DEGREES);
  push();
  // rotate(angle);

  initial_arc.draw();

  pop();
  // angle += 0.1;

  if (debug){
    stroke(255,0,0);
    strokeWeight(1);
    line(arc_start,0,arc_start,height_functional);
  }

  noLoop();

}

function Arc(_x,_y,_dim,_count,_size_factor,_angle,_auto_generated,_parent_arc,_color_index) {
  this.x              = _x;
  this.y              = _y;
  this.dim            = _dim;
  this.child          = null;
  this.auto_generated = _auto_generated;
  this.parent_arc     = _parent_arc;
  this.color_index    = _color_index;
  this.display_size   = _size_factor;
  this.angle          = _angle;


  // Generate child arcs
  if (_count > 0){
    var next_color_index = (this.color_index + 1) % colors.length;

    this.child = new Arc(_x,_y,_dim,_count - 1,this.display_size * size_delta, _angle - dist_along_arc ,true, this, next_color_index);
  }
}




Arc.prototype.point_along_arc = function(arc_angle){
  var x = this.x + this.dim/2.0 * cos(arc_angle);
  var y = this.y + this.dim/2.0 * sin(arc_angle);
  return createVector(x,y);
}




Arc.prototype.reposition = function(parent_arc){
  // This could be more interesting if each arc holds its own angle.
  var root_point     = this.parent_arc.point_along_arc(-dist_along_arc);
  var parent_center  = createVector(this.parent_arc.x,this.parent_arc.y);
  var new_center     = p5.Vector.lerp(parent_center, root_point, 1- size_delta);

  this.x   = new_center.x;
  this.y   = new_center.y;
  this.dim = this.parent_arc.dim * size_delta;
}




Arc.prototype.draw = function() {

  // Repositioning for child arcs
  if(this.auto_generated == true){
    this.reposition(this.parent_arc);
  }

  // Set the color and strokeWeight of this arc
  var c = colors[this.color_index];
  stroke(c);
  strokeWeight(this.display_size * (7 / run_factor));

  push();
  translate(this.x,this.y);
  console.log("Arc angle: " + this.angle);
  rotate(this.angle); // THis needs to be additive.
  // Draw this arc
  arc(0, 0, this.dim, this.dim, 45,-90 );
  pop();


  // Draw child arcs
  if(this.child !== null){
    this.child.draw();
  }
}