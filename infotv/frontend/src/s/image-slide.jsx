/* eslint "react/no-multi-comp": 0 */

import React from "react";
import propTypes from "../prop-types";
import { isImageURL } from "./utils";

const ImageSlide = React.createClass({
    propTypes: {
        slide: propTypes.slide.isRequired,
    },

    render() {
        const slide = this.props.slide;
        const url = slide.src;
        const style = {};
        if (isImageURL(url)) style.backgroundImage = `url(${url})`;
        return <div key={this.props.key} className="slide image-slide" style={style} />;
    },
});


const ImageSlideEditor = React.createClass({
    propTypes: {
        slide: propTypes.slide.isRequired,
        tv: propTypes.tv.isRequired,
    },

    setSrc(event) {
        this.props.slide.src = event.target.value;
        this.props.tv.forceUpdate();
    },

    render() {
        const slide = this.props.slide;
        return (<div className="image-slide-editor">
            <label>Kuvan osoite: <input type="url" value={slide.src || ""} onChange={this.setSrc} /></label>
        </div>);
    },
});

export default {
    view: ImageSlide,
    editor: ImageSlideEditor,
};
