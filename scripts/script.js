var map;
var bearings = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];    // cardinal directions yo

var masterWaypoints = [];


function initMap() {
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 6,
		center: {lat: 41.85, lng: -87.65}
	});
	directionsDisplay.setMap(map);

	document.getElementById('submit').addEventListener('click', function() {
		rightRoute(directionsService, directionsDisplay);
	});
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	var waypts = [];
	var checkboxArray = document.getElementById('waypoints');
	for (var i = 0; i < checkboxArray.length; i++) {
		if (checkboxArray.options[i].selected) {
			waypts.push({
				location: checkboxArray[i].value,
				stopover: true
			});
		}
	}

	directionsService.route({
		origin: document.getElementById('start').value,
		destination: document.getElementById('end').value,
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: 'DRIVING'
	}, function(response, status) {
		if (status === 'OK') {
			directionsDisplay.setDirections(response);
			var route = response.routes[0];
			var summaryPanel = document.getElementById('directions-panel');
			summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
            	var routeSegment = i + 1;
            	summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
            	'</b><br>';
            	summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
            	summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
            	summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
        } else {
        	window.alert('Directions request failed due to ' + status);
        }
    });
}

function rightRoute(directionsService, directionsDisplay) {
	// console.log("motherfucker")
	var waypts = [];
	directionsService.route({
		origin: document.getElementById('start').value,
		destination: document.getElementById('end').value,
		waypoints: waypts,
		optimizeWaypoints: true,
		travelMode: 'DRIVING'
	}, function(response, status) {
		// var takenRoute = [];
		if(status === "OK") {
			// console.log(1 + "response")
			var routes = response['routes'];
			// console.log(routes);
			for(var i = 0 ; i < routes.length; i++) {
				var route = routes[i];
				var legs = route['legs'];
				for(var j = 0; j < legs.length; j++) {
					var leg = legs[j];
					// console.log(leg)
					var steps = leg["steps"];
					// console.log(steps);
					var prevLat, prevLng;
					var prevDirection;
					var lat, lon;
					var skip = false;

					for(var y = 0; y < steps.length; y++){
						// console.log("AGGGGGGGGG")
						// console.log(steps[y])

						lat = steps[y]['start_point'].lat()
						lon = steps[y]['start_point'].lng()

						// console.log(lat + ", " + lon)


						if(steps[y]['maneuver'] === "turn-left") {

							// console.log("OH SHIT ITS A LEFT YO")
							// console.log(steps[y])
							// console.log("LAT : " + lat)
							// console.log("LONG : " + lon)
							// the below coordinates correspond to the intersection you are taking the left on
							// console.log(lat + ", " + lon)
							
							

							var pos = new google.maps.LatLng(lat, lon);


							var request = {
								location: pos,
								radius: 100
							};

							getNearBy(request, lat, lon, prevDirection);



						} else {
							masterWaypoints.push(new google.maps.LatLng(lat, lon));
						}

						prevDirection = getCardinalDirection(prevLat, prevLng, lat, lon);

						prevLat = lat;
						prevLng = lon;


						if(y === 0) {
							var startLat = steps[y]['start_point'].lat();
							var startLng = steps[y]['start_point'].lng();
							prevLat = steps[y]['end_point'].lat();
							prevLng = steps[y]['end_point'].lng();
							prevDirection = getCardinalDirection(startLat, startLng, prevLat, prevLng);
						}




					}
				}
			}
		}

	});
}

function getCardinalDirection(lat1, lng1, lat2, lng2) {

	var lon_distance = (lng2-lng1);

						// console.log("lat1 : " + lat1 + "\nlng1 : " + lng1 + "\nlat2 : " + lat2 + "\nlng2 : " + lng2)

						var y = Math.sin(lon_distance) * Math.cos(lat2);
						var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon_distance);
	var bearng_calc = Math.atan2(y, x) * (180/Math.PI);  // bearing

	// console.log("BEARING CALCULATION : " + bearng_calc)

	var index = bearng_calc - 22.5;


	if (index < 0)
		index += 360;
	index = parseInt(index / 45);

	return(bearings[index]);
} 


function getNearBy(request, latitude, longitude, prevDirect) {
	// console.log("MADE IT HERE YO")
	var service = new google.maps.places.PlacesService(map);
	// console.log(1)
	// console.log("lat1 : " + latitude + "\nlng1 : " + longitude + "\nlat2 : " + prevLatt + "\nlng2 : " + prevLong)
	service.nearbySearch(request, function(results, status){

		var templat = latitude;
		var templon = longitude;
		var tempPrevDirection = prevDirect;
		callback(results, status, templat, templon, tempPrevDirection);
	}); 



	function callback(results, status, latt, lng, tempPrevDirection) {
								// console.log(3)
								// console.log("kklat1 : " + latitude + "\nlng1 : " + longitude + "\nlat2 : " + prevLatt + "\nlng2 : " + prevLong)
								var keep = [];
								if (status == google.maps.places.PlacesServiceStatus.OK) {
									for (var l = 0; l < results.length; l++) {

										// console.log(results[l])
										console.log("... Calculating the direction to location ...")
										var tempLat = results[l]['geometry']['location'].lat();
										var tempLng = results[l]['geometry']['location'].lng();

										var tempDirection = getCardinalDirection(tempLat, tempLng, latt, lng);

										

										var indexOfPrevDirect = bearings.indexOf(tempPrevDirection);
										var indexOfTempDirect;
										if(indexOfPrevDirect > 4) {
											var temp = 4;
											for(var q = 0; q < bearings.length; q++) {
												if(bearings[q] === tempPrevDirection) {
													break;
												}
												temp++;
											}
											indexOfTempDirect = temp;
										} else {
											indexOfTempDirect = bearings.indexOf(tempDirection);
										}

										console.log(indexOfPrevDirect + " ::: " + indexOfTempDirect)

										if(indexOfTempDirect - indexOfPrevDirect <= 3 && indexOfTempDirect - indexOfPrevDirect >= 0) {
											// console.log("should be a right turn");
											// console.log("DIRECTION for left turn\nPrevDirection --> directionOfHotspot")
											// console.log(tempPrevDirection + " --> " + tempDirection)
											keep.push(results[l]);

										}

									// // createMarker(results[i]);
								}
							}
							var pos = new google.maps.LatLng(latt, lng);
							var bestWaypoint = null;
							var service = new google.maps.DistanceMatrixService();

							for(var i =0; i < keep.length; i++) {
								var tempdest = new google.maps.LatLng(keep[i]['geometry']['location'].lat(), keep[i]['geometry']['location'].lng());

								service.getDistanceMatrix(
								{
									origins: [pos],
									destinations: [tempdest],
									travelMode: 'DRIVING',
								}, function(response, status){
									var tempDestination = tempdest;
									callback(response, status, tempDestination);
								});

								function callback(response, status, destination) {
									console.log(response['rows'][0]['elements'][0]['distance']);
									if( response['rows'][0]['elements'][0]['distance']['value'] < bestWaypoint || bestWaypoint === null) {
										bestWaypoint = response['rows'][0]['elements'][0]['distance']['value'];
										// console.log(destination);
										masterWaypoints.push(destination);
										// console.log("^^^^^");
									}

								}


}

}
}