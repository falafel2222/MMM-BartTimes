Module.register("MMM-BartTimes", {

    // Module config defaults.
    defaults: {
        key : 'MW9S-E7SL-26DU-VV8V', // Public BART API key
        train_blacklist: [],
        updateInterval : 30000, // 30 seconds
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        var self = this;

        this.getDepartureInfo()
        // Schedule update timer.
        setInterval(function() {
            self.getDepartureInfo()
        }, this.config.updateInterval);
    },

    // Define required styles.
    getStyles: function() {
        return ["bart_times.css"];
    },

    getDepartureInfo: function() {
        Log.info("Requesting departure info");

        this.sendSocketNotification("GET_DEPARTURE_TIMES", {
            config: this.config
        });
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        if (!this.info) {
            wrapper.innerHTML = "LOADING";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        var table = document.createElement("table");
        table.className = "small";

        this.info.trains.forEach(train_name => {

            if (this.config.train_blacklist.includes(train_name)) {
                console.log('gottem')
                return;
            }

            var row = document.createElement("tr");
            table.appendChild(row);

            var trainCell = document.createElement("td");
            trainCell.className = "train";
            trainCell.innerHTML = train_name;
            row.appendChild(trainCell);

            this.info[train_name].forEach( time_to_departure => {
                var timeCell = document.createElement("td");
                timeCell.className = "time";
                if (!isNaN(time_to_departure)) {
                    time_to_departure += ' min';
                }
                timeCell.innerHTML = time_to_departure;
                row.appendChild(timeCell);
            });
        });

        return table;
    },

    // Override get header function
    getHeader: function() {
        if (this.info) {
            console.log(this.info.station_name);
            return this.info.station_name + ' BART Departure Times';
        }
        return 'BART Departure Times';
    },

    // Override notification handler.
    socketNotificationReceived: function(notification, payload) {
        if (notification === "DEPARTURE_TIMES") {
            this.info = payload
            this.updateDom();
        }
    },

});