const usps = require('./model/usps');


async function testing(){
    var xml = await usps.getShippingInfo("9400116902283615823660");
    console.log(xml);

}

testing();