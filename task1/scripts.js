var avatar = new Object();
var destination = new Object();

$(document).ready(function() {	
	// Variables initialization
	avatar.element = $('#avatar');
	avatar.top = parseInt(avatar.element.css('top'));
	avatar.left = parseInt(avatar.element.css('left'));
	avatar.height = parseInt(avatar.element.css('height'));
	avatar.width = parseInt(avatar.element.css('width'));
	avatar.halfHeight = avatar.height/2;
	avatar.halfWidth = avatar.width/2;	

	destination.x = avatar.halfWidth;
	destination.y = avatar.halfHeight;

	// Starting the avatar movement
	startAvatar();

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
	
	if  (eventX < avatar.left || eventX > avatar.left+avatar.width || eventY < avatar.top || eventY > avatar.top+avatar.height) {
		destination.x = eventX;
		destination.y = eventY;
	}
	
}

/**
 Starts the avatar movement
*/
function startAvatar() {
	var currentX = avatar.halfWidth;
	var currentY = avatar.halfHeight;

	var timeoutId = window.setInterval(function() {
		if (Math.abs(currentX-destination.x) > 1 || Math.abs(currentY-destination.y) > 1) {
			// Image swap
			if (currentX < destination.x) {
				avatar.element.css('background-image', "url('booRight.jpg')");
			}
			else if (currentX > destination.x) {
				avatar.element.css('background-image', "url('booLeft.jpg')");
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
			avatar.element.css('left', currentX-avatar.halfWidth);
			avatar.element.css('top', currentY-avatar.halfHeight);
		}
	}, 10);
}