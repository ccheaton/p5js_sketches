// Test to gauge performance when using an offscreen graphics buffer
// to write images and then transferring them to the screen. This was
// suggested as a possible route to improving performance at high resolution.
// Results: sketch remains non-performant.


// For the art wall at NCSU's Hunt Library
var screen_width  = 5760;
var screen_height = 2304;

// Adjust for different screen sizes;
// Set this to 1.0 for full resolution of the hunt screen.
// 0.2 is good for development.
var run_factor        = 1;   // Set to 0.2 to gauge performance on a laptop.

// Buffer will be 1/5th the size of the wall resolution. 3.0 will be 1/3 the wall res, etc.
var buffer_factor     = 5.0;

var width_functional  = screen_width * run_factor;
var height_functional = screen_height * run_factor;

var xDir = 1;
var yDir = 1;

var xPos = 0;
var yPos = 0;

var pg;
function setup() {
  createCanvas(width_functional, height_functional);
  pg = createGraphics(width_functional/buffer_factor, height_functional/buffer_factor);
}
function draw() {
  pg.background(color('#D40000'));
  pg.strokeWeight(0);
  pg.fill(color('#E48400'))
  pg.ellipse(xPos,yPos,100,100)
  image(pg, 0, 0, width_functional, height_functional);

  xPos += (1*xDir);
  yPos += (1*yDir);

  if (xPos > pg.width || xPos < 0) {
    xDir *= -1;
  }

  if (yPos > pg.height || yPos < 0) {
    yDir *= -1;
  }

}