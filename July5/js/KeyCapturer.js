var keypressFundionsDisabled = false;
var leftButtonDown = false;
var rightButtonDown = false;
var gasButtonDown = false;
var reverseButtonDown = false;


function DisableControlKeys()
{
	keypressFundionsDisabled = true;
}

function EnableControlKeys()
{
    keypressFundionsDisabled = false;
}

function keyDown(event) {
	var currKey;
	if (window.event) { //IE
		currKey = window.event.keyCode;
	} else if (event.which) { // Netscape/Firefox/Opera
		currKey = event.which;
	}

  if (keypressFundionsDisabled) {
	  return true;
  }

  if (currKey == 37) {  // Left.
    leftButtonDown = true;
  } else if (currKey == 39) {  // Right.
    rightButtonDown = true;
  } else if (currKey == 38) {  // Up.
    gasButtonDown = true;
  } else if (currKey == 40) {  // Down.
    reverseButtonDown = true;
  } else if (currKey == 32) {	//spacebar for pausing
	truck.vel[0] = 0;
	truck.vel[1] = 0;
  } else {
	return true;
  }
  return false;
}

function keyUp(event) {
	var currKey;
	if (window.event) { //IE
		currKey = window.event.keyCode;
	} else if (event.which) { // Netscape/Firefox/Opera
		currKey = event.which;
	}
  if (keypressFundionsDisabled)
	  return true;
	
  if (currKey == 37) {  // Left.
    leftButtonDown = false;
  } else if (currKey == 39) {  // Right.
    rightButtonDown = false;
  } else if (currKey == 38) {  // Up.
    gasButtonDown = false;
  } else if (currKey == 40) {  // Down.
    reverseButtonDown = false;
  } else {
	return true;
  }
  return false;
  
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;
