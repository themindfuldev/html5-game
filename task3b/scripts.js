/**
 ImagePreloader definition
*/
function ImagePreloader(images, callBack) {
   // store the call-back
   this.callBack = callBack;

   // initialize internal state.
   this.nLoaded = 0;
   this.nProcessed = 0;
   this.aImages = new Array;

   // record the number of images.
   this.nImages = images.length;

   // for each image, call preload()
   for (var i = 0; i < images.length; i++) {
      this.preload(images[i]);
  }
}

ImagePreloader.prototype = {
	preload: function(image) {
	   // create new Image object and add to array
	   var oImage = new Image;
	   this.aImages.push(oImage);

	   // set up event handlers for the Image object
	   oImage.onload = ImagePreloader.prototype.onload;
	   oImage.onerror = ImagePreloader.prototype.onerror;
	   oImage.onabort = ImagePreloader.prototype.onabort;

	   // assign pointer back to this.
	   oImage.oImagePreloader = this;
	   oImage.bLoaded = false;

	   // assign the .src property of the Image object
	   oImage.src = image;
	},

	onComplete: function() {
	   this.nProcessed++;
	   if (this.nProcessed == this.nImages)  {
		  this.callBack(this.aImages);
	   }
	},

	onload: function() {
	   this.bLoaded = true;
	   this.oImagePreloader.nLoaded++;
	   this.oImagePreloader.onComplete();
	},

	onerror: function() {
	   this.bError = true;
	   this.oImagePreloader.onComplete();
	},

	onabort: function() {
	   this.bAbort = true;
	   this.oImagePreloader.onComplete();
	}
}

/**
 Avatar definition
*/
function Avatar(filename, x, y) {
  this.x = x;
  this.y = y;
  this.init(filename);
}

Avatar.prototype = {
  init: function(filename) {
    //this.image = new Image();
    //this.image.src = filename;
	this.image = filename;
  },

  draw: function(context) {
	context.drawImage(this.image, this.x, this.y);
  },

  erase: function(context) {
    context.clearRect(this.x, this.y, this.image.width, this.image.height);
  },

  move: function(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
};

/**
 GameManager definition
*/
function GameManager(imageList) {
	this.avatarList = this.createObjects(imageList);

	this.context = $("#game-canvas")[0].getContext("2d");
	this.context.lineWidth = 2;
	
	this.drawBackground();	
	
	var self = this;
	
	$(document).bind("mousedown", function(event) {
		var i;
		for (i in self.avatarList) {
			if (event.pageX > self.avatarList[i].x && event.pageX < self.avatarList[i].x+self.avatarList[i].image.width &&
				event.pageY > self.avatarList[i].y && event.pageY < self.avatarList[i].y+self.avatarList[i].image.height) {
					self.avatarIsDragging = true;			
					self.avatarOnDrag = self.avatarList[i];
					
					$("body").css('cursor', 'pointer');
					
					self.avatarOnDrag.differenceX = event.pageX - self.avatarOnDrag.x;
					self.avatarOnDrag.differenceY = event.pageY - self.avatarOnDrag.y;					
					break;
			}
		}
	});
	
	$(document).bind("mousemove", function(event) {
		if (self.avatarIsDragging === true) {	
			self.avatarOnDrag.x = event.pageX - self.avatarOnDrag.differenceX;
			self.avatarOnDrag.y = event.pageY - self.avatarOnDrag.differenceY;
			self.drawBackground();
		}
	});
	
	$(document).bind("mouseup", function(event) {
		if (self.avatarIsDragging === true) {	
			self.avatarIsDragging = false;			
			
			self.avatarOnDrag.x = (Math.floor((event.pageX-self.initialX) / self.squareSize))*self.squareSize + self.initialX + self.innerGap;
			self.avatarOnDrag.y = (Math.floor((event.pageY-self.initialY) / self.squareSize))*self.squareSize + self.initialY + self.innerGap;
			self.avatarOnDrag = undefined;
			
			self.drawBackground();			
			$("body").css('cursor', 'auto');
		}
	});

}

GameManager.prototype = {	
	avatarOnDrag: undefined,
	avatarIsDragging: false,
	initialX: 250,
	initialY: 25,
	squareSize: 100,
	innerGap: 10,

	createObjects: function(imageList) {
		var avatarList = new Array();
		avatarList.push(new Avatar(imageList[0], this.initialX+this.innerGap, this.initialY+this.innerGap));
		avatarList.push(new Avatar(imageList[0], this.initialX+this.squareSize*2+this.innerGap, this.initialY+this.innerGap));
		avatarList.push(new Avatar(imageList[0], this.initialX+this.squareSize*4+this.innerGap, this.initialY+this.innerGap));
		avatarList.push(new Avatar(imageList[1], this.initialX+this.innerGap, this.initialY+this.squareSize*4+this.innerGap));
		avatarList.push(new Avatar(imageList[1], this.initialX+this.squareSize*2+this.innerGap, this.initialY+this.squareSize*4+this.innerGap));
		avatarList.push(new Avatar(imageList[1], this.initialX+this.squareSize*4+this.innerGap, this.initialY+this.squareSize*4+this.innerGap));
		return avatarList;
	},
	
	drawBackground: function() {
		// Background gradient	
		var backgroundGradient = this.context.createLinearGradient(0, 0, 0, 550);
		backgroundGradient.addColorStop(0, '#663300');
		backgroundGradient.addColorStop(1, '#660000');
		this.context.fillStyle = backgroundGradient;
		this.context.fillRect(0, 0, 1000, 550);
		
		// Checkerboard
		this.context.strokeStyle = '#000000';
		
		var i, j, x, y;
		for (i=0; i<5; i++) {
			for (j=0; j<5; j++) {
				if ((i+j) % 2 === 0) {
					this.context.fillStyle = '#444444';				
				}
				else {
					this.context.fillStyle = '#BBBBBB';
				}			
			
				x = this.initialX + i*this.squareSize;
				y = this.initialY + j*this.squareSize;
				
				this.context.beginPath();
				this.context.moveTo(x, y);
				this.context.lineTo(x+this.squareSize, y);
				this.context.lineTo(x+this.squareSize, y+this.squareSize);
				this.context.lineTo(x, y+this.squareSize);
				this.context.lineTo(x, y);
				this.context.stroke();
				this.context.fill();
			}
		}
		
		// Avatars
		for (i in this.avatarList) {
			this.avatarList[i].draw(this.context);
		}
	}

};

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
 Function to initialize the GameManager
*/
function init(imageList) {
	new GameManager(imageList);
}

/**
 1st function to be called whenever the DOM is ready
*/
$(document).ready(function() {	
	var images = ['booRed.png', 'booBlue.png'];
	new ImagePreloader(images, init);
});
