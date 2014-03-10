Package.describe({
    summary: "Trail - Pluggable logging for Meteor."
});

Package.on_use(function(api) {
    api.use(['livedata'], ['server']);
    api.use(['deps'], ['client']);

    // Allow us to detect 'insecure'.
    api.use('insecure', {weak: true});

    api.add_files('trail.js', ['server', 'client']);
    api.add_files('trail_settings.js', ['server', 'client']);
    api.add_files('trail_instance.js', ['server', 'client']);
    api.add_files('trail_transports.js', ['server', 'client']);
    api.add_files('trail_share-server.js', ['server']);
    api.add_files('trail_share-client.js', ['client']);
    api.add_files('trail_transport_console.js', ['server', 'client']);
    api.add_files('trail_transport_mongo.js', ['server']);

    api.export && api.export('Trail', ['server', 'client']);
});

Package.on_test(function (api) {
  api.use(['trail', 'tinytest', 'test-helpers']);

  api.add_files('trail_tests.js', ['server']);
});
