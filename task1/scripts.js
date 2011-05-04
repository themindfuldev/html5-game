/*
* This function will handle the pressed key
* @param event The caught event
*/
function keyPressed(event)
{
	var code, arrow;
	if (!event) var event = window.event;
	if (event.keyCode) code = event.keyCode;
	else if (event.which) code = event.which;
	
	switch (code)
	{
		case 37: arrow = 'left'; break;
		case 38: arrow = 'up'; break;
		case 39: arrow = 'right'; break;
		case 40: arrow = 'down'; break;
	}
	
	if (arrow !== undefined)
	{
		document.body.innerHTML += 'You pressed the ' + arrow + ' arrow.<br>';	
	}
}