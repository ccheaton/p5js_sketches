var pg;
function setup() {
  createCanvas(100, 100);
  pg = createGraphics(100, 100);
}
function draw() {
  background(200);
  pg.background(100);
  pg.noStroke();
  pg.arc(pg.width/2, pg.height/2, 50, 50, 0,-90);
  image(pg, 50, 50);
  image(pg, 0, 0, 50, 50);
}