var debug = false;

var screen_width  = 5760;
var screen_height = 2304;

// Adjust for different screen sizes;
var run_factor    = 0.2;

// Values for working
var width_functional  = screen_width * run_factor;
var height_functional = screen_height * run_factor;

// Initialization
var golden_ratio         = 1.61803398875;
var arc_start            = width_functional / golden_ratio;
var arc_initial_diameter = 2 * (width_functional - arc_start);

// Appearance
var total_arcs   = 20;                        // How to change this?
var stroke_width = 220 * run_factor;          // oscillate
var stroke_decay = 0.75;                      // oscillate

var arc_diameter_decay      = 0.7;            // oscillate
var arc_angle_of_attachment = -45.0;          // oscillate

var arc_degree_start        = 90.0;           // oscillate
var arc_degree_stop         = -120.0;         // oscillate

var colors   = [];                            // Change based on time of day?
var root_arc = null;

function setup() {
  createCanvas(width_functional, height_functional);

  // Use degrees instead of radians
  angleMode(DEGREES);

  // Create the colors for the sketch
  colors.push(color('#D40000'));
  colors.push(color('#FF3800'));
  colors.push(color('#B31B1B'));
  colors.push(color('#F94D00'));
  colors.push(color('#FF7E00'));
  colors.push(color('#FF2400'));
  colors.push(color('#E48400'));

  var initial_arc_center = createVector(arc_start,height_functional);
  root_arc = new Arc(initial_arc_center, arc_initial_diameter, arc_degree_start, arc_degree_stop, stroke_width, total_arcs - 1, true, 0, null, 0);
}

function draw() {
  background(255);
  root_arc.draw();
  noLoop();
}



function Arc(_center,_diameter,_degree_start,_degree_stop,_stroke_width,_arc_count, _is_root, _attachment_angle, _parent, _color_index){
  this.center           = _center;
  this.diameter         = _diameter;
  this.degree_start     = _degree_start;
  this.degree_stop      = _degree_stop;
  this.stroke_width     = _stroke_width;
  this.is_root          = _is_root;
  this.attachment_angle = _attachment_angle;
  this.color_index      = _color_index;

  this.child        = null;
  this.parent       = _parent;

  if(_arc_count > 0){
    var new_diameter         = this.diameter * arc_diameter_decay;
    var new_degree_start     = this.degree_start + arc_angle_of_attachment;
    var new_degree_stop      = this.degree_stop  + arc_angle_of_attachment;
    var new_stroke_width     = this.stroke_width * stroke_decay;
    var new_attachment_angle = this.attachment_angle + arc_angle_of_attachment;
    var new_color_index      = (this.color_index + 1) % colors.length;

    this.child = new Arc(_center, new_diameter, new_degree_start, new_degree_stop, new_stroke_width, _arc_count - 1, false, new_attachment_angle, this, new_color_index);
  }
}

Arc.prototype.point_along_arc = function(arc_angle){
  var x = this.center.x + this.diameter/2.0 * cos(arc_angle);
  var y = this.center.y + this.diameter/2.0 * sin(arc_angle);
  return createVector(x,y);
}

Arc.prototype.set_position = function(){
  var vecB       = this.parent.point_along_arc(this.attachment_angle);
  var vecA       = createVector(this.parent.center.x,this.parent.center.y);
  var new_center = p5.Vector.lerp(vecA,vecB,1- arc_diameter_decay);

  this.center.x  = new_center.x;
  this.center.y  = new_center.y;
}


Arc.prototype.draw = function(){

  if (this.is_root === false){
    // Process subsequent arcs
    this.set_position();
  }

  strokeWeight(this.stroke_width);
  noFill();
  stroke(colors[this.color_index]);
  arc(this.center.x,this.center.y,this.diameter,this.diameter,this.degree_start,this.degree_stop);



  // Draw all of the children arcs
  if (this.child !== null){
    this.child.draw();
  }
}


















