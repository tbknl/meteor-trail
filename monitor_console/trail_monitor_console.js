var trailMonitorConsoleKeyDownHandlerAttached = false;


Template.trail_monitor_console.created = function() {
    Session.setDefault('trail_monitor_console:show', !!Trail.Settings.Config.monitorConsoleShow);
    Session.setDefault('trail_monitor_console:large', !!Trail.Settings.Config.monitorConsoleLarge);
    Session.setDefault('trail_monitor_console:wrap', !!Trail.Settings.Config.monitorConsoleWrap);
    Session.setDefault('trail_monitor_console:monitor_name', null);

    if (!trailMonitorConsoleKeyDownHandlerAttached) {
        trailMonitorConsoleKeyDownHandlerAttached = true;

        var keyDownHandler = function(event) {
            event = event || window.event; // For IE.
            if (event.ctrlKey && event.shiftKey && event.keyCode === 77) { // Ctrl-Shift-M
                // Show/hide the monitor console:
                Session.set('trail_monitor_console:show', !Session.get('trail_monitor_console:show'));

                event.cancelBubble = true;
                event.returnValue = false;
                if (typeof event.stopPropagation === 'function') {
                    event.stopPropagation();
                }
                if (typeof event.preventDefault === 'function') {
                    event.preventDefault();
                }
                return false;
            }
            return true;
        };

        if (document.addEventListener) {
            document.addEventListener('keydown', keyDownHandler, false);
        }
        else if (document.attachEvent) {
            document.attachEvent('onkeydown', keyDownHandler);
        }
    }
};


Template.trail_monitor_console.events = {
    'change select': function(event) {
        Session.set('trail_monitor_console:monitor_name', event.target.value);
    },
    'click span.trail_toggle.js-trail_hide': function() {
        Session.set('trail_monitor_console:show', false);
    },
    'click span.trail_toggle.js-trail_size': function() {
        Session.set('trail_monitor_console:large', !Session.get('trail_monitor_console:large'));
    },
    'click span.trail_toggle.js-trail_wrap': function() {
        Session.set('trail_monitor_console:wrap', !Session.get('trail_monitor_console:wrap'));
    }
};


Template.trail_monitor_console.show = function() {
    return Session.get('trail_monitor_console:show');
};


Template.trail_monitor_console.theme = function() {
    return Trail.Settings.Config.monitorConsoleTheme || 'default';
};


Template.trail_monitor_console.large = function() {
    return Session.get('trail_monitor_console:large');
};


Template.trail_monitor_console.monitors = function() {
    var monitorName = Session.get('trail_monitor_console:monitor_name');
    var monitorItems = Trail.Instance.monitorManager.getMonitorNamesReactive().map(function(item) {
        if (monitorName === null) {
            monitorName = item.name;
            Session.set('trail_monitor_console:monitor_name', monitorName);
        }
        if (item.name === monitorName) {
            item.selected = true;
        }
        return item;
    });

    if (monitorItems.length === 0) {
        Session.set('trail_monitor_console:monitor_name', null);
        monitorItems.push({name: '...', selected: true});
    }

    return monitorItems;
};


Template['trail_monitor_console-items'].items = function() {
    var monitorName = Session.get('trail_monitor_console:monitor_name'),
        monitor = Trail.Instance.monitorManager.getMonitorByName(monitorName);

    return monitor ? monitor.getItemsReactive() : [];
};


Template['trail_monitor_console-items'].wrap = function() {
    return Session.get('trail_monitor_console:wrap');
};


Template['trail_monitor_console-items'].rendered = function() {
    // Scroll to the bottom of the items container:
    // TODO: Make a toggle button to disable this behavior.
    var itemsElem = this.find('div.trail_items');
    itemsElem.scrollTop = itemsElem.scrollHeight;
};


Template['trail_monitor_console-item'].isServer = function() {
    return typeof this.meta === 'object' && this.meta._origin === 'server';
};


Template['trail_monitor_console-item'].isOtherClient = function() {
    return typeof this.meta === 'object' && this.meta._origin === 'client' && this.meta._origin_id !== Trail.Origin.id;
};


Template['trail_monitor_console-item'].levelText = function() {
    var lut = {
        FATAL: 'F',
        ERROR: 'E',
        WARN: 'W',
        INFO: 'I',
        DEBUG: 'D'
    };

    var text = lut[this.level];
    return text ? text : '?';
};


