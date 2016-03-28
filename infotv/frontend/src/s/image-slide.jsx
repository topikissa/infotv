/* eslint "react/no-multi-comp": 0 */

import React from "react";
import propTypes from "../prop-types";
import { isImageURL } from "./utils";

function ImageSlide(props) {
    const slide = props.slide;
    const url = slide.src;
    const style = {};
    if (isImageURL(url)) style.backgroundImage = `url(${url})`;
    return <div key={props.key} className="slide image-slide" style={style} />;
}

ImageSlide.propTypes = {
    slide: propTypes.slide.isRequired,
};

class ImageSlideEditor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.setSrc = this.setSrc.bind(this);
    }

    setSrc(event) {
        this.props.slide.src = event.target.value;
        this.props.tv.forceUpdate();
    }

    render() {
        const slide = this.props.slide;
        return (<div className="image-slide-editor">
            <label>Kuvan osoite: <input type="url" value={slide.src || ""} onChange={this.setSrc} /></label>
        </div>);
    }
}

ImageSlideEditor.propTypes = {
    slide: propTypes.slide.isRequired,
    tv: propTypes.tv.isRequired,
};

export default {
    view: ImageSlide,
    editor: ImageSlideEditor,
};
