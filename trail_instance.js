
Trail.Instance = {}; 


// Create transport-manager:
var transportManager = new Trail.TransportManager();
Trail.Instance.transportManager = transportManager;

// Create logger:
var logger = new Trail.Logger(transportManager);
Trail.Instance.logger = logger;
Meteor.log = logger;

