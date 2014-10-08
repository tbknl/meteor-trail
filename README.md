meteor-trail
============

Trail - Pluggable logging for Meteor.


Installation
------------
Install this package using [Meteorite](https://github.com/oortcloud/meteorite/):

``` sh
mrt add trail
```

Configuration
-------------
Trail can be configured through [Meteor settings](http://docs.meteor.com/#meteor_settings).

Separate Trail configurations can be made for the server and client. You can specify transports for both the server and client:

``` json
{
  ...
  "trail": {
    "transports": [
      {
        "type": "console",
        "options": {
          "meta": false,
          "level": "DEBUG",
          "timestampFormat": "(%Y-%M-%D %h:%m:%s.%u)"
        }
      },
      {
        "type": "mongo",
        "options": {
          "level": "ERROR",
          "collection": "error_log"
        }
      }
    ]
  },
  ...
  "public": {
    ...
    "trail": {
      "transports": [
        {
          "type": "console",
          "options": {
            "level": "DEBUG"
          }
        }
      ]
    }
    ...
  }
}
```

The above configuration defines two transports for the server side and one for the client side. All transports have the `level` option, which specifies what log levels will go through it. Each transport type has its own options too, for example the `collection` option of the mongo transport, which defines the name of the mongo collection to use.

The available log levels are, in decreasing order: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.


### Sharing client log messages to the server

Client log messages can be shared with the server, with the following setting:
``` json
{
  ...
  "public": {
    ...
    "trail": {
      "share": true,
      ...
    }
    ...
}
```

Instead of the value `true` you can also specify the maximum log level of the shared messages:
``` json
{
  ...
  "public": {
    ...
    "trail": {
      "share": {
        "level": "WARN"
      },
      ...
    }
    ...
}
```


### Additional transports at run-time

At run-time, additional transports can be added to a client-side logger. For example:
``` javascript
Meteor.log.addTransport("console", {"level": "WARN", "meta": false});
```

Usage:
------
A default logger is initialized by the package on both server and client. It can be reached through `Meteor.log`. The methods that log a message, take a 'meta' object as an optional second argument, which is transported/stored/displayed with the message:
``` javascript
Meteor.log.debug('My debug message', {tag: 'example'});
Meteor.log.info('Info message with meta data');
Meteor.log.warn('Warning!', {});
Meteor.log.error('Some error occurred.', {some: 'meta', data: 'without', any: 'further', meaning: '!'});
```


Extending Trail, create your own transport type
-----------------------------------------------
You can create your own transport type in the same way that the transport types that come with the Trail package are defined. For example take a look at `trail_transport_console.js`.

You should define a setup function and a log function. These functions are bound to the same Object, available through `this`. The options defined in the settings are available And finally call `addTransportType` on the transport-manager.
``` javascript
var myTransportSetup = function() {
  if (this.options.someCoolSetting) {
    // Do something cool.
  }
};

var myTransportLog = function(timestamp, level, message, meta) {
  if (this.options.meta) {
    // Transport message and meta.
  }
  else {
    // Transport without meta.
  }
};

Trail.Instance.transportManager.addTransportType('my_transport_type', myTransportSetup, myTransportLog);
```


Contributions
-------------
Any contributions are welcome. Please create an issue on github to start a discussion about the contribution you're planning to make.


Available external extensions:
------------------------------
* [Trail-Monitor](https://github.com/tbknl/meteor-trail-monitor): Monitor messages from the server and all clients in a development console in the browser.
