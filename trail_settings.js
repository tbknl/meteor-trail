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


Trail.Settings.Config = {};


// Handle transport settings:
if (settings[KEYS.TRANSPORTS] instanceof Array) {
    Trail.Settings.Config.transports = settings[KEYS.TRANSPORTS];
}
else {
    Trail.Settings.Config.transports = [{type: "console", options: {}}];
}


// Handle sharing log messages with the server:
if (clientSettings[KEYS.SHARE]) {
    Trail.Settings.Config.share = true;
    Trail.Settings.Config.shareMethodName = clientSettings[KEYS.SHARE_METHOD_NAME] || 'trail/logmessage';

    var share = clientSettings[KEYS.SHARE];
    Trail.Settings.Config.shareLevel = typeof share === 'object' && typeof share[KEYS.SHARE_LEVEL] === 'string' && Trail.LOG_LEVELS[share[KEYS.SHARE_LEVEL]] ? share[KEYS.SHARE_LEVEL] : null;
}


// Handle client side monitoring:
if (clientSettings[KEYS.MONITOR]) {
    Trail.Settings.Config.monitor = true;
    Trail.Settings.Config.monitorPublishName = clientSettings[KEYS.MONITOR_PUBLISH_NAME] || 'trail/latestmessages';
    Trail.Settings.Config.monitorDefaultLimit = typeof clientSettings[KEYS.MONITOR_DEFAULT_LIMIT] === 'number' ? clientSettings[KEYS.MONITOR_DEFAULT_LIMIT] : 200;

    var monitorConsole = clientSettings[KEYS.MONITOR_CONSOLE];
    Trail.Settings.Config.monitorConsole = !!monitorConsole;
    Trail.Settings.Config.monitorConsoleShow = typeof monitorConsole === 'object' && !!monitorConsole[KEYS.MONITOR_CONSOLE_SHOW];
    Trail.Settings.Config.monitorConsoleTheme = typeof monitorConsole === 'object' && typeof monitorConsole[KEYS.MONITOR_CONSOLE_THEME] === 'string' ? monitorConsole[KEYS.MONITOR_CONSOLE_THEME] : null;
    Trail.Settings.Config.monitorConsoleLarge = typeof monitorConsole === 'object' && !!monitorConsole[KEYS.MONITOR_CONSOLE_LARGE];
    Trail.Settings.Config.monitorConsoleWrap = typeof monitorConsole === 'object' && !!monitorConsole[KEYS.MONITOR_CONSOLE_WRAP];

    if (clientSettings[KEYS.MONITORS] instanceof Array) {
        Trail.Settings.Config.monitors = clientSettings[KEYS.MONITORS];
    }
    else {
        Trail.Settings.Config.monitors = [{name: 'Server + Client'}];
    }
}

