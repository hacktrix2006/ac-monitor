var cfg = require('config');
var ac = require('./server-handler');

var checkServers = function() {
    for(presetName in ac.servers) {
        if(ac.status(ac.servers[presetName]) < 1) {
            console.error('Preset', presetName, 'found dead');
            delete ac.servers[presetName];
            autoRestart(presetName);
        }
    }
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
};

var autoRestart = function(presetName) {
    var restart = cfg.ACM.autostart[presetName]
    if(restart) {
        var server = require('./server')(presetName);
        console.log('Restarting', server.preset.presetName, '/', server.name);
        ac.start(server);
    }
};

exports.start = function() {
    setTimeout(checkServers, cfg.ACM.watchdog.interval);
};

