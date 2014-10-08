

var consoleTransportSetup = function() {
    // Empty.
};


var consoleTransportLog = function(timestamp, level, message, meta) {
    var msg = '';
    if (Meteor.isClient) {
        msg = '[' + level + '] ' + message;
    }
    else {
        var prefix = '';
        var clientId = '' + meta._origin_id;
        if (meta._origin === 'client') {
            prefix = '(CLIENT: ' + clientId.slice(clientId.length - 8) + ') ';
        }

        // Format timestamp:
        var timestampFormat = this.options.timestampFormat;
        if (typeof timestampFormat === 'string') {
            timestamp = Trail.Util.formatTimestamp(timestamp, timestampFormat);
        }

        msg = prefix + timestamp + ' [' + level + '] ' + message;
    }

    if (this.options.meta || (this.options.meta === undefined && Meteor.isClient)) {
        var displayMeta = {};
        for (var key in meta) {
            if (meta.hasOwnProperty(key) && key.charAt(0) !== '_') {
                displayMeta[key] = meta[key];
            }
        }
        console.log(msg, displayMeta);
    }
    else {
        console.log(msg);
    }
};


Trail.Instance.transportManager.addTransportType('console', consoleTransportSetup, consoleTransportLog);

