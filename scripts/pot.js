//var index = require('../data/street_ph.json')
var json = (function () {
	var json = null;
	$.ajax({
		'async': false,
		'global': false,
		'url': "/data/street_ph.json",
		'dataType': "json",
		'success': function (data) {
			json = data;
		}
	});
	return json;
})();

function calculateBestPath(responses){
	var numRoutes = responses.routes.length;
	console.log(numRoutes + " num routes");
	// contains the total street weights
	var routeWeights = [numRoutes];
	// for each route, send all of the streets in route i through the weight algorithm
	// the final sum total of streets weights are put into the array
	for(var i = 0; i < numRoutes; i++){
		var weight = 0;
		for(var j = 0; j < responses.routes[i].legs.length; j++) {
			var streets = [responses.routes[i].legs[j].steps.length];
			for (var k = 0; k < responses.routes[i].legs[j].steps.length; k++) {
				var name = parseStreetName(responses.routes[i].legs[j].steps[k].instructions);
				streets[k] = new pathObj(name, responses.routes[i].legs[j].steps[k].start_location.toString(),
					responses.routes[i].legs[j].steps[k].end_location.toString());
				console.log(calculatePotHoleWeight(streets[k]) + " weight");
				routeWeights[i] += calculatePotHoleWeight(streets[k]);
				console.log(routeWeights[i] + " curr route weight");
			}
		}
		console.log(routeWeights[i] + " route weight");
	}

}

// obj contains the streetname, start poing & end point for use in getting weight of pothoels
function pathObj(streetname, start_point, end_point){
	this.name = streetname;
	this.startLatLong = start_point;
	this.endLatLong = end_point;
}

function parseStreetName(instructions){
	var str = instructions;

	var result = str.match(/<b>(.*?)<\/b>/g).map(function(val){
		return val.replace(/<\/?b>/g,'');
	});
	return result[result.length-1];
}

/*// to load JSON pothole & street data
function loadJSON(callback) {

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'data/street_ph.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	}
	xobj.send(null);
} */

//possible optimization here
function calculatePotHoleWeight(street) {
	var weight = 0;
	//loadJSON(function(response) {
		// Parse JSON string into object
		var actual_JSON = json;
		//for each street name
		var closest;
		var max = 0;
		//console.log(street.name.toUpperCase() + " <- street");
		for(var key in actual_JSON){
			// console.log(key + " <- key");
			if(max < simscore(key.toString(), street.name.toUpperCase())){
				// console.log(key + " new closest key");
				max = simscore(key.toString(), street.name.toUpperCase());
				closest = key;
			}
		}

		// calculate radius / distance formula

		var startPts = street.startLatLong.toString().split(",");
		var endPts = street.endLatLong.toString().split(",");

		var startLatitude = parseFloat(startPts[0].substr(1));
		var startLongitude = parseFloat(startPts[1]);

		var endLatitude = parseFloat(endPts[0].substr(1));
		var endLongitude = parseFloat(endPts[1]);

		x = endLatitude - startLatitude;
		y = endLongitude - startLongitude;

		var distance = Math.sqrt(x*x + y*y);

		var centerLatitude = (startLatitude + endLatitude)/2;
		var centerLongitude = (startLongitude + endLongitude)/2;

		var radius = distance/2;

		//console.log("start unit circle");
		var cardinalNLongitude = (centerLongitude + radius);
		//console.log(centerLatitude + "," +cardinalNLongitude);
		var cardinalELatitude = (centerLatitude + radius);
		//console.log(cardinalELatitude + "," + centerLongitude);
		var cardinalSLongitude = (centerLongitude - radius);
		//console.log(centerLatitude + "," +cardinalSLongitude);
		var cardinalWLatitude = (centerLatitude - radius);
		//console.log(cardinalWLatitude + "," + centerLongitude);
		// console.log("end unit circle");


		for(coordinate in actual_JSON[closest].locations){
			// console.log(actual_JSON[closest].locations[coordinate] + " coord");
			var splitCoords = actual_JSON[closest].locations[coordinate].split(",");
			var coordLatitude = parseFloat(splitCoords[0].substr(1));
			var coordLongitude = parseFloat(splitCoords[1]);
			//console.log(coordLatitude + "," + coordLongitude);
			if((coordLatitude < cardinalELatitude && coordLatitude > cardinalWLatitude) &&
			coordLongitude < cardinalNLongitude && coordLongitude > cardinalSLongitude){
				weight += 1;
			}
		}
		return weight;
	//}, calculateBestPath);
}


// to load JSON pothole & street data

function count(obj) {
	var count=0;
	for(var prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			++count;
		}
	}
	return count;
}


// get the number of potholes from the JSON
function getNumPotholes() {
	//loadJSON(function(response) {
		// Parse JSON string into object
		var actual_JSON = json;
		var num = count(actual_JSON);
		
		console.log(num);
	//});
}

// calculatePotHoles("E 102ND ST");

//calculatePotHoles("E 102ND ST");

function simscore (s1, s2) {
	q1 = qgram(s1, 3);
	q2 = qgram(s2, 3);
	return jaccard(q1, q2)
}

function jaccard(set1, set2) {
	var u = union(set1, set2);
	var i = intersection(set1, set2);
	return(i.length / u.length)
}


function qgram(addr, gramsize) {
	
	var ret = []
	var addrl = addr.split('');
	var window_start = (0 - gramsize + 1);
	var window_end = 0;
	while (window_start < addrl.length) {
		var gram = '';
		var temp_s = window_start;
		var temp_e = window_end;
		while (temp_s <= window_end) {
			if (temp_s < 0 || temp_s > (addrl.length - 1)) {
				gram += '#';
			} else {
				gram += addrl[temp_s];
			}
			temp_s+=1;
		}
		ret.push(gram)
		window_start += 1;
		window_end += 1;
	}
	return ret;
}


function union(x, y) {
  var obj = {};
  for (var i = x.length-1; i >= 0; --i)
     obj[x[i]] = x[i];
  for (var i = y.length-1; i >= 0; --i)
     obj[y[i]] = y[i];
  var ret = []
  for (var k in obj) {
    if (obj.hasOwnProperty(k))
      ret.push(obj[k]);
  }
  return ret;
}

function intersection(a, b) {
    var d1 = {};
    var d2 = {};
    var results = [];
    for (var i = 0; i < a.length; i++) {
        d1[a[i]] = true;
    }
    for (var j = 0; j < b.length; j++) {
        d2[b[j]] = true;
    }
    for (var k in d1) {
        if (d2[k]) 
            results.push(k);
    }
    return results;
}
