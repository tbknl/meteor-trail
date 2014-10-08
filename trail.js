Trail = {};


Trail.Util = {
    // Format a timestamp:
    formatTimestamp: function(timestamp, format) {
        var date = new Date(timestamp);
        var lut = Trail.Util._TimestampMethodLUT;

        return format.replace(/%(.)/g, function(match, p1) {
            if (p1 === '%') {
                return '%';
            }
            else if (lut.hasOwnProperty(p1)) {
                var m = lut[p1];
                var result = '' + date[m.fn].call(date);
                if (m.len && result.length < m.len) {
                    result = Array(1 + m.len - result.length).join(m.pad) + result;
                }
                return result;
            }
            else {
                return '%' + p1;
            }
        });
    },
    _TimestampMethodLUT: {
        'Y': {fn: 'getFullYear', len: 4, pad: '0'},
        'M': {fn: 'getMonth', len: 2, pad: '0'},
        'D': {fn: 'getDate', len: 2, pad: '0'},
        'h': {fn: 'getHours', len: 2, pad: '0'},
        'm': {fn: 'getMinutes', len: 2, pad: '0'},
        's': {fn: 'getSeconds', len: 2, pad: '0'},
        'u': {fn: 'getMilliseconds', len: 3, pad: '0'},
        'g': {fn: 'getTime'},
        'o': {fn: 'getTimezoneOffset'}
    }
};


Trail.Origin = {
    type: Meteor.isClient ? 'client' : 'server',
    id: (new Date()).getTime() + '_' + ('' + Math.random()).slice(2)
};


Trail.LOG_LEVELS = {
    'FATAL': 1,
    'ERROR': 2,
    'WARN': 3,
    'INFO': 4,
    'DEBUG': 5
};


Trail.isLogLevelLowerOrEqual = function(x, y) {
    var logLevelX = Trail.LOG_LEVELS[('' + x).toUpperCase()];
    var logLevelY = Trail.LOG_LEVELS[('' + y).toUpperCase()];
    return logLevelX == null || logLevelY == null || logLevelX <= logLevelY;
};


Trail.setDefaultMetaData = function(meta) {
    meta = typeof meta === 'object' ? meta : {};
    meta._origin = meta._origin || Trail.Origin.type;
    meta._origin_id = meta._origin_id || Trail.Origin.id;
    return meta;
};


Trail.Transport = (function() {
    // Constructor:
    function Transport(setupFunc, logFunc, typeName, options) {
        this._impl = {
            options: options
        };
        this._setupFunc = setupFunc;
        this._logFunc = logFunc;
        this._type = typeName;
        this._options = {
            level: options.level
        };

        this._setup();
    }

    // Setup the transport:
    Transport.prototype._setup = function() {
        if (typeof this._setupFunc === 'function') {
            this._setupFunc.call(this._impl);
        }
    };

    // Log a message:
    Transport.prototype.log = function(timestamp, level, message, meta) {
        if (Trail.isLogLevelLowerOrEqual(level, this._options.level)) {
            this._logFunc.call(this._impl, timestamp, level, message, meta);
        }
    };

    // Return the type name:
    Transport.prototype.getType = function() {
        return this._type;
    };

    return Transport;
})();


Trail.TransportManager = (function() {
    // Constructor:
    function TransportManager() {
        this._transportTypes = {};
        this._loggers = [];
    }

    // Register a logger for new-transport-type events:
    // TODO? Use an actual event mechanism.
    TransportManager.prototype.registerLogger = function(logger) {
        this._loggers.push(logger);
    };

    // Emit the new-transport-type event:
    // TODO? Use an actual event mechanism.
    TransportManager.prototype._emitNewTransportTypeEvent = function(transportTypeName) {
        for (var i = 0; i < this._loggers.length; ++i) {
            var logger = this._loggers[i];
            logger.newTransportType(transportTypeName);
        }
    };
    
    // Add transport type:
    TransportManager.prototype.addTransportType = function(name, setupFunc, logFunc) {
        this._transportTypes[name] = {
            setupFunc: setupFunc,
            logFunc: logFunc
        };
        this._emitNewTransportTypeEvent(name);
    };

    // Check whether transport type is available:
    TransportManager.prototype.isTransportTypeAvailable = function(name) {
        return typeof this._transportTypes[name] !== 'undefined';
    };

    // Create transport instance:
    TransportManager.prototype.createTransport = function(name, options) {
        if (!this.isTransportTypeAvailable(name)) {
            return null;
        }

        var transportType = this._transportTypes[name];
        return new Trail.Transport(transportType.setupFunc, transportType.logFunc, name, options);
    };

    return TransportManager;
})();


Trail.Logger = (function() {
    // Constructor:
    function Logger(transportManager) {
        this._transportManager = transportManager;
        this._transportManager.registerLogger(this);
        this._transportDescriptions = {};
        this._transports = [];
    }

    // Instantiate transports for the descriptions for this type:
    Logger.prototype._instantiateTransports = function(name) {
        var descriptionsByName = this._transportDescriptions[name];
        if (typeof descriptionsByName !== 'undefined' && this._transportManager.isTransportTypeAvailable(name)) {
            for (var i = 0; i < descriptionsByName.length; ++i) {
                var options = descriptionsByName[i];
                var transport = this._transportManager.createTransport(name, options);
                this._transports.push(transport);
            }
            descriptionsByName.splice(0, descriptionsByName.length); // Clear the array.
        }
    };

    // Add a transport:
    Logger.prototype.addTransport = function(name, options) {
        var descriptionsByName = this._transportDescriptions[name];
        if (typeof descriptionsByName === 'undefined') {
            descriptionsByName = [];
            this._transportDescriptions[name] = descriptionsByName;
        }

        descriptionsByName.push(options);

        this._instantiateTransports(name);
    };

    // Handler for new-transport-type events:
    Logger.prototype.newTransportType = function(name) {
        this._instantiateTransports(name);
    };

    // Log a message:
    Logger.prototype.logMessage = function(level, message, meta) {
        var timestamp = (new Date()).getTime(); // TODO: Create a timezone-independent server-synced timestamp.

        meta = Trail.setDefaultMetaData(meta);

        for (var i = 0; i < this._transports.length; ++i) {
            var transport = this._transports[i];
            transport.log(timestamp, level, message, meta);
        }
    };

    // Log messages of different log levels:
    Logger.prototype.fatal = function(message, meta) { this.logMessage('FATAL', message, meta); };
    Logger.prototype.error = function(message, meta) { this.logMessage('ERROR', message, meta); };
    Logger.prototype.warn = function(message, meta) { this.logMessage('WARN', message, meta); };
    Logger.prototype.info = function(message, meta) { this.logMessage('INFO', message, meta); };
    Logger.prototype.debug = function(message, meta) { this.logMessage('DEBUG', message, meta); };

    return Logger;
})();


