if (Trail.Settings.Config.share) {
    var shareMethodName = Trail.Settings.Config.shareMethodName;

    if (Meteor.isServer) {
        var methods = {};
        methods[shareMethodName] = function(timestamp, level, message, meta) {
            meta._shared = true;
            meta._clientTimestamp = timestamp;
            meta._connection = this.connection.id;
            Trail.Instance.logger.logMessage(level, message, meta);
        };
        Meteor.methods(methods);
    }
}

