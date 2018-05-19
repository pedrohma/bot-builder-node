

var uspsTracking = require('./usps.js');
var parser = require('xml2json');


async function testing(){
    var xml = await uspsTracking("9400110200864624071913");
    var json = parser.toJson(xml);
   console.log("to json -> %s", json);
    var obj = JSON.parse(json);
    console.log(obj.TrackResponse.TrackInfo.ID);
}
 testing();