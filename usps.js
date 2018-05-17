const https = require('https');

module.exports = function (tracking) {

  console.log('start here');

  var url = "https://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackRequest USERID=\"YOUR_USER_ID\"><TrackID ID=\"" + tracking + "\"></TrackID></TrackRequest>";

  let data = '';

  https.get(url, (resp) => {

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      console.log(JSON.parse(data).explanation);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });

  return data;
}

