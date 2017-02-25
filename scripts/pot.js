//var index = require('../data/street_ph.json')


function calculatePotHoles() {
	

}

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
