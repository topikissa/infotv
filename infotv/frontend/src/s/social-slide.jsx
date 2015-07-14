var React = require("react/addons");
var DatumManager = require("../datum");
var moment = require("moment");
var cx = require("classnames");
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var mediumIcons = {
    "ig": "fa fa-instagram",
    "tw": "fa fa-twitter",
};

var SocialSlide = React.createClass({
    displayName: 'SocialSlide',

    componentDidMount: function () {
        this.setState({timer: setInterval(this.tick, 600)});
    },

    getInitialState: function () {
        return {
            frame: 0
        };
    },

    tick: function () {
        this.setState({frame: this.state.frame + 1});
    },

    componentWillUnmount: function () {
        clearInterval(this.state.timer);
    },

    renderElement: function (element) {
        var cn = cx({item: true, "has-img": !!element.primary_image_url}) + " " + element.medium;
        var rand = parseInt(element.id.replace(/[^0-9]/g, ''));
        var randf = (rand % 5000) / 5000;
        var duration = (0.6 + randf * 0.6);
        var style = {
            backgroundImage: (element.primary_image_url ? "url(" + element.primary_image_url + ")" : null),
            animationDuration: "" + duration + "s"
        };
        var author = "@" + element.author_name.replace(/^@/, "");
        var time = moment(element.posted_on).format("HH:mm");
        var mediumIcon = mediumIcons[element.medium] || null;
        return (
            <div style={style} className={cn} key={element.id}>
                <div className="meta">
                    <i className={mediumIcon}></i> {author} @ {time}</div>
                <div className="body">{element.message}</div>
            </div>
        );
    },

    render: function () {
        var items = DatumManager.getValue("social") || [];
        var limit = Math.min(this.state.frame, items.length);
        var childElements = items.slice(0, limit).map(this.renderElement);

        return (
            <div className="slide social-slide">
                <ReactCSSTransitionGroup transitionName="social-item">{childElements}</ReactCSSTransitionGroup>
            </div>
        );
    }
});


module.exports = {
    view: SocialSlide,
};
