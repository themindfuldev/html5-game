function Avatar(filename, extension, x, y) {
  this.x = x;
  this.y = y;
  this.width = 300;
  this.height = 283;
  this.halfWidth = this.width/2;
  this.halfHeight = this.height/2;
  this.init(filename, extension);
}

Avatar.prototype = {
  imgRightLoaded: false,
  imgLeftLoaded: false,
  currentImage: 'Right',

  init: function(filename, extension) {
    var self = this;
    this.imgRight = new Image();
    this.imgRight.onload = function() {
      self.imgRightLoaded = true;
    }
    this.imgRight.src = filename+'Right'+extension;
	this.imgLeft = new Image();
    this.imgLeft.onload = function() {
      self.imgLeftLoaded = true;
    }
    this.imgLeft.src = filename+'Left'+extension;
  },

  draw: function(context) {
	if (this.currentImage == 'Right') {
		if (this.imgRightLoaded) {
		  context.drawImage(this.imgRight, this.x, this.y);
		}
	}
	else if (this.currentImage == 'Left') {
		if (this.imgLeftLoaded) {
		  context.drawImage(this.imgLeft, this.x, this.y);
		}	
	}
  },

  erase: function(context) {
    context.clearRect(this.x, this.y, this.width, this.height);
  },

  move: function(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
};

function Coordinates(x, y) {
	this.x = x;
	this.y = y;
}

function drawWindow(context, x, y) {
	// Structure
	context.fillStyle = '#110000';
	context.strokeStyle = '#330000';
	context.fillRect(x, y, 100, 100);
	
	// Glasses
	context.fillStyle = '#52A8FF';
	context.strokeRect(x, y, 100, 100);
	context.fillRect(x+10, y+10, 35, 35);
	context.strokeRect(x+10, y+10, 35, 35);
	context.fillRect(x+55, y+10, 35, 35);
	context.strokeRect(x+55, y+10, 35, 35);
	context.fillRect(x+10, y+55, 35, 35);
	context.strokeRect(x+10, y+55, 35, 35);
	context.fillRect(x+55, y+55, 35, 35);
	context.strokeRect(x+55, y+55, 35, 35);
	
	// Wings
	context.fillStyle = '#110000';
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x-30, y-30);
	context.lineTo(x-30, y+130);
	context.lineTo(x, y+100);
	context.stroke();
	context.fill();
	context.beginPath();
	context.moveTo(x, y+20);
	context.lineTo(x-30, y);
	context.moveTo(x, y+40);
	context.lineTo(x-30, y+30);
	context.moveTo(x, y+60);
	context.lineTo(x-30, y+70);
	context.moveTo(x, y+80);
	context.lineTo(x-30, y+100);
	context.stroke();
	
	context.beginPath();
	context.moveTo(x+100, y);
	context.lineTo(x+130, y-30);
	context.lineTo(x+130, y+130);
	context.lineTo(x+100, y+100);
	context.stroke();
	context.fill();
	context.beginPath();
	context.moveTo(x+100, y+20);
	context.lineTo(x+130, y);
	context.moveTo(x+100, y+40);
	context.lineTo(x+130, y+30);
	context.moveTo(x+100, y+60);
	context.lineTo(x+130, y+70);
	context.moveTo(x+100, y+80);
	context.lineTo(x+130, y+100);
	context.stroke();
}

function drawStairs(context, x, y, steps) {
	var i, stepX = 20, stepY = 0;
	context.fillStyle = '#110000';
	context.strokeStyle = '#330000';
	context.beginPath();
	context.moveTo(x, y);
	for (i=0; i<steps; i++) {	
		context.lineTo(x+stepX, y+stepY);
		stepY += 20;
		context.lineTo(x+stepX, y+stepY);	
		stepX += 20;
	}
	context.lineTo(x, y+stepY);
	context.stroke();
	context.fill();
}

function drawBackground(context) {
	// Background gradient
	var backgroundGradient = context.createLinearGradient(0, 0, 0, 550);
	backgroundGradient.addColorStop(0, 'black');
	backgroundGradient.addColorStop(1, '#000033');
	context.fillStyle = backgroundGradient;
	context.fillRect(0, 0, 1000, 550);
	
	// Windows
	drawWindow(context, 100, 100);
	drawWindow(context, 450, 100);
	drawWindow(context, 800, 100);
	
	// Stairs
	drawStairs(context, 0, 250, 15);
}

var avatar = new Avatar("boo", ".png", 0, 0);
var destination = new Coordinates(avatar.halfWidth, avatar.halfHeight);

$(document).ready(function() {	
	var context = $("#game-canvas")[0].getContext("2d");
	context.lineWidth = 2;
	
	drawBackground(context);
	
	avatar.draw(context);

	// Starting the avatar movement
	startAvatar(context);

	// Starting the event listeners
	$(document).bind("keydown", moveAvatarByKeystroke);
	$(document).bind("mousemove", moveAvatarByMouseMove);
});

/**
 Event listener to the keystroke
 @param event The event
*/
function moveAvatarByKeystroke(event) {
	
	switch (event.which) {
		case 37: destination.x -= 50; break; // left
		case 38: destination.y -= 50; break; // up
		case 39: destination.x += 50; break; // right
		case 40: destination.y += 50; break; // down
	}
}

/**
 Event listener to the mouse move
 @param event The event
*/
function moveAvatarByMouseMove(event) {
	var eventX = event.pageX;
	var eventY = event.pageY;
	
	if  (eventX < avatar.x || eventX > avatar.x+avatar.width || eventY < avatar.y || eventY > avatar.y+avatar.height) {
		destination.x = eventX;
		destination.y = eventY;
	}
	
}

/**
 Starts the avatar movement
*/
function startAvatar(context) {
	var currentX = avatar.halfWidth;
	var currentY = avatar.halfHeight;
	
	var timeoutId = window.setInterval(function() {
		if (Math.abs(currentX-destination.x) > 1 || Math.abs(currentY-destination.y) > 1) {
			// Image swap
			if (currentX < destination.x) {
				avatar.currentImage = "Right";
			}
			else if (currentX > destination.x) {
				avatar.currentImage = "Left";
			}
			
			// Movement
			if (destination.x-currentX > 1) {
				currentX++;
			}
			else if (currentX-destination.x > 1) {
				currentX--;
			}			
			if (destination.y-currentY > 1) {
				currentY++;
			}
			else if (currentY-destination.y > 1) {
				currentY--;
			}

			// Rendering			
			avatar.x = currentX-avatar.halfWidth;
			avatar.y = currentY-avatar.halfHeight;
			
			drawBackground(context);
			avatar.draw(context);
		}
	}, 10);
}