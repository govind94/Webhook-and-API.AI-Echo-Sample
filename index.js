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
    if (req.body.result.metadata.intentName === 'weather') {
        console.log("WEATHERRRRRRRRRRRRRRRRRR");
        if (req.body.result.parameters.city === "") speech = "Enter city";
        else speech = 'weather intent was called';
        var data = {
            "facebook": {
                "attachment": {
                    "type": "video",
                    "payload": {
                        "url": "https://res-4.cloudinary.com/simpleview/image/upload/c_fill,f_auto,h_878,q_75,w_1903/v1/clients/boston/66b874f0_48f2_45fc_8d07_005732c5cc5c_0295e791-cf9f-4b9e-ba4e-246c196fe701.jpg"
                     }
                 }
             }
        }
        return res.json({
        speech: speech,
        data: data,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
    }
    else if (req.body.result.metadata.intentName === 'directions') {
        //speech = 'directions intent was called';
        console.log("111111111111111111111");
        var src = req.body.result.parameters.state[0];
        var dest = req.body.result.parameters.state[1];
        var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins="+src+"&destinations="+dest+"&key=AIzaSyCjiRhQBhF8bzzGerHIDHDYd9-emmB-0PU";
                https.get(url, function(resp) {
                    console.log("222222222222222222222");
                    var result;
                    var body = '';
                    resp.on('data', function(data) {
                        body += data;
                    });
                    resp.on('end', function() {
                        console.log("3333333333333333333333");
                        result = JSON.parse(body);
                        var str = result.rows[0].elements[0].distance.text;
                        speech = "Distance: " + str;
                        return res.json({
        speech: speech,
        displayText: speech,
        source: 'webhook-echo-sample'
    });
                    });
                });
    }
    //else speech = 'No intent was called';
});

restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
