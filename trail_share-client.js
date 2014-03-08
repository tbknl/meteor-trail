if (Trail.Settings.Config.share) {
    var shareMethodName = Trail.Settings.Config.shareMethodName;

    if (Meteor.isClient) {
        var SHARE_TRANSPORT_NAME = '_share';

        Trail.Instance.logger.addTransport(SHARE_TRANSPORT_NAME, {});

        var shareTransportLog = function(timestamp, level, message, meta) {
            if (!meta._shared && Trail.isLogLevelLowerOrEqual(level, Trail.Settings.Config.shareLevel)) {
                Meteor.call(shareMethodName, timestamp, level, message, meta);
            }
        };

        Trail.Instance.transportManager.addTransportType(
            SHARE_TRANSPORT_NAME,
            null,
            shareTransportLog
        );
    }
}

