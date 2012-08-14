<!--

Copyright 2009
Department of Computer Science & Information Systems (CSIS)
California State University San Marcos (CSUSM)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This project was created by these people from the CSIS Department of CSUSM:
Jiexin Li
Paul Mendoza
Youwen Ouyang

It is part of the CyberTEAM project that was funded by the National Science Foundation.
More information about CyberTEAM can be found at http://www.csusm.edu/cyberteam/

-->
<html>
	<head>
		<title>Anza Borrego Earth</title>
		<!-- link rel=stylesheet href="style/main.css" type="text/css" /-->
		<style type="text/css">@import "style/main.css";</style>
		<!--Google Earth API-->
		
		<script type="text/javascript" src="http://www.google.com/jsapi"></script>
		
		<!--Google Map API
		<script src="http://maps.google.com/maps?file=api&v=2&key=AIzaSyDSwGeMX946SO8b3_sZqqAbCzM5eloG-os"></script>
		-->
		<script type="text/javascript" src="js/config.js"></script>
		<script type="text/javascript" src="js/index.js"></script>

		<!-- fix diffrences in xml readng between IE and Firefox-->
		<script type="text/javascript" src="js/Xml.js"></script>

		<!-- Ouyang: the math3d.js file contains vector and matrix math to support functions in the milktruck.js file -->
		<script type="text/javascript" src="js/math3d.js"></script>
		<script type="text/javascript" src="js/KeyCapturer.js"></script>
		<!-- Ouyang: the milktruck.js file contains functions that support the flight of the eagle/hawk -->
		<script type="text/javascript" src="js/milktruck.js"></script>

		<script type="text/javascript" src="js/SideMap.js"></script>
		<script type="text/javascript" src="js/AnzaMarker.js"></script>
		<script type="text/javascript" src="js/Task.js"></script>
		
		
		<script type="text/javascript">
			var id=<? echo $_REQUEST['q'];?>;

			google.load("earth", "1");
			google.load("maps", "2.99");
	
			
			var ge = null;
			var gm = null;

			var truck = null;
			var task = null;
			var sideMap = null;
			function tele()
			{
				if(id=="10")
				{
					document.getElementById("quickstop").innerHTML="<option value='0' selected>Visitor Center</option><option value='1'>Mountain Range</option><option value='2'>North Fk Palm Canyon</option><option value='3'>Collins Valley</option><option value='4'>Sheep Canyon</option><option value='5'>Bailey's Cabin</option><option value='6'>Maidenhair Falls</option><option value='7'>Hidden Spring</option>";
				}
				else if(id=="20")
				{
								document.getElementById("quickstop").innerHTML="<option value='0' selected>Raibow wash</option><option value='1'>Seventeen Palms</option><option value='2'>Vista del malpais</option><option value='3'>The Slot</option><option value='4'>Ant Hill</option><option value='5'>Clark Dry Lake</option><option value='6'>Rattlesnake Spring</option><option value='7'>Villager Peak</option><option value='8'>Calcite mine</option><option value='9'>OWSVRA</option>";
								}
				else if(id=="30")
				{
								document.getElementById("quickstop").innerHTML="<option value='0' selected>Elephant Knees</option><option value='1'>Anticle / landslide</option><option value='2'>Diablo Dropoff</option><option value='3'>Wind caves</option><option value='4'>Lycium wash</option><option value='5'>US Gypsum Mine</option><option value='6'>Lake Cahuilla shoreline</option><option value='7'>Carrizo Stage Station</option><option value='8'>Strontium/Celestite Mine</option>";
					}
				else if(id=="40")
				{
								document.getElementById("quickstop").innerHTML="<option value='0' selected>Red Hill</option><option value='1'>Agua Caliente</option><option value='2'>Bow Willow</option><option value='3'>Egg Mountain</option><option value='4'>Mud Caves</option><option value='5'>Mtn Palm/Mary's Grove</option><option value='6'>Stromatolites</option><option value='7'>G0at Canyon Trestle</option><option value='8'>Dolomite Mine</option>";
					}
						
			
			}

			function init() {
				if (GBrowserIsCompatible()) {
					gm = new GMap2(document.getElementById("map_canvas"));
					sideMap = new SideMap(gm);
				}
				
				
				document.getElementById("tele").focus();
				tele();
								google.earth.createInstance("map3d", initCallback, failureCallback);
				
			}

			function initCallback(object) {
				ge = object;
				ge.getWindow().setVisibility(true);
				ge.getLayerRoot().enableLayerById(ge.LAYER_BUILDINGS, true);
				//added by Ouyang per Curtis' suggestion
				ge.getOptions().setMouseNavigationEnabled(false);
				ge.getOptions().setFlyToSpeed(100);
			
				task = new Task('php/generate.php?q='+id);
				task.parse();  

				task.addMarkersTo(ge, gm);
				task.start();	
				
				
				truck = new Truck();
				
				EnableControlKeys();
		
			
				//task = new Task('task/quadrant1.xml');
			
				
				//Ouyang: The quandrant1.xml file contains the initial position of the eagle via the first lat/long tag pair.				
			}

			function failureCallback(object) {
			}

			// events on the page  
			function teleportTo(id) {
				var lat = task.markers[id].lat;
				var lng = task.markers[id].lng;
				var geDiv = document.getElementById("map3d_container");
				var pcDiv = document.getElementById("page_container");
				geDiv.style.width = "100%";
				geDiv.style.height = "400px";
				pcDiv.style.display = "none";
				EnableControlKeys();
				truck.teleportTo(lat, lng, 50); //Teleport to initial position		
			}

			//Ouyang: I think this function is for testing purpose.
			function tellCoordinate() {
				var location = truck.model.getLocation();
				var centLat=location.getLatitude();
				var centerLong=location.getLongitude();
				var centerAlt=location.getAltitude();
				alert("lat: " + centLat + "\nlng: " + centerLong + "\nalt: " +
						centerAlt);
			}

			// set zoom level 
			function SetZoom(object, lv) {
				lv = parseInt(lv);
				if ( sideMap && lv >= 0 && lv <= 17) {
					sideMap.setZoomLevel(lv);
				}
				object.blur();
			}

</script>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body onload='init(),this.focus();' onUnload="GUnload();">

<table class="main" align="center">
	<!-- the first row is the header -->
	<tr>
		<td width="9" style="border-bottom: 2px solid #96C2F1"/>
		<td height="100" colspan="4" style="border-bottom: 2px solid #96C2F1">
			<h5 align="center">CyberHawk Adventure</h5>
			<div class="description">
				This adventure provides a close-up exploration of the geological features, habitats and resources located in the Anza Borrego Desert State Park. 
				Use the arrow keys to fly the hawk forward, backward, left, and right. Use the SPACE bar to pause the hawk when you see additional tabs show up 
				next to the "Earth"tab. Click on the additional tabs to view photos, directions, clues and/or questions. 
				Points are earned during the tour that may be printed as evidence of your visit. Have fun on your tour!
		</td>
	</tr>
	<!-- a narrow row is added to allow gaps between the first and the second rows -->
	<tr height="5">
		<td colspan="5"/>
	</tr>
	
	<!-- the second row has two columns -->
	<tr>
		<!-- a narrow column is added to allow gaps between the border and the first column -->
		<td width="1%" />
		<!-- The first column contains three sections -->
		<td width="34%">
			<!-- The first component is the small map -->
			<div id="map_canvas" ></div>
			<form>
				<input name="ZoomLevel" type="radio" checked="true" onClick="SetZoom(this, 13)">Zoom In&nbsp;
				<input name="ZoomLevel" type="radio" onClick="SetZoom(this, 11)">Zoom Out
			</form>
			<!-- The second component is the palyer information -->
			<br />
			<table width="100%" caption="top">
				<caption>Player Status</caption>
				<tr>
					<th width="50%" align="right" font-size="10">Total Score:</th>
					<td width="50%" align="left"><span id="playerscore">0</span> out of 700</td>
				</tr>
				<tr>
					<th align="right">Time Used:</th>
					<td align="left"><span id="playertime">0:00:00</span></td>
				</tr>
				<tr height="5">
					<td colspan="2" />
				</tr>
			</table>
		
			<!-- The third section contains credits and logos -->
			<p>
				This project was developed through a partnership between <a href="http://www.csusm.edu/">CSUSM</a> 
				and California State Parks' <a href="http://ports.parks.ca.gov/">PORTS</a> program as part of the <a href="http://www.csusm.edu/cyberteam">CyberTEAM</a>
				project sponsored by NSF.
			</p>
			<br/>
			<p>
				Credit...
			</p>
			<br/>
			<div class="logo">
				<br/>
				<img src="images/csusm_blue_small.gif" height="70" width="120" />
				<img src="images/csp_tiny.jpg" height="70" width="70"/>
				<img src="images/nsflogo_small.jpg" height="70" width="70"/>
			</div>
			<br/><br/><br/>
		</td>
		
		<!-- a narrow column is added to allow gaps between the first and second column -->
		<td width="1%" />
			
		<!-- The second column is a table of two rows. -->
		<td width="63%" valign="top" cellpadding="0">
			<table cellpadding="0" width="100%">
				<!-- The first row is the google earth -->
				<tr>
					<td>
						<div id="pagebar">
							<span class="page_now">Earth</span>
						</div>
						<div id='map3d_container' >
							<div id='map3d' style='height: 100%;'></div>
						</div>
						<div id="page_container" style="display:none">
						</div>
					</td>
				</tr>
				
				<!-- The second row is the information section. -->
				<tr>
					<td>
						<div id="info_box">
							<div id="info_content">
							</div>
							<br/>
							<!-- uncommented on June 6 -->
							<h5>For quick stops during demo, use the following drop-down list.</h5>
							<div id="quadrant"><center>
												<button type="button" id="tele" onClick="teleportTo(document.getElementById('quickstop').value);this.blur();">Teleport to</Button>
</Button>  
									<select name="quickstop" id="quickstop">
                                  
									</select>
								</center>
							</div>
							<!-- uncommented on June 6 -->
						</div>
					</td>
				</tr>
			</table>
			<!-- End of the table in the second column of the second row. -->
		</td>
		<!-- a narrow column is added to allow gaps between the border and the second column -->
		<td width="1%" />
	</tr>
</table>

</body>
</html>
