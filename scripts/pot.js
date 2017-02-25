//var index = require('../data/street_ph.json')


function calculatePotHoles() {
	

}

// to load JSON pothole & street data

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
}


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
	loadJSON(function(response) {
		// Parse JSON string into object
		actual_JSON = JSON.parse(response);
		console.log(actual_JSON);
		var num = count(actual_JSON);
		console.log(num);

	});

	//for(int i = 0; i < Object.keys(actual_JSON).length; i++){
	//console.log(Object.keys(actual_JSON).length);
	//}
}

getNumPotholes();

function simscore (s1, s2) {
	q1 = qgram(s1);
	q2 = qgram(s2);
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
