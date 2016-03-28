/* eslint "react/no-multi-comp": 0 */

import React from "react";
const markdown = require("markdown").markdown;
import propTypes from "../prop-types";

const TextSlide = React.createClass({
    propTypes: {
        slide: propTypes.slide.isRequired,
    },

    render() {
        const slide = this.props.slide;
        const html = markdown.toHTML(slide.content || "");
        return <div key={this.props.key} className="slide text-slide" dangerouslySetInnerHTML={{ __html: html }} />;
    },
});

const TextSlideEditor = React.createClass({
    propTypes: {
        slide: propTypes.slide.isRequired,
        tv: propTypes.tv.isRequired,
    },

    setContent(event) {
        this.props.slide.content = event.target.value;
        this.props.tv.forceUpdate();
    },

    render() {
        const slide = this.props.slide;
        return (<div className="text-slide-editor">
            <textarea value={slide.content || ""} onChange={this.setContent} />
        </div>);
    },
});

export default {
    view: TextSlide,
    editor: TextSlideEditor,
};
