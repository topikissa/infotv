var React = require("react");
var _ = require("lodash");
var isImageURL = require("./utils").isImageURL;

function parseImages(data) {
    return _(("" + (data || "")).split("\n")).map(function(line) {
        var m = /^(\d+)[;|](http.+)$/.exec(line);
        if(!m) return null;
        var duration = (0 | m[1]);
        if(duration <= 0) return null;
        if(!isImageURL(m[2])) return null;
        return {
            duration: duration,
            url: m[2]
        };
    }).compact().value();
}

var MultiImageSlide = React.createClass({
    getInitialState: function() {
        return {
            imageIndex: 0,
            images: parseImages(this.props.slide.config)
        };
    },
    componentDidMount: function() {
        this.setState({
            updateTimer: setInterval(this.tick, 100),
        });
    },
    componentWillUnmount: function() {
        clearInterval(this.state.updateTimer || 0);
    },
    tick: function() {
        var deadline;
        if(!this.isMounted()) return;
        if (!this.state.deadline) {
            var slide = this.state.images[this.state.imageIndex];
            if (slide) {
                deadline = (+new Date()) + slide.duration;
            } else {
                deadline = -1;
            }
            this.setState({deadline: deadline});
            return;
        }
        if (this.state.deadline > 0 && (+new Date()) >= this.state.deadline) {
            this.setState({
                imageIndex: this.state.imageIndex + 1,
                deadline: null
            });
        }
    },
    reset: function() {
        var state = _.extend(this.getInitialState(), {deadline: 0});
        this.setState(state);
    },
    render: function() {
        var image = null;
        if(this.state.images.length > 0) {
            var lastIndex = this.state.images.length - 1;
            var effIndex = Math.min(lastIndex, this.state.imageIndex);
            image = this.state.images[effIndex];
        }
        var style = {};
        if(image) style.backgroundImage = "url(" + image.url + ")";
        return (<div key={this.props.key} className="slide image-slide" style={style} onClick={this.reset} />);
    }
});


var MultiImageSlideEditor = React.createClass({
    setConfig: function(event) {
        this.props.slide.config = event.target.value;
        this.props.tv.forceUpdate();
    },
    render: function() {
        var slide = this.props.slide;
        return (<div className="multi-image-slide-editor">
            <textarea value={slide.config || ""} onChange={this.setConfig} placeholder="pituus (msek);HTTP-osoite ..." />
            <br/>
            {parseImages(slide.config).length} kelvollista kuvaa
        </div>);
    }
});


module.exports = {
    view: MultiImageSlide,
    editor: MultiImageSlideEditor
};
