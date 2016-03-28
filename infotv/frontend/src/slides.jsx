import React, { PropTypes } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import propTypes from "./prop-types";
const slideComponents = require("./s").default.views;

const SlidesComponent = React.createClass({
    propTypes: {
        tv: propTypes.tv.isRequired,
        animate: PropTypes.bool,
        currentSlide: propTypes.slide.isRequired,
    },

    getSlideComponent(slideData) {
        if (!slideData) return <div />;
        const arg = { slide: slideData, key: slideData.id, tv: this.props.tv };
        const comp = slideComponents[slideData.type];
        if (comp) return comp(arg);
        return <div className="slide">(unknown slide type: {slideData.type})</div>;
    },

    render() {
        const slideData = this.props.currentSlide;
        let slideComponent = this.getSlideComponent(slideData);
        if (this.props.animate) {
            slideComponent = (
                <ReactCSSTransitionGroup transitionName="slide" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                    {slideComponent}
                </ReactCSSTransitionGroup>
            );
        }
        return slideComponent;
    },
});

export default SlidesComponent;
