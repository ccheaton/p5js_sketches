// For the art wall at NCSU's Hunt Library
var screen_width  = 5760;
var screen_height = 2304;

// Optional mode with black background and white arcs
var black_bg_mode = false;

// Adjust for different screen sizes;
// Set this to 1.0 for full resolution of the hunt screen.
// 0.2 is good for development.
var run_factor    = 0.2;

// Values for working
var width_functional  = screen_width * run_factor;
var height_functional = screen_height * run_factor;

// Initialization
var arc_initial_diameter = height_functional * 1.5;

// Appearance
var total_arcs   = 150;
var stroke_width = 320 * run_factor;
var stroke_decay = 0.80;

var stroke_decay_oscillator;

var arc_diameter_decay      = 0.85;
var arc_diameter_decay_oscillator;

var arc_angle_of_attachment = -45.0;

var arc_degree_start = 90.0;
var arc_degree_stop  = -120.0;

var arc_degree_start_oscillator;
var arc_degree_stop_oscillator;

var colors;
var blue_colors   = [];
var orange_colors = [];
var green_colors  = [];
var maroon_colors = [];


var root_arc = null;
var root_arc_center;

// For rotation...
var rotate_angle       = 0.0;
var rotate_angle_delta = 0.2;
var rotation_oscillator;

// For animation
var spiral_center;
var wandering_x = 0.0;
var wandering_y = 0.0;

// For color shifting
var hour_of_day = 1;

function setup() {
  createCanvas(width_functional, height_functional);

  // Use degrees instead of radians because radians are confusing as shit
  angleMode(DEGREES);

  // Establish colors. I tried doing this in a function but it was 
  // executed asynchronously and did not complete before the colors
  // were needed below. The color() object does not exist until we are
  // in setup().
  blue_colors.push(color('#0E4E7F'));
  blue_colors.push(color('#51B3FF'));
  blue_colors.push(color('#1D9DFF'));
  blue_colors.push(color('#649EDB'));
  blue_colors.push(color('#176FCC'));
  blue_colors.push(color('#768EBD'));
  blue_colors.push(color('#58CFFF'));

  orange_colors.push(color('#D40000'));
  orange_colors.push(color('#FF3800'));
  orange_colors.push(color('#B31B1B'));
  orange_colors.push(color('#F94D00'));
  orange_colors.push(color('#FF7E00'));
  orange_colors.push(color('#FF2400'));
  orange_colors.push(color('#E48400'));

  green_colors.push(color('#00CC31'));
  green_colors.push(color('#3A7047'));
  green_colors.push(color('#00B22B'));
  green_colors.push(color('#2ABF4E'));
  green_colors.push(color('#007F1F'));
  green_colors.push(color('#5FBF64'));
  green_colors.push(color('#357048'));

  maroon_colors.push(color('#75111B'));
  maroon_colors.push(color('#96434C'));
  maroon_colors.push(color('#C91D2F'));
  maroon_colors.push(color('#D25E6A'));
  maroon_colors.push(color('#961623'));
  maroon_colors.push(color('#C9261E'));
  maroon_colors.push(color('#962A48'));

  var d = new Date();
  hour_of_day = d.getHours();
  var c = hour_of_day % 4;

  if (c == 0) {
    // Blue
    colors = blue_colors;
  } else if (c == 1) {
    // Red and Orange
    colors = orange_colors;
  } else if (c == 2) {
    // Green
    colors = green_colors;
  } else if (c == 3) {
    // Maroon
    colors = maroon_colors;
  }

  spiral_center = createVector(0,0);

  arc_diameter_decay_oscillator = new Oscillator(0.6,0.85,0.05);
  arc_degree_start_oscillator   = new Oscillator(1,360,0.09);
  arc_degree_stop_oscillator    = new Oscillator(-1,-360,0.06);
  rotation_delta_oscillator     = new Oscillator(-0.1,0.5,0.1);
  stroke_decay_oscillator       = new Oscillator(0.55,0.90,0.07);

  root_arc_center = createVector(width_functional/2.0,height_functional/2.0);
  root_arc = new Arc(root_arc_center, arc_initial_diameter, arc_degree_start, arc_degree_stop, stroke_width, total_arcs - 1, true, arc_angle_of_attachment, null, 0);

}

function draw() {

  if(black_bg_mode){
    background(0);
  } else {
    background(0);
  }

  // Check if we need to change color templates
  setColors();

  // The remaining draw elements are done in a callback.

}

function setColors(){
  var d = new Date();
  var _hour = d.getHours();

  if (_hour != hour_of_day) {
    hour_of_day = _hour;
    var c = hour_of_day % 4;

    if (c == 0) {
      colors = blue_colors;
    } else if (c == 1) {
      colors = orange_colors;
    } else if (c == 2) {
      colors = green_colors;
    } else if (c == 3) {
      colors = maroon_colors;
    }
  }

  draw_rest()
}

// This is a callback just to make sure that the colors are set properly when they change.
function draw_rest() {
  var rot_delta = rotation_delta_oscillator.oscillate();
  rotate_angle -= rot_delta;  //rotate_angle_delta;

  push();
  translate(width_functional/2,height_functional/2);
  rotate(rotate_angle);

  // Update the arc start and stop degrees...
  var new_start = arc_degree_start_oscillator.oscillate();
  var new_stop  = arc_degree_stop_oscillator.oscillate();
  root_arc.update_arc_degrees(new_start, new_stop);

  // Update the diameter decay values...
  var new_diameter_decay = arc_diameter_decay_oscillator.oscillate();
  root_arc.update_diameter_decay(new_diameter_decay);

  var new_stroke_decay = stroke_decay_oscillator.oscillate();
  root_arc.update_stroke_decay(new_stroke_decay);

  root_arc.draw();
  pop();
}






function Arc(_center,_diameter,_degree_start,_degree_stop,_stroke_width,_arc_count, _is_root, _attachment_angle, _parent_arc, _color_index){
  this.center           = _center;
  this.diameter         = _diameter;
  this.degree_start     = _degree_start;
  this.degree_stop      = _degree_stop;
  this.stroke_width     = _stroke_width;
  this.is_root          = _is_root;
  this.attachment_angle = _attachment_angle;
  this.color_index      = _color_index;
  this.child_arc        = null;
  this.parent_arc       = _parent_arc;

  // Recursively create child arcs, if there are any to be created.
  if(_arc_count > 0){
    var new_diameter         = this.diameter * arc_diameter_decay;
    var new_degree_start     = this.degree_start + arc_angle_of_attachment;
    var new_degree_stop      = this.degree_stop  + arc_angle_of_attachment;
    var new_stroke_width     = this.stroke_width * stroke_decay;
    var new_attachment_angle = this.attachment_angle + arc_angle_of_attachment;
    var new_color_index      = (this.color_index + 1) % colors.length;

    this.child_arc = new Arc(_center.copy(), new_diameter, new_degree_start, new_degree_stop, new_stroke_width, _arc_count - 1, false, new_attachment_angle, this, new_color_index);
  }
}

// For updating the root Arc -- changes propagate
Arc.prototype.update_arc_degrees = function(_start_degree, _stop_degree){
  this.degree_start = _start_degree;
  this.degree_stop  = _stop_degree;

  if (this.child_arc !== null){
    var new_start_degree = this.degree_start + arc_angle_of_attachment;
    var new_stop_degree  = this.degree_stop  + arc_angle_of_attachment;
    this.child_arc.update_arc_degrees(new_start_degree, new_stop_degree);
  }
}

// For updating the diameter decay on the root arc - changes propagate
Arc.prototype.update_diameter_decay = function(_new_diameter_decay){

  // Do not change the diameter of the outermost arc
  if (!this.is_root){
    this.diameter = this.parent_arc.diameter * _new_diameter_decay;
  }

  if (this.child_arc !== null) {
    var new_child_diameter = this.diameter * _new_diameter_decay;
    this.child_arc.update_diameter_decay(_new_diameter_decay);
  }
}

// For updating the arc's angle of attachment
Arc.prototype.update_arc_angle_of_attachment = function (_new_arc_angle_of_attachment){

  this.attachment_angle = _new_arc_angle_of_attachment;

  if (this.child_arc !== null) {
    var new_child_arc_angle_of_attachment = this.attachment_angle;// + _new_arc_angle_of_attachment;
    this.child_arc.update_arc_angle_of_attachment(new_child_arc_angle_of_attachment);
  }

}

// For updating the arc's stroke decay
Arc.prototype.update_stroke_decay = function (_new_stroke_decay) {
  if (!this.is_root){
    this.stroke_width = this.parent_arc.stroke_width * _new_stroke_decay;
  }

  if (this.child_arc !== null){
    this.child_arc.update_stroke_decay(_new_stroke_decay);
  }
}


Arc.prototype.point_along_arc = function (cx, cy, diameter, arc_angle){
  var x = cx + diameter/2.0 * cos(arc_angle);
  var y = cy + diameter/2.0 * sin(arc_angle);
  return createVector(x,y);
}

Arc.prototype.set_position = function(){

  var vecB       = this.point_along_arc(this.parent_arc.center.x, this.parent_arc.center.y, this.parent_arc.diameter, this.attachment_angle);
  var vecA       = createVector(this.parent_arc.center.x,this.parent_arc.center.y);
  var new_center = p5.Vector.lerp(vecA,vecB,1- arc_diameter_decay);

  this.center = createVector(new_center.x,new_center.y);

  if (this.child_arc == null){
    spiral_center = this.center;
  }

}


Arc.prototype.draw = function(){

  // Position child arcs
  if (this.is_root == false){
    this.set_position();
  }

  // Draw the arc
  strokeWeight(this.stroke_width);
  noFill();

  if(black_bg_mode){
    stroke(255,255,255,200);
  } else {
    stroke(colors[this.color_index]);
  }

  push();
  // We rotate around the spiral center, so this has to offset by the outer transformation matrix
  // and also by the position of the arc itself.
  translate(-spiral_center.x, -spiral_center.y);
  arc(this.center.x,this.center.y,this.diameter,this.diameter,this.degree_start,this.degree_stop);
  pop();


  // Recursively draw the children arcs
  if (this.child_arc !== null){
    this.child_arc.draw();
  }
}

// A class to provide custom oscillation for values
function Oscillator(_min,_max,_rate){
  this.min   = _min;
  this.max   = _max;
  this.theta = 0;
  this.rate  = _rate;
  this.diff  = this.max - this.min;

  this.current_value = _min;
}

Oscillator.prototype.oscillate = function(){
  this.theta += this.rate;
  var delta = abs(sin(this.theta) * this.diff);
  this.current_value = this.min + delta;
  return this.current_value;
}


















