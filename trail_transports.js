// Handle transport settings:
 var transports = Trail.Settings.Config.transports;
if (transports instanceof Array) {
    for (var i = 0; i < transports.length; ++i) {
        var transport = transports[i];
        if (typeof transport === 'object' && !transport.disable) {
            var typeName = transport['type'],
                options = transport['options'];
            if (typeof typeName === 'string' && typeof options === 'object') {
                Trail.Instance.logger.addTransport(typeName, options);
            }
        }
    }
}

