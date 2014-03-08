
if (Meteor.isServer) {
    var mongoTransportSetup = function() {
        var collectionName = typeof this.options.collection === 'string' ? this.options.collection : 'trail';
        this.collection = new Meteor.Collection(collectionName);
    };


    var mongoTransportLog = function(timestamp, level, message, meta) {
        this.collection.insert({
            timestamp: timestamp,
            level: level,
            message: message,
            meta: meta
        });
    };


    Trail.Instance.transportManager.addTransportType('mongo', mongoTransportSetup, mongoTransportLog);
}

