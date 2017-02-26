var max_index = 0;
var max_sum = 0;


function chooseHill(directionsService, directionsDisplay) {

    var elevation_route_arr = [];

    var elevatror = new google.maps.ElevationService;
    console.log("in the highs");
    // var waypts = [];
    // var checkboxArray = document.getElementById('waypoints');
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
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        //  waypoints: waypts,
        provideRouteAlternatives: true,
        // optimizeWaypoints: true,
        travelMode: google.maps.TravelMode[travelMode]
        //alternatives : true;
        //pr
    }, function(response, status) {
        g_response = response;
        //var points = new Array();
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var routes = response.routes;
            groute= routes;
            var points = new Array();
            points.length = routes.length;
            //points[0] = new Array();
            //points[0][0] = new Array();
            //console.log(routes.length);
            for(var l=0; l<routes.length;l++) {
                //console.log('$$$$$$$$$$$$$$$');
                points[l] = new Array();
                points[l].length = routes[l].legs.length;
                for (var i = 0; i < routes[l].legs.length; i++) {
                    //console.log(routes[l].legs[i].start_address);
                    //console.log(routes[l].legs[i].end_address);
                    //console.log(routes.legs[i]);
                    points[l][i] = new Array();
                    points[l][i].length = routes[l].legs[i].steps.length;
                    //console.log('*******');
                    for(var j =0 ; j<routes[l].legs[i].steps.length; j++) {
                        //console.log('ok' + routes[l].legs[i].steps.length);
                        var elem = routes[l].legs[i].steps[j].start_location.toString().split(',');
                        var elem2 = routes[l].legs[i].steps[j].end_location.toString().split(',');
                        //console.log(elem);
                        var lat = elem[0].replace('(', '');
                        //console.log(lat);
                        var lng = elem[1].replace(')','');
                        //console.log(lng);
                        points[l][i][j] = new Object();
                        points[l][i][j].lat = parseFloat(lat);
                        points[l][i][j].lng = parseFloat(lng);
                        //(Obj(lat,lng));
                        //console.log(points[j]);
                        //console.log('%%%%%%%%');
                        //for(b in points){
                        //   console.log(points[b]);
                        //}
                        // elevatror.getElevationAlongPath({
                        //   'path' : points,
                        // 'samples' : 256
                        //}, handleElevations);
                    }

                    //console.log('&&&&&&&&&&');
                    //for(var j in routes[i].legs){
                    //for(var k in routes[i].legs[j].steps) {
                    //var step = routes[i].legs[j].steps[k];
                    //var path = Maps.decodePolyline(step.polyline.points);
                    //for(var l in path){
                    //  console.log(path[l]);
                    // }
                    //}
                    //console.log(routes[i].legs[j])
                    //}
                }
            }
            var results = [];
            results.length = response.routes.length;
            //console.log(response.routes.length);
            var samples = 0;
            for(i in points){
                var called = [];
                //console.log(points.length);
                for(k in points[i]){
                    //console.log(points[i].length);
                    for(var l =0; l<points[i][k].length;l++){
                        //console.log(points[i][k].length);
                        called.push(points[i][k][l]);
                        samples += 1;
                    }
                    //console.log(samples);

                }
                //console.log('$$$$$$$');
                elevatror.getElevationAlongPath({
                    'path' : called,
                    'samples' : samples
                }, function(elevatons, status) {
                    if(status !== 'OK') {
                        console.log('no call back');
                        //retrun;
                    }
                    // For every route
                    results[i] = handleElevations(elevatons, i);
                });
            }
            console.log('After ElevationService');
            for (var t=0; t<results.length; t++) {
                console.log(results[t]);
            }
        }
    });

    return max_index;
}

function handleElevations(elevatons, i) {

    var sum = 0;
    for(var u=0; u<elevatons.length-1; u++){
        if(parseFloat(elevatons[u].elevation) < parseFloat(elevatons[u+1].elevation)) {
            sum += parseFloat(elevatons[u+1].elevation)-parseFloat(elevatons[u].elevation);
        }
    }
    if (sum > max_sum) {
        max_index = i;
        max_sum = sum;
    }
    injectMeDoctor(sum);
    return sum;
}

function injectMeDoctor(sum){
    var summaryPanel = document.getElementById('directions-panel');
    summaryPanel.innerHTML = '';
    summaryPanel.innerHTML += 'Total elevation gain: ' + sum +
        'ft</b><br>';
}