var fs = require('fs');
var path = require('path');
var env = require('./env');

Preset.prototype.ini = undefined;
Preset.prototype.entries = undefined;
Preset.prototype.presetName = undefined;

Preset.prototype.getServerName = function () {
    return this.ini.SERVER.NAME;
};

Preset.prototype.getUdpPort = function() {
    return parseInt(this.ini.SERVER.PORT);
};

Preset.prototype.getHttpPort = function () {
    return parseInt(this.ini.SERVER.HTTP_PORT);
};

Preset.prototype.getTimeOfDay = function () {
    // base time for angle=0: 1PM // 13:00
    // min/max: -/+ 80
    var someDate = new Date(1970, 1, 1, 13, 0, 0, 0);
    someDate.setMinutes(someDate.getMinutes() + (this.ini.SERVER.SUN_ANGLE / 16 * 60));
    return someDate.toLocaleTimeString();
};

Preset.prototype.getMaxClients = function () {
    return parseInt(this.ini.MAX_CLIENTS)
};

Preset.prototype.getDriversFromEntryList = function () {
    var drivers = {};
    for (i = 0; i < Object.keys(this.entries).length; i++) {
        var driver = {
            sid: i,
            model: this.entries['CAR_' + i].MODEL,
            name: this.entries['CAR_' + i].DRIVERNAME,
            skin: this.entries['CAR_' + i].SKIN,
            guid: this.entries['CAR_' + i].GUID
        };
        drivers[driver.sid] = driver;
    }
    return drivers;
};

Preset.prototype.getPresetPath = function () {
    return env.getPresetPath(this.presetName);
};

Preset.prototype.getPresetName = function () {
    return this.presetName;
};

function Preset(thePresetName) {
    this.presetName = thePresetName;
    this.ini = require('ini').parse(fs.readFileSync(path.join(this.getPresetPath(), 'server_cfg.ini'), 'utf-8'));
    this.entries = require('ini').parse(fs.readFileSync(path.join(this.getPresetPath(), 'entry_list.ini'), 'utf-8'));
    console.log('Preset', this.getPresetName(), 'loaded');
}

module.exports = Preset;

//EOF