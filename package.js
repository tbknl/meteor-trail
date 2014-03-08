Package.describe({
    summary: "Trail - Pluggable logging for Meteor."
});

Package.on_use(function(api) {
    api.use(['livedata'], ['server']);
    api.use(['deps', 'session', 'templating'], ['client']);
    //api.use(['underscore'], ['server'  'client']);

    // Allow us to detect 'insecure'.
    api.use('insecure', {weak: true});

    api.add_files('trail.js', ['server', 'client']);
    api.add_files('trail_settings.js', ['server', 'client']);
    api.add_files('trail_instance.js', ['server', 'client']);
    api.add_files('trail_transports.js', ['server', 'client']);
    api.add_files('trail_share-server.js', ['server']);
    api.add_files('trail_share-client.js', ['client']);
    api.add_files('trail_monitor-shared.js', ['server', 'client']);
    api.add_files('trail_monitor-server.js', ['server']);
    api.add_files('trail_monitor-client.js', ['client']);
    api.add_files('trail_transport_console.js', ['server', 'client']);
    api.add_files('trail_transport_mongo.js', ['server']);

    // TODO: Make the trail_monitor_console files optional:
    api.add_files('monitor_console/trail_monitor_console.html', ['client']);
    api.add_files('monitor_console/trail_monitor_console.js', ['client']);
    api.add_files('monitor_console/trail_monitor_console.css', ['client']);

    api.export && api.export('Trail', ['server', 'client']);
});

Package.on_test(function (api) {
  api.use(['trail', 'tinytest', 'test-helpers']);

  api.add_files('trail_tests.js', ['server']);
});
