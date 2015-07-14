var _ = require("lodash");

function Stagger(options) {
    var ival;
    options = _.extend({
        autostart: true,
        context: null,
        arguments: [],
        callback: function() {}
    }, options);
    if((ival = options.interval)) {
        options.min = ival[0];
        options.max = ival[1];
    }
    options.min = 0 | options.min;
    options.max = 0 | options.max;
    if(options.min < 0 || options.max < 0 || options.max < options.min) {
        throw new Error("Invalid interval: " + options.min + ".." + options.max);
    }
    this.options = options;
    this.timer = null;
    if(this.options.autostart) this.start();
}

Stagger.prototype.start = function() {
    this.stop();
    var timeout = 0 | (this.options.min + Math.random() * (this.options.max - this.options.min));
    if(timeout <= 0) throw new Error("Invalid timeout");
    var self = this;
    this.timer = setTimeout(function() {
        self.start();
        self.options.callback.apply(self.options.context, self.options.arguments);
    }, timeout);
};

Stagger.prototype.stop = function() {
    if(this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
    }
};

module.exports = function(options) {
    return new Stagger(options);
};
