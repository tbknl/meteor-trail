if (Trail.Settings.Config.monitor) {
    var monitorPublishName = Trail.Settings.Config.monitorPublishName;

    if (Meteor.isServer) {
        var latestMessagesCollection = new Meteor.Collection('trail', {connection: null});

        var MONITOR_TRANSPORT_NAME = '_monitor',
            LATEST_MESSAGES_EXPIRE = 60000; // Milliseconds.

        Meteor.publish(monitorPublishName, function(filter, origin_id) {
            var selector = Trail.Util.constructSelectorFromFilter(filter, origin_id);
            selector._monitorTimestamp = {$gt: (new Date()).getTime() - LATEST_MESSAGES_EXPIRE};

            return latestMessagesCollection.find(selector);
        });

        var monitorTransportSetup = function(options) {
            this.monitorItemId = 1;
        };

        var monitorTransportLog = function(timestamp, level, message, meta) {
            latestMessagesCollection.remove({_monitorTimestamp: {$lte: (new Date()).getTime() - LATEST_MESSAGES_EXPIRE}});

            latestMessagesCollection.insert({
                _monitorItemId: this.monitorItemId++,
                _monitorTimestamp: (new Date()).getTime(),
                timestamp: timestamp,
                level: level,
                levelValue: Trail.LOG_LEVELS[level],
                message: message,
                meta: meta
            });
        };

        Trail.Instance.transportManager.addTransportType(
            MONITOR_TRANSPORT_NAME,
            monitorTransportSetup,
            monitorTransportLog
        );

        Trail.Instance.logger.addTransport(MONITOR_TRANSPORT_NAME, {});
    }
}

