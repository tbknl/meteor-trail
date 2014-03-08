if (Trail.Settings.Config.monitor) {
    Trail.Util.constructSelectorFromFilter = function(filter, origin_id) {
        var selector = {};

        filter = typeof filter === 'object' ? filter : {};

        if (typeof filter.level === 'string') {
            var filterLevelValue = Trail.LOG_LEVELS[filter.level];
            if (typeof filterLevelValue === 'number') {
                selector.levelValue = {$lte: filterLevelValue};
            }
        }

        if (filter.server && !filter.client) {
            selector['meta._origin'] = 'server';
        }
        else if (filter.client && !filter.server) {
            selector['meta._origin'] = 'client';
        }

        if (!filter.other_clients) {
            selector['$or'] = [{'meta._origin_id': origin_id}, {'meta._origin': {$ne: 'client'}}];
        }

        if (filter.tag) {
            selector['meta.tag'] = filter.tag;
        }

        return selector;
    };
}

