/* eslint "react/no-multi-comp": 0 */

import React from "react";
import _ from "lodash";
import propTypes from "../prop-types";
import { isImageURL } from "./utils";

function parseImages(data) {
    return _(`${data || ""}`.split("\n")).map((line) => {
        const m = /^(\d+)[;|](http.+)$/.exec(line);
        if (!m) return null;
        const duration = (0 | m[1]);
        if (duration <= 0) return null;
        if (!isImageURL(m[2])) return null;
        return {
            duration,
            url: m[2],
        };
    }).compact()
        .value();
}

class MultiImageSlide extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.reset = this.reset.bind(this);
        this.tick = this.tick.bind(this);

        this.state = {
            imageIndex: 0,
            images: parseImages(props.slide.config),
        };
    }

    componentWillMount() {
        this.setState({
            updateTimer: setInterval(this.tick, 100),
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.updateTimer || 0);
    }

    tick() {
        let deadline;
        if (!this.state.deadline) {
            const slide = this.state.images[this.state.imageIndex];
            if (slide) {
                deadline = (+new Date()) + slide.duration;
            } else {
                deadline = -1;
            }
            this.setState({ deadline });
            return;
        }
        if (this.state.deadline > 0 && (+new Date()) >= this.state.deadline) {
            this.setState({
                imageIndex: this.state.imageIndex + 1,
                deadline: null,
            });
        }
    }

    reset() {
        const state = { deadline: 0, imageIndex: 0 };
        this.setState(state);
    }

    render() {
        let image = null;
        if (this.state.images.length > 0) {
            const lastIndex = this.state.images.length - 1;
            const effIndex = Math.min(lastIndex, this.state.imageIndex);
            image = this.state.images[effIndex];
        }
        let style = {};
        if (image) style.backgroundImage = `url(${image.url})`;
        return <div className="slide image-slide" style={style} onClick={this.reset} />;
    }
}

MultiImageSlide.propTypes = {
    slide: propTypes.slide.isRequired,
};

class MultiImageSlideEditor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.setConfig = this.setConfig.bind(this);
    }

    setConfig(event) {
        this.props.slide.config = event.target.value;
        this.props.tv.forceUpdate();
    }

    render() {
        const slide = this.props.slide;
        return (
            <div className="multi-image-slide-editor">
                <textarea value={slide.config || ""} onChange={this.setConfig} placeholder="pituus (msek);HTTP-osoite ..." />
                <br />
                {parseImages(slide.config).length} kelvollista kuvaa
            </div>
        );
    }
}

MultiImageSlideEditor.propTypes = {
    slide: propTypes.slide.isRequired,
    tv: propTypes.tv.isRequired,
};


export default {
    view: MultiImageSlide,
    editor: MultiImageSlideEditor,
};
