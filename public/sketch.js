var socket;
let words = [], sentence;
let font;
let showText = false;

function preload() {
  // Load a font file (replace 'your-font-file.ttf' with your actual font file)
  font = loadFont('./data/Raleway-Black.ttf');
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	textFont(font);
 	textSize(32);
 	textAlign(CENTER, CENTER);

	socket = io.connect('http://localhost:3000')
	socket.on('msg', newSentence);
}

function draw() {

	background(0);
	ellipse(width/2, windowHeight, 50, 50);

	if (showText) {
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      word.update();
      word.display();
    }
  }

}

function newSentence(data){

	sentence = data;

	let splitSentence = sentence.split(' ');
  words = [];

  let posX = width/2;
  let posY = height;
  for (let i = 0; i < splitSentence.length; i++) {
    let word = splitSentence[i];
    let wordObj = new Word(word, posX, posY);
    words.push(wordObj);
    posY += textSize();
  }
	showText = true;

}

// Testing ------------------------------ recreating server send message on mouse click -----------------------------
function mouseClicked(){
	testSentences();
}

// Testing
function testSentences(){
	var data = "this is a sentence"
	socket.emit('msg', data);
}

//------------------------------------- remove this block when not testing local server sends -------------------------

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}


class Word {
  constructor(word, x, y) {
    this.word = word;
    this.pos = createVector(x, y);
    this.vel = createVector(0, random(-1, -3));
    this.acc = createVector(0, 0);
    this.angle = random(-2.5, 0);
    this.smoke = [];
    this.alpha = 255;
  }

	update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.angle += 0.05;

    if (this.pos.y <= height*0.5) {
      if (this.alpha > 0) {
        this.alpha -= 5;
      }

    } else {
      this.acc.x = sin(this.angle) * 0.05;
      this.pos.x += this.acc.x; // Add this line to update the x-position based on the horizontal oscillation
		}

    if (this.alpha <= 0) {
      this.generateSmoke();
    }

    for (let i = 0; i < this.smoke.length; i++) {
      let p = this.smoke[i];
      p.update();
    }
	}

  display() {
    if (this.alpha > 0) {
      fill(255, this.alpha);
      noStroke();
      text(this.word, this.pos.x, this.pos.y);
    } else {
      for (let i = 0; i < this.smoke.length; i++) {
        let p = this.smoke[i];
        p.display();
      }
    }
  }
	generateSmoke() {
    let numParticles = 1;
    for (let i = 0; i < numParticles; i++) {
      let x = this.pos.x + random(-10, 10);
      let y = this.pos.y + random(-10, 10);
      let size = random(5, 10);
      let particle = new Particle(x, y, size);
      this.smoke.push(particle);
    }
  }
}

class Particle {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.5, 0.5), random(-1, -3));
    this.acc = createVector(0, 0);
    this.alpha = 255;
    this.size = size;
  }

  update() {
    this.vel.add(this.acc);
		this.pos.add(this.vel);
    this.acc.mult(0);
    this.alpha -= 2;

    if (this.alpha < 0) {
      this.alpha = 0;
    }
  }

  display() {
    fill(255, this.alpha);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
