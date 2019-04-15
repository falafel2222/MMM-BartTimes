var request = require('request');
var NodeHelper = require("node_helper");
var { URL } = require('url');

BASE_URL = 'http://api.bart.gov/api/etd.aspx';

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node helper: " + this.name);
    },

    // Create a url to get estimated times of depature from the given station
    // using the API key
    build_search_url: function(station, key) {
        search_url = new URL(BASE_URL);
        search_url.searchParams.set('cmd', 'etd');
        search_url.searchParams.set('json', 'y');
        search_url.searchParams.set('key', key);
        search_url.searchParams.set('orig', station);
        return search_url
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this
        console.log("Notification: " + notification + " Payload: " + payload);

        if(notification === "GET_DEPARTURE_TIMES") {

            var bart_url = this.build_search_url(payload.config.station, payload.config.key);

            request(bart_url.href, function (error, response, body) {
                var departure_times = {};
                departure_times.trains = [];
                if (!error && response.statusCode == 200) {

                    trains = JSON.parse(body).root.station[0];
                    departure_times.station_name = trains.name;

                    trains.etd.forEach(train => {
                        departure_times.trains.push(train.destination);
                        departure_times[train.destination] = [];
                        train.estimate.forEach(est => {
                            departure_times[train.destination].push(est.minutes);
                        })
                    });
                    console.log("Train times loaded:" + departure_times);
                    self.sendSocketNotification("DEPARTURE_TIMES", departure_times);
                }
                else {
                    console.log("Bart Loading failed", error, response.statusCode);
                }
            });
        }
    },
});
