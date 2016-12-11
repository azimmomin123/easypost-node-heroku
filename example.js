var express = require('express')
var app = express()

//Production Key
//var apiKey = 'J3maCK5AdkXaVOccQAlmuA'
var apiKey = 'cueqNZUb3ldeWTNX7MU3Mel8UXtaAMUi'; //test API key
//var apiKey = 'cQVOnDzVCxA2YXpIadqNkg'; //This is 404's api key, switch it back to this.
var easypost = require('node-easypost')(apiKey); // after installing with NPM this can be require('node-easypost')(apiKey);

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://nameless-inlet-48347.herokuapp.com/');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.post('/', function (request, response) {


    var parcel = request.params.parcel;
    // var parcel = JSON.parse('{"' + decodeURI(parcel)
    //     .replace(/"/g, '\\"')
    //     .replace(/&/g, '","')
    //     .replace(/=/g,'":"') + '"}');

   // console.log(parcel);
    console.log('My get request fired!')
    var packageShip;

    
    // set addresses
var toAddress = {
    name: "Dr. Steve Brule",
    street1: "4626 Russett Ln",
    city: "Sugar Land",
    state: "TX",
    zip: "77479",
    country: "US",
    phone: "310-808-5243"
};

console.log(toAddress);
var fromAddress = {
    name: "EasyPost",
    street1: "118 2nd Street",
    street2: "4th Floor",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    phone: "415-123-4567"
};

// verify address
easypost.Address.create(toAddress, function(err, toAddress) {
    toAddress.verify(function(err, response) {
        if (err) {
            console.log('Address is invalid.');
        } else if (response.message !== undefined && response.message !== null) {
            console.log('Address is valid but has an issue: ', response.message);
            var verifiedAddress = response.address;
        } else {
            var verifiedAddress = response;
        }
    });
});

// set parcel
easypost.Parcel.create({
    predefined_package: "ValidPackageName",
    weight: 21.1
}, function(err, response) {
    console.log("err message!"+err);
});

// var parcel = {
//     // in INCHES
//     length: 10.2,
//     width: 7.8,
//     height: 4.3,
//     // in OZ
//     weight: 20.5
// };

// create customs_info form for intl shipping
var customsItem = {
    description: "EasyPost t-shirts",
    hs_tariff_number: 123456,
    origin_country: "US",
    quantity: 2,
    value: 96.27,
    weight: 21.1
};

// var customsInfo = {
//     customs_certify: 1,
//     customs_signer: "Hector Hammerfall",
//     contents_type: "gift",
//     contents_explanation: "",
//     eel_pfc: "NOEEI 30.37(a)",
//     non_delivery_option: "return",
//     restriction_type: "none",
//     restriction_comments: "",
//     customs_items: [customsItem]
// };


    // create shipment
    easypost.Shipment.create({
      to_address: toAddress,
      from_address: fromAddress,
      parcel: parcel,
      //customs_info: customsInfo
    }, function(err, shipment) {

        // shipment.lowestRate filters by carrier name and service name, and accepts negative filters by preceding the name with an exclamation mark
        shipment.buy({rate: shipment.lowestRate(['USPS', 'UPS', 'FedEx', '!Canpar'], '!LibraryMail, !mediaMAIL'), insurance: 100.00}, function(err, shipment) {
            packageShip = shipment;
            console.log('here is shipment'+ JSON.stringify(shipment)); //how do i turn [object Object] into text?
            //response.send(packageShip); //we dont need to do a res.send here because the shipment.buy method actually already does the sending for us
            console.log(JSON.stringify(packageShip));
            //Cross Origin Allow
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.send(JSON.stringify(packageShip));
        });
       
    });
 //currently this is sending parcel just so you know that it works, what should i change this to so I get back shipping info?

})



app.listen(process.env.PORT || 3000, function () {

  console.log('Example app listening on port 3000!')

})
