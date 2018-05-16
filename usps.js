var request = require('request');

var url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackRequest USERID=\"YOUR_USER_ID\"><TrackID ID=\"YOUR_TRACKING_NUMBER\"></TrackID></TrackRequest>";

request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});