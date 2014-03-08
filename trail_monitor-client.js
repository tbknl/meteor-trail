if (Trail.Settings.Config.monitor) {
    var monitorPublishName = Trail.Settings.Config.monitorPublishName;

    if (Meteor.isClient) {
        var latestMessagesCollection = new Meteor.Collection('trail');

        Trail.MonitorManager = (function() {
            function MonitorManager() {
                this._collection = new Meteor.Collection(null);
                this._monitors = {};
            }

            MonitorManager.prototype.addMonitor = function(monitor) {
                var name = monitor.getName();
                this._monitors[name] = monitor;
                this._collection.insert({name: name});
            };

            MonitorManager.prototype.removeMonitor = function(monitor) {
                var name = monitor.getName();
                delete this._monitors[name];
            };

            MonitorManager.prototype.getMonitorNamesReactive = function() {
                return this._collection.find().fetch();
            };

            MonitorManager.prototype.getMonitorByName = function(name) {
                return this._monitors[name];
            };

            return MonitorManager;
        })();


        Trail.Instance.monitorManager = new Trail.MonitorManager();


        Trail.Monitor = (function() {
            function Monitor(name, filter, options) {
                filter =  typeof filter === 'object' ? filter : {};
                options = typeof options === 'object' ? options : {};

                this._name = name;
                this._subscriptionHandle = Meteor.subscribe(monitorPublishName, filter, Trail.Origin.id);
                this._options = {
                    unmanaged: !!options.unmanaged,
                    limit: typeof options.limit === 'number' ? options.limit : Trail.Settings.Config.monitorDefaultLimit
                };
                this._collection = new Meteor.Collection(null);
                this._latestRemoteItemId = 0;
                this._localItemId = 0;

                var self = this;
                this._computation = Deps.autorun(function() {
                    // Construct selector:
                    var selector = Trail.Util.constructSelectorFromFilter(filter, Trail.Origin.id);
                    selector._monitorItemId = {$gt: self._latestRemoteItemId};

                    // Perform query:
                    var newItems = latestMessagesCollection.find(selector);

                    // Add new items to the local collection of items:
                    newItems.forEach(function(item) {
                        if (item._monitorItemId > self._latestRemoteItemId) {
                            self._latestRemoteItemId = item._monitorItemId;
                        }

                        self._collection.insert({
                            _itemId: ++self._localItemId,
                            timestamp: item.timestamp,
                            level: item.level,
                            levelValue: item.levelValue,
                            message: item.message,
                            meta: item.meta
                        });
                    });

                    // Remove local items that don't fit within the limit:
                    self._collection.remove({
                        _itemId: {$lte: self._localItemId - self._options.limit}
                    });
                });

                if (!this._options.unmanaged) {
                    Trail.Instance.monitorManager.addMonitor(this);
                }
            }

            Monitor.prototype.getName = function() {
                return this._name;
            };

            Monitor.prototype.getItemsReactive = function() {
                return this._collection.find();
            };

            Monitor.prototype.destroy = function() {
                this._computation.stop();
                this._subscriptionHandle.stop();

                if (!this._options.unmanaged) {
                    Trail.Instance.monitorManager.removeMonitor(this);
                }
            };

            return Monitor;
        })();

        // Create all monitors defined in the config settings:
        var monitors = Trail.Settings.Config.monitors;
        if (monitors instanceof Array) {
            for (var i = 0; i < monitors.length; ++i) {
                var monitorDef = monitors[i];
                if (!monitorDef.disable && typeof monitorDef.name === 'string') {
                    var monitor = new Trail.Monitor(monitorDef.name, monitorDef.filter, monitorDef.options);
                }
            }
        }
    }
}

