Package.describe({
    summary: "Trail - Pluggable logging for Meteor.",
    version: "0.1.2",
    name: "mrt:trail",
    git: "https://github.com/tbknl/meteor-trail.git"
});

Package.onUse(function(api) {
    api.versionsFrom('0.9.0');

    api.use('livedata', 'server');
    api.use('deps', 'client');

    // Allow us to detect 'insecure'.
    api.use('insecure', {weak: true});

    api.addFiles('trail.js', ['server', 'client']);
    api.addFiles('trail_settings.js', ['server', 'client']);
    api.addFiles('trail_instance.js', ['server', 'client']);
    api.addFiles('trail_transports.js', ['server', 'client']);
    api.addFiles('trail_share-server.js', ['server']);
    api.addFiles('trail_share-client.js', ['client']);
    api.addFiles('trail_transport_console.js', ['server', 'client']);
    api.addFiles('trail_transport_mongo.js', ['server']);

    api.export && api.export('Trail', ['server', 'client']);
});

Package.onTest(function (api) {
  api.use(['tinytest', 'test-helpers']);

  api.addFiles('trail_tests.js', ['server']);
});
