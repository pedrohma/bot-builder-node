let request = require('async-request'),
  response;

module.exports = async function (tracking) {
  var data = "";
  var url = "http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackRequest USERID=\"837NOCOM0134\"><TrackID ID=\"" + tracking + "\"></TrackID></TrackRequest>";

  try {

    response = await request(url);

    data = response.body;

    await request(url, {
      method: 'GET'
    });

  } catch (e) {
    data = e;
    console.log(e);
  }

  return data;
}

