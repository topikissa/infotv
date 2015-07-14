var React = require("react/addons");
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var slideComponents = require("./s").views;

var SlidesComponent = React.createClass({
    getSlideComponent: function(slideData) {
        if(!slideData) return <div/>;
        var arg = {slide: slideData, key: slideData.id, tv: this.props.tv};
        var comp = slideComponents[slideData.type];
        if(comp) return comp(arg);
        return <div className="slide">(unknown slide type: {slideData.type})</div>;
    },


    render: function() {
        var slideData = this.props.currentSlide;
        var slideComponent = this.getSlideComponent(slideData);
        if(this.props.animate) slideComponent = (<ReactCSSTransitionGroup transitionName="slide">{slideComponent}</ReactCSSTransitionGroup>);
        return slideComponent;
    }

});

module.exports = SlidesComponent;
