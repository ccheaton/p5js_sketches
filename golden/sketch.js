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
var total_arcs   = 30;                        // How to change this?
var stroke_width = 220 * run_factor;          // oscillate
var stroke_decay = 0.75;                      // oscillate

var arc_diameter_decay      = 0.7;            // oscillate
var arc_angle_of_attachment = -45.0;          // oscillate

/* When creating child arcs, the center of the child arc is equivalent
to a point on a circle that is equal to the point on the arc of the
parent arc to which we're attaching. The new_center_angle_offset is
in place to allow for rotating around the attachment point. */

var new_center_angle        = 180.0 + arc_angle_of_attachment;
var new_center_angle_offset = 0;              // oscillate

var arc_degree_start        = 90.0;           // oscillate
var arc_degree_stop         = -120.0;         // oscillate

var colors   = [];                            // Change based on time of day?
var root_arc = null;

var rotate_angle = 0.0;

var skip_loop = true;

function setup() {
  createCanvas(width_functional, height_functional);
  frameRate(4);
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
  this.position_set     = false;

  this.child_arc        = null;
  this.parent_arc       = _parent_arc;

  if(_arc_count > 0){
    var new_diameter         = this.diameter * arc_diameter_decay;
    var new_degree_start     = this.degree_start + arc_angle_of_attachment;
    var new_degree_stop      = this.degree_stop  + arc_angle_of_attachment;
    var new_stroke_width     = this.stroke_width * stroke_decay;
    var new_attachment_angle = this.attachment_angle + arc_angle_of_attachment;
    var new_color_index      = (this.color_index + 1) % colors.length;

    this.child_arc = new Arc(_center, new_diameter, new_degree_start, new_degree_stop, new_stroke_width, _arc_count - 1, false, new_attachment_angle, this, new_color_index);
  }
}

/* Utility function for finding a point on a circle or arc */
Arc.prototype.point_along_arc = function (cx, cy, diameter, arc_angle){
  var x = cx + diameter/2.0 * cos(arc_angle);
  var y = cy + diameter/2.0 * sin(arc_angle);
  return createVector(x,y);
}

Arc.prototype.set_position = function(){

  var vecB       = this.point_along_arc(this.parent_arc.center.x, this.parent_arc.center.y, this.parent_arc.diameter, this.attachment_angle);
  var vecA       = createVector(this.parent_arc.center.x,this.parent_arc.center.y);
  var new_center = p5.Vector.lerp(vecA,vecB,1- arc_diameter_decay);

  // Comment this out and uncomment the two lines below it and watch the difference in behavior
  this.center = createVector(new_center.x,new_center.y);

  // this.center.x  = new_center.x;
  // this.center.y  = new_center.y;
}


Arc.prototype.draw = function(){

  // Position child arcs
  if (this.is_root == false){
    this.set_position();
  }

  // Draw the arc
  strokeWeight(this.stroke_width);
  noFill();
  stroke(colors[this.color_index]);
  arc(this.center.x,this.center.y,this.diameter,this.diameter,this.degree_start,this.degree_stop);



  // Recursively draw the children arcs
  if (this.child_arc !== null){
    this.child_arc.draw();
  }
}


















