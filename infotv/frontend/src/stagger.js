import _ from "lodash";

function Stagger(initialOptions) {
    const options = _.extend({
        autostart: true,
        context: null,
        arguments: [],
        callback: () => {},
    }, initialOptions);
    const ival = options.interval;
    if (ival) {
        options.min = ival[0];
        options.max = ival[1];
    }
    options.min = 0 | options.min;
    options.max = 0 | options.max;
    if (options.min < 0 || options.max < 0 || options.max < options.min) {
        throw new Error(`Invalid interval: ${options.min}..${options.max}`);
    }
    this.options = options;
    this.timer = null;
    if (this.options.autostart) this.start();
}

Stagger.prototype.start = function start() {
    this.stop();
    const timeout = 0 | (this.options.min + Math.random() * (this.options.max - this.options.min));
    if (timeout <= 0) throw new Error("Invalid timeout");
    this.timer = setTimeout(() => {
        this.start();
        this.options.callback.apply(this.options.context, this.options.arguments);
    }, timeout);
};

Stagger.prototype.stop = function stop() {
    if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
    }
};

export default function (options) {
    return new Stagger(options);
}
