'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var https = require('https');

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {
    //var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    var speech = '';
    if (req.body.result.metadata.intentName === 'weather')
        speech = 'weather intent was called';
    else if (req.body.result.metadata.intentName === 'directions') {
        //speech = 'directions intent was called';
        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=New+Brunswick&destinations=Newark&key=AIzaSyCjiRhQBhF8bzzGerHIDHDYd9-emmB-0PU";
                https.get(url, function(res) {
                    var result;
                    var body = '';
                    res.on('data', function(data) {
                        body += data;
                    });
                    res.on('end', function() {
                        result = JSON.parse(body);
                        var str = result.rows[0].elements[0].distance.text;
                        speech = "Distance: " + str;
                    });
                });
    }
    //else speech = 'No intent was called';
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
});

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
