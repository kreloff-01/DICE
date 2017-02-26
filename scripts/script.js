var map;
var route_status;
var start;
var end;

function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {
            lat: 41.85,
            lng: -87.65
        }
    });
    directionsDisplay.setMap(map);

    document.getElementById('submit').addEventListener('click', function() {
        
        if (route_status !== null) {
            if (route_status === '1') {
                rightRoute(directionsService, directionsDisplay);
            } else if (route_status === '2') {
                // potholes
            } else if (route_status === '3') {
                // elevation
            }
        } else {alert('Please Select a Route Mod');}

        calculateAndDisplayRoute(directionsService, directionsDisplay);
        // call this in above mod functions?
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    //var waypts = [];
    //var checkboxArray = document.getElementById('waypoints');
    var travelMode = document.getElementById('mode').value;
    // for (var i = 0; i < checkboxArray.length; i++) {
    //     if (checkboxArray.options[i].selected) {
    //         waypts.push({
    //             location: checkboxArray[i].value,
    //             stopover: true
    //         });
    //     }
    // }

    directionsService.route({
        origin: start,
        destination: end,
        provideRouteAlternatives: true,
        //waypoints: waypts,
        //optimizeWaypoints: true,
        travelMode: google.maps.TravelMode[travelMode]
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            console.log(response);
            calculateBestPath(response);
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
    var waypts = [];
    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        provideRouteAlternatives: true,
        //waypoints: waypts,
        //optimizeWaypoints: true,
        travelMode: 'DRIVING'
    }, function(response, status) {
        if (status === "OK") {
            var routes = response['routes'];
            //console.log(routes);
            for (var i = 0; i < routes.length; i++) {
                var route = routes[i];
                var legs = route['legs'];
                for (var j = 0; j < legs.length; j++) {
                    var leg = legs[j];
                    //console.log(leg)
                    var steps = leg["steps"];
                    var prevLat, prevLng;
                    var prevDirection;
                    var lat, lon;
                    var skip = false;

                    for (var y = 0; y < steps.length; y++) {


                        lat = steps[y]['start_point'].lat()
                        lon = steps[y]['start_point'].lng()

                        //console.log(lat +", " + lon)

                        if (steps[y]['maneuver'] === "turn-left") {

							// console.log("OH SHIT ITS A LEFT YO")
							// console.log(steps[y])
							// console.log("LAT : " + lat)
							// console.log("LONG : " + lon)
							// the below coordinates correspond to the intersection you are taking the left on
							// console.log(lat + ", " + lon)
                            
							var pos = new google.maps.LatLng(lat, lon);
                            var pos = new google.maps.LatLng(lat, lon);


                            var request = {
                                location: pos,
                                radius: 100
                            };




                        }

                        prevDirection = getCardinalDirection(prevLat, prevLng, lat, lon);

                        //console.log("DIRECTION")
                        //console.log(prevDirection)

                        prevLat = lat;
                        prevLng = lon;


                        if (y === 0) {
                            var startLat = steps[y]['start_point'].lat();
                            var startLng = steps[y]['start_point'].lng();
                            prevLat = steps[y]['end_point'].lat();
                            prevLng = steps[y]['end_point'].lng();
                            prevDirection = getCardinalDirection(startLat, startLng, prevLat, prevLng);
                        }


                        // prevLat = steps[y]['start_point'].lat();
                        // prevLng = steps[y]['start_point'].lng();

                        // grabbing the steps one by one 
                        // they can be differentiated by their maneuver
                        // console.log(steps[y]["maneuver"]);
                        // console.log(steps[y]);




                    }
                }
            }
        }

        // console.log(response);
        // if (status === 'OK') {
        //  directionsDisplay.setDirections(response);
        //  var route = response.routes[0];
        //  var summaryPanel = document.getElementById('directions-panel');
        //  summaryPanel.innerHTML = '';
        //           // For each route, display summary information.
        //           for (var i = 0; i < route.legs.length; i++) {
        //            var routeSegment = i + 1;
        //            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
        //            '</b><br>';
        //            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        //            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        //            summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        //           }
        //       } else {
        //        window.alert('Directions request failed due to ' + status);
        //       }
    });
}


function getNearBy(request, latitude, longitude, prevLatt, prevLong) {
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        var templat = latitude;
        var templon = longitude;
        var prevLatTemp = prevLatt;
        var prevLngTemp = prevLong;
        callback(results, status, templat, templon, prevLatTemp, prevLngTemp)
    });

    // function calcWaypoint(param1, param2, param3, param4) {
    //  var templon = param2;
    //  var templat = param1;
    //  var tempPrevLon = param4;
    //  var tempPrevLat = param3;
    // }


    function callback(results, status, latt, lng, prevLatt, prevLong) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var l = 0; l < results.length; l++) {

                // console.log(results[i])
                console.log("... Calculating the direction to location ...")
                prevDirection = getCardinalDirection(latt, lng, prevLatt, prevLong);

                console.log("DIRECTION for left turn")
                console.log(prevDirection)
                // // createMarker(results[i]);
            }
        }
    }
}



function getCardinalDirection(lat1, lng1, lat2, lng2) {

    var lon_distance = (lng2 - lng1);

    //console.log("lat1 : " + lat1 + "\nlng1 : " + lng1 + "\nlat2 : " + lat2 + "\nlng2 : " + lng2)

    var y = Math.sin(lon_distance) * Math.cos(lat2);
    var x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon_distance);
    var bearng_calc = Math.atan2(y, x) * (180 / Math.PI); // bearing

    // console.log("BEARING CALCULATION : " + bearng_calc)

    var bearings = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"]; // cardinal directions yo

    var index = bearng_calc - 22.5;


    if (index < 0)
        index += 360;
    index = parseInt(index / 45);

	return(bearings[index]);
}