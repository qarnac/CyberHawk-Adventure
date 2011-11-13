// milktruck.js
/*
Copyright 2008 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Code for Monster Milktruck demo, using Earth Plugin.
// Update by CyberTEAM 

window.truck = null;

// Pull the Milktruck model from 3D Warehouse.
//var MODEL_URL =
//  'http://sketchup.google.com/3dwarehouse/download?'
//  + 'mid=3c9a1cac8c73c61b6284d71745f1efa9&rtyp=zip&'
//  + 'fn=milktruck&ctyp=milktruck';

// refrence link to 3d hawk model 
// note! MODEL_PATH & MODEL_HAWK are declared @ js/config.js
var MODEL_URL = MODEL_PATH + MODEL_HAWK;	

var TICK_MS = 66;

var STEER_ROLL = -1.0;
var ROLL_SPRING = 0.5;
var ROLL_DAMP = -0.16;
var LAT_MAX = 33.272283;
var LAT_MIN = 33.270263;
var LON_MAX = -116.402161;
var LON_MIN = -116.404141;

function Truck() {
  var me = this;

  me.doTick = true;
  
  // We do all our motion relative to a local coordinate frame that is
  // anchored not too far from us.  In this frame, the x axis points
  // east, the y axis points north, and the z axis points straight up
  // towards the sky.
  //
  // We periodically change the anchor point of this frame and
  // recompute the local coordinates.
  me.localAnchorLla = [0, 0, 0];
  me.localAnchorCartesian = V3.latLonAltToCartesian(me.localAnchorLla);
  me.localFrame = M33.identity();

  // Position, in local cartesian coords.
  me.pos = [0, 0, 10.00];
  
  // Velocity, in local cartesian coords.
  me.vel = [0, 0, 0];

  // Orientation matrix, transforming model-relative coords into local
  // coords.
  me.modelFrame = M33.identity();

  me.roll = 0;
  me.rollSpeed = 0;
  
  me.idleTimer = 0;
  me.fastTimer = 0;
  me.popupTimer = 0;

  //ge.getOptions().setFlyToSpeed(100);  // don't filter camera motion

  window.google.earth.fetchKml(ge, MODEL_URL,
                               function(obj) { me.finishInit(obj); });
  
}


Truck.prototype.finishInit = function(kml) {
  var me = this;

  // The model zip file is actually a kmz, containing a KmlFolder with
  // a camera KmlPlacemark (we don't care) and a model KmlPlacemark
  // (our milktruck).
  me.placemark = kml.getFeatures().getChildNodes().item(1);
  me.model = me.placemark.getGeometry();
  me.orientation = me.model.getOrientation();
  me.orientation.setHeading(90);	//adjust the angle for the starting direction to be north
  me.location = me.model.getLocation();

  me.model.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  me.model.setOrientation(me.orientation);

  ge.getFeatures().appendChild(me.placemark);

  /* commented out by Ouyang because we're no longer using any balloon
  me.balloon = ge.createHtmlStringBalloon('');
  me.balloon.setFeature(me.placemark);
  me.balloon.setMaxWidth(200);
  */
	
  me.lastMillis = (new Date()).getTime();

  var href = window.location.href;
  var pagePath = href.substring(0, href.lastIndexOf('/')) + '/';

  // Ouyang: what does the following do? I don't see a shadow on earth but without this the application does not work
  /*
  me.shadow = ge.createGroundOverlay('');
  me.shadow.setVisibility(false);
  me.shadow.setIcon(ge.createIcon(''));
  me.shadow.setLatLonBox(ge.createLatLonBox(''));
  me.shadow.setAltitudeMode(ge.ALTITUDE_CLAMP_TO_GROUND);
  me.shadow.getIcon().setHref(pagePath + 'shadowrect.png');
  me.shadow.setVisibility(true);
  ge.getFeatures().appendChild(me.shadow);
	*/
  

  me.cameraCut();
  me.teleportTo(task.lat, task.lng, task.heading); //Teleport to initial position	

  //moved from finishInit
  google.earth.addEventListener(ge, "frameend", function() { me.tick(); });

}

function clamp(val, min, max) {
  if (val < min) {
    return min;
  } else if (val > max) {
    return max;
  }
  return val;
}

Truck.prototype.tick = function() {
  var me = this;

  var now = (new Date()).getTime();
  // dt is the delta-time since last tick, in seconds
  var dt = (now - me.lastMillis) / 1000.0;
  if (dt > 0.25) {
    dt = 0.25;
  }
  me.lastMillis = now;

  var c0 = 1;
  var c1 = 0;

  var gpos = V3.add(me.localAnchorCartesian,
                    M33.transform(me.localFrame, me.pos));
  var lla = V3.cartesianToLatLonAlt(gpos);

  if (V3.length([me.pos[0], me.pos[1], 0]) > 100) {
    // Re-anchor our local coordinate frame whenever we've strayed a
    // bit away from it.  This is necessary because the earth is not
    // flat!
    me.adjustAnchor();
  }

  var dir = me.modelFrame[1];
  var up = me.modelFrame[2];

  var absSpeed = V3.length(me.vel);

  var groundAlt = ge.getGlobe().getGroundAltitude(lla[0], lla[1]);
  //var airborne = (groundAlt + 10.00 < me.pos[2]);
  // fixme
  var airborne = false;
  
  var steerAngle = 0;
  
  // Steering.
  if (leftButtonDown || rightButtonDown) {
    var TURN_SPEED_MIN = 60.0;  // radians/sec
    var TURN_SPEED_MAX = 100.0;  // radians/sec
 
    var turnSpeed;

    // Degrade turning at higher speeds.
    //
    //           angular turn speed vs. vehicle speed
    //    |     -------
    //    |    /       \-------
    //    |   /                 \-------
    //    |--/                           \---------------
    //    |
    //    +-----+-------------------------+-------------- speed
    //    0    SPEED_MAX_TURN           SPEED_MIN_TURN
    var SPEED_MAX_TURN = 25.0;
    var SPEED_MIN_TURN = 120.0;
    if (absSpeed < SPEED_MAX_TURN) {
      turnSpeed = TURN_SPEED_MIN + (TURN_SPEED_MAX - TURN_SPEED_MIN)
                   * (SPEED_MAX_TURN - absSpeed) / SPEED_MAX_TURN;
      turnSpeed *= (absSpeed / SPEED_MAX_TURN);  // Less turn as truck slows
    } else if (absSpeed < SPEED_MIN_TURN) {
      turnSpeed = TURN_SPEED_MIN + (TURN_SPEED_MAX - TURN_SPEED_MIN)
                  * (SPEED_MIN_TURN - absSpeed)
                  / (SPEED_MIN_TURN - SPEED_MAX_TURN);
    } else {
      turnSpeed = TURN_SPEED_MIN;
    }
    if (leftButtonDown) {
      steerAngle = turnSpeed * dt * Math.PI / 180.0;
    }
    if (rightButtonDown) {
      steerAngle = -turnSpeed * dt * Math.PI / 180.0;
    }
  }
  // Turn.
  //var newdir = airborne ? dir : V3.rotate(dir, up, steerAngle);
  var newdir = V3.rotate(dir, up, steerAngle);
  
  me.modelFrame = M33.makeOrthonormalFrame(newdir, up);
  dir = me.modelFrame[1];
  up = me.modelFrame[2];

  var forwardSpeed = 0;
  
  if (!airborne) {
    // TODO: if we're slipping, transfer some of the slip
    // velocity into forward velocity.

    // Damp sideways slip.  Ad-hoc frictiony hack.
    //
    // I'm using a damped exponential filter here, like:
    // val = val * c0 + val_new * (1 - c0)
    //
    // For a variable time step:
    //  c0 = exp(-dt / TIME_CONSTANT)
    var right = me.modelFrame[0];
    var slip = V3.dot(me.vel, right);
    c0 = Math.exp(-dt / 0.5);
    me.vel = V3.sub(me.vel, V3.scale(right, slip * (1 - c0)));

    // Apply engine/reverse accelerations.
    var ACCEL = 50.0;  //miles per h*h
    var DECEL = 80.0;
    var MAX_REVERSE_SPEED = 40.0;
    var MAX_FORWARD_SPEED = 200.0;
    forwardSpeed = V3.dot(dir, me.vel);
    if (gasButtonDown) {
      // Accelerate forwards.
	  if (forwardSpeed < MAX_FORWARD_SPEED) {
		me.vel = V3.add(me.vel, V3.scale(dir, ACCEL * dt)); 
	  }
    } else if (reverseButtonDown) {
      if (forwardSpeed > -MAX_REVERSE_SPEED)
        me.vel = V3.add(me.vel, V3.scale(dir, -DECEL * dt));
    }
  }	//end of !airborne

  // Air drag.
  //
  // Fd = 1/2 * rho * v^2 * Cd * A.
  // rho ~= 1.2 (typical conditions), Ouyang added, for milktruck
  // Cd * A = 3 m^2 ("drag area")
  //
  //Ouyang: Fd is force of drag while Cd is coefficient of drag
  //Ouyang: rho is mass density which is mass divided by volumn
  //
  // I'm simplifying to:
  //
  // accel due to drag = 1/Mass * Fd
  // with Milktruck mass ~= 2000 kg
  // so:
  // accel = 0.6 / 2000 * 3 * v^2
  // accel = 0.0009 * v^2
  absSpeed = V3.length(me.vel);
  if (absSpeed > 0.01) {
    var veldir = V3.normalize(me.vel);
    var DRAG_FACTOR = 0.00090;
    var drag = absSpeed * absSpeed * DRAG_FACTOR;

    // Some extra constant drag (rolling resistance etc) to make sure
    // we eventually come to a stop.
    var CONSTANT_DRAG = 2.0;
    drag += CONSTANT_DRAG;

    if (drag > absSpeed) {
      drag = absSpeed;
    }

    me.vel = V3.sub(me.vel, V3.scale(veldir, drag * dt));
  }

  // Gravity
  me.vel[2] -= 9.8 * dt;

  // Move.
  var deltaPos = V3.scale(me.vel, dt);
  var newPos = V3.add(me.pos, deltaPos);

  gpos = V3.add(me.localAnchorCartesian,
                M33.transform(me.localFrame, newPos));
  lla = V3.cartesianToLatLonAlt(gpos);

  //Added by Ouyang, put the vehicle to a halt when hitting the boundary
  if (lla[0] > task.zoneMaxLAT || lla[0] < task.zoneMinLAT || lla[1] > task.zoneMaxLNG || lla[1] < task.zoneMinLNG) {
	me.vel[0] = 0;
	me.vel[1] = 0;
	gpos = V3.add(me.localAnchorCartesian, M33.transform(me.localFrame, me.pos));
	lla = V3.cartesianToLatLonAlt(gpos);
  } else {
	me.pos = newPos;
  }
  
  
  // Don't go underground.
  var defaultHeight = 40.00;
  groundAlt = ge.getGlobe().getGroundAltitude(lla[0], lla[1]);
  if (me.pos[2] < groundAlt + defaultHeight) {
    me.pos[2] = groundAlt + defaultHeight;
  } 

  var normal = estimateGroundNormal(gpos, me.localFrame);
  if ( me.pos[2] > groundAlt + 80.00 ) {
	  me.pos[2] = groundAlt + 80.00;
  }
  

  // Propagate our state into Earth.
  gpos = V3.add(me.localAnchorCartesian,
                M33.transform(me.localFrame, me.pos));
  lla = V3.cartesianToLatLonAlt(gpos);
  
  
  me.model.getLocation().setLatLngAlt(lla[0], lla[1], lla[2]);

  var newhtr = M33.localOrientationMatrixToHeadingTiltRoll(me.modelFrame);

  // control the model's rolling , e.g. move bird's wings to left or right
  // by jason
  //
  // Compute roll according to steering.
  // TODO: this would be even more cool in 3d.
  var absRoll = newhtr[2];
  me.rollSpeed += steerAngle * forwardSpeed * STEER_ROLL;
  // Spring back to center, with damping.
  me.rollSpeed += (ROLL_SPRING * -me.roll + ROLL_DAMP * me.rollSpeed);
  me.roll += me.rollSpeed * dt;
  me.roll = clamp(me.roll, -30, 30);
  absRoll += me.roll;

  me.orientation.set(newhtr[0], newhtr[1], absRoll);

  // Commented out by Ouyang because shadow is no longer used
  /*
  var latLonBox = me.shadow.getLatLonBox();
  var radius = .00005;
  latLonBox.setNorth(lla[0] - radius);
  latLonBox.setSouth(lla[0] + radius);
  latLonBox.setEast(lla[1] - radius);
  latLonBox.setWest(lla[1] + radius);
  latLonBox.setRotation(-newhtr[0]);
  */
  me.updateMainPage();
  
  me.cameraFollow(dt, gpos, me.localFrame);

  // Hack to work around focus bug
  // TODO: fix that bug and remove this hack.
  // this work around will cause another bug in firefox that no keyevent responsed by firefox
  // thus commented again
  //ge.getWindow().blur();
};

//Ouyang: this function is called at the end of the tick function.
Truck.prototype.updateMainPage = function() {
  var me = this;
  // add by jason
  // this part of codes can be called in tick()
  // update GUI
  
  // get lat/lng/alt/heading ... 
  var heading = null;
  var centLat = null;
  var centerLong = null;
  var centerAlt = null;
  //The model refers to the eagle
  if (me.model) {
  	var orientation = truck.model.getOrientation();
  	var location = truck.model.getLocation();
  	heading=orientation.getHeading();
  	centLat=location.getLatitude();
  	centerLong=location.getLongitude();
  	centerAlt=location.getAltitude();
  } else {
  	var center=ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  	heading=center.getHeading();
  	centLat=center.getLatitude();
  	centerLong=center.getLongitude();
  }

  // update sideMap
  if ( sideMap ) {
	  sideMap.refresh(centLat, centerLong, centerAlt, heading);
  }
  // update task 
  if ( task ) {
	task.refresh(centLat, centerLong);
	// update gui
	if ( task.needUpdateGUI ) {
	  updatePageBar(0);
	  updateInfoBox(0);
	}
  }
  // end here by json
}

// TODO: would be nice to have globe.getGroundNormal() in the API.
function estimateGroundNormal(pos, frame) {
  // Take four height samples around the given position, and use it to
  // estimate the ground normal at that position.
  //  (North)
  //     0
  //     *
  //  2* + *3
  //     *
  //     1
  var pos0 = V3.add(pos, frame[0]);
  var pos1 = V3.sub(pos, frame[0]);
  var pos2 = V3.add(pos, frame[1]);
  var pos3 = V3.sub(pos, frame[1]);
  var globe = ge.getGlobe();
  function getAlt(p) {
    var lla = V3.cartesianToLatLonAlt(p);
    return globe.getGroundAltitude(lla[0], lla[1]);
  }
  var dx = getAlt(pos1) - getAlt(pos0);
  var dy = getAlt(pos3) - getAlt(pos2);
  var normal = V3.normalize([dx, dy, 2]);


  return normal;
}

// Decide when to open & close popup messages.
Truck.prototype.tickPopups = function(dt) {
  var me = this;
  var speed = V3.length(me.vel);
  if (me.popupTimer > 0) {
    me.popupTimer -= dt;
    me.idleTimer = 0;
    me.fastTimer = 0;
    if (me.popupTimer <= 0) {
      me.popupTimer = 0;
      ge.setBalloon(null);
    }
  } else {
    if (speed < 20) {
      me.idleTimer += dt;
      if (me.idleTimer > 10.0) {
        me.showIdlePopup();
      }
      me.fastTimer = 0;
    } else {
      me.idleTimer = 0;
      if (speed > 80) {
        me.fastTimer += dt;
        if (me.fastTimer > 7.0) {
          me.showFastPopup();
        }
      } else {
        me.fastTimer = 0;
      }
    }
  }
};

var IDLE_MESSAGES = [
    "Let's deliver some milk!",
    "Hello?",
    "Dude, <font color=red><i>step on it!</i></font>",
    "I'm sitting here getting sour!",
    "We got customers waiting!",
    "Zzzzzzz",
    "Sometimes I wish I worked for UPS."
                     ];
Truck.prototype.showIdlePopup = function() {
  var me = this;
  me.popupTimer = 2.0;
  var rand = Math.random();
  var index = Math.floor(rand * IDLE_MESSAGES.length)
    % IDLE_MESSAGES.length;
  var message = "<center>" + IDLE_MESSAGES[index] + "</center>";
  me.balloon.setContentString(message);
  ge.setBalloon(me.balloon);
};

var FAST_MESSAGES = [
    "Whoah there, cowboy!",
    "Wheeeeeeeeee!",
    "<font size=+5 color=#8080FF>Creamy!</font>",
    "Hey, we're hauling glass bottles here!"
                     ];
Truck.prototype.showFastPopup = function() {
  var me = this;
  me.popupTimer = 2.0;
  var rand = Math.random();
  var index = Math.floor(rand * FAST_MESSAGES.length)
    % FAST_MESSAGES.length;
  var message = "<center>" + FAST_MESSAGES[index] + "</center>";
  me.balloon.setContentString(message);
  ge.setBalloon(me.balloon);
};

Truck.prototype.scheduleTick = function() {
  var me = this;
  if (me.doTick) {
    setTimeout(function() { me.tick(); }, TICK_MS);
  }
};

// Cut the camera to look at me.
Truck.prototype.cameraCut = function() {
  var me = this;
  var lo = me.model.getLocation();
  var la = ge.createLookAt('');
  la.set(lo.getLatitude(), lo.getLongitude(),
         10 /* altitude */,
         ge.ALTITUDE_RELATIVE_TO_GROUND,
         fixAngle(180 + me.model.getOrientation().getHeading() + 45),
         80, /* tilt */
         50 /* range */         
         );
  ge.getView().setAbstractView(la);
};

Truck.prototype.cameraFollow = function(dt, truckPos, localToGlobalFrame) {
  var me = this;

  var c0 = Math.exp(-dt / 0.5);
  var c1 = 1 - c0;

  var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);

  var truckHeading = me.model.getOrientation().getHeading();
  var camHeading = la.getHeading();

  var deltaHeading = fixAngle(truckHeading - camHeading);
  var heading = camHeading + c1 * deltaHeading;
  heading = fixAngle(heading);

  var TRAILING_DISTANCE = 50;
  var headingRadians = heading / 180 * Math.PI;
  
  var CAM_HEIGHT = 10;

  var headingDir = V3.rotate(localToGlobalFrame[1], localToGlobalFrame[2],
                             -headingRadians);
  var camPos = V3.add(truckPos, V3.scale(localToGlobalFrame[2], CAM_HEIGHT));
  camPos = V3.add(camPos, V3.scale(headingDir, -TRAILING_DISTANCE));
  var camLla = V3.cartesianToLatLonAlt(camPos);
  var camLat = camLla[0];
  var camLon = camLla[1];
  var camAlt = camLla[2] - ge.getGlobe().getGroundAltitude(camLat, camLon);

  la.set(camLat, camLon, camAlt, ge.ALTITUDE_RELATIVE_TO_GROUND, 
        heading, 80 /*tilt*/, 0 /*range*/);
  ge.getView().setAbstractView(la);
};

// heading is optional.
Truck.prototype.teleportTo = function(lat, lon, heading) {
  var me = this;
  me.model.getLocation().setLatitude(lat);
  me.model.getLocation().setLongitude(lon);
  me.model.getLocation().setAltitude(ge.getGlobe().getGroundAltitude(lat, lon));
  if (heading == null) {
    heading = 0;
  }
  me.model.getOrientation().setHeading(heading);
  me.vel = [0, 0, 0];

  me.localAnchorLla = [lat, lon, 0];
  me.localAnchorCartesian = V3.latLonAltToCartesian(me.localAnchorLla);
  me.localFrame = M33.makeLocalToGlobalFrame(me.localAnchorLla);
  me.modelFrame = M33.identity();
  me.modelFrame[0] = V3.rotate(me.modelFrame[0], me.modelFrame[2], -heading);
  me.modelFrame[1] = V3.rotate(me.modelFrame[1], me.modelFrame[2], -heading);
  me.pos = [0, 0, ge.getGlobe().getGroundAltitude(lat, lon)];

  me.cameraCut();
};

// Move our anchor closer to our current position.  Retain our global
// motion state (position, orientation, velocity).
Truck.prototype.adjustAnchor = function() {
  var me = this;
  var oldLocalFrame = me.localFrame;

  var globalPos = V3.add(me.localAnchorCartesian,
                         M33.transform(oldLocalFrame, me.pos));
  var newAnchorLla = V3.cartesianToLatLonAlt(globalPos);
  newAnchorLla[2] = 0;  // For convenience, anchor always has 0 altitude.

  var newAnchorCartesian = V3.latLonAltToCartesian(newAnchorLla);
  var newLocalFrame = M33.makeLocalToGlobalFrame(newAnchorLla);

  var oldFrameToNewFrame = M33.transpose(newLocalFrame);
  oldFrameToNewFrame = M33.multiply(oldFrameToNewFrame, oldLocalFrame);

  var newVelocity = M33.transform(oldFrameToNewFrame, me.vel);
  var newModelFrame = M33.multiply(oldFrameToNewFrame, me.modelFrame);
  var newPosition = M33.transformByTranspose(
      newLocalFrame,
      V3.sub(globalPos, newAnchorCartesian));

  me.localAnchorLla = newAnchorLla;
  me.localAnchorCartesian = newAnchorCartesian;
  me.localFrame = newLocalFrame;
  me.modelFrame = newModelFrame;
  me.pos = newPosition;
  me.vel = newVelocity;
}

// Keep an angle in [-180,180]
function fixAngle(a) {
  while (a < -180) {
    a += 360;
  }
  while (a > 180) {
    a -= 360;
  }
  return a;
}
