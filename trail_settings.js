Trail.Settings = {};


// Setting keys:
var KEYS = {
    SHARE: 'share',
    SHARE_LEVEL: 'level',
    SHARE_METHOD_NAME: 'method_name',
    TRANSPORTS: 'transports',
    MONITOR: 'monitor',
    MONITORS: 'monitors',
    MONITOR_PUBLISH_NAME: 'monitor_name',
    MONITOR_DEFAULT_LIMIT: 'monitor_default_limit',
    MONITOR_CONSOLE: 'monitor_console',
    MONITOR_CONSOLE_SHOW: 'show',
    MONITOR_CONSOLE_THEME: 'theme',
    MONITOR_CONSOLE_LARGE: 'large',
    MONITOR_CONSOLE_WRAP: 'wrap'
};
Trail.Settings.KEYS = KEYS;


// Load settings:
var settings = {};
var clientSettings = Meteor.settings && Meteor.settings['public'] ? Meteor.settings['public'].trail : {};
if (Meteor.isClient) {
    settings = clientSettings;
}
else if (Meteor.isServer) {
    settings = Meteor.settings ? Meteor.settings.trail : {};
}
clientSettings = typeof clientSettings === 'object' ? clientSettings : {};
settings = typeof settings === 'object' ? settings : {};


Trail.Settings.settings = settings; // Client-side this is the same as clientSettings.
Trail.Settings.clientSettings = clientSettings;
Trail.Settings.Config = {}; // Parsed configuration settings.


// Handle transport settings:
if (settings[KEYS.TRANSPORTS] instanceof Array) {
    Trail.Settings.Config.transports = settings[KEYS.TRANSPORTS];
}
else {
    Trail.Settings.Config.transports = [{type: "console", options: {}}];
}


// Handle sharing settings:
if (clientSettings[KEYS.SHARE]) {
    Trail.Settings.Config.share = true;
    Trail.Settings.Config.shareMethodName = clientSettings[KEYS.SHARE_METHOD_NAME] || 'trail/logmessage';

    var share = clientSettings[KEYS.SHARE];
    Trail.Settings.Config.shareLevel = typeof share === 'object' && typeof share[KEYS.SHARE_LEVEL] === 'string' && Trail.LOG_LEVELS[share[KEYS.SHARE_LEVEL]] ? share[KEYS.SHARE_LEVEL] : null;
}

