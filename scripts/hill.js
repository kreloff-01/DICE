function chooseHill(directionsService, directionsDisplay) {
    var waypts = [];
    var checkboxArray = document.getElementById('waypoints');
    var travelMode = document.getElementById('mode').value;
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
        travelMode: google.maps.TravelMode[travelMode]
        alternatives : true;
        pr
    }, function(response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);