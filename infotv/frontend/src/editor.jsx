import React from "react";
const $ = require("zepto-browserify").$;
import _ from "lodash";
const editorComponents = require("./s").default.editors;
import propTypes from "./prop-types";

export default class EditorComponent extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.confirmAndPublish = this.confirmAndPublish.bind(this);
        this.eepChanged = this.eepChanged.bind(this);
        this.moveSlideDown = this.moveSlideDown.bind(this);
        this.moveSlideUp = this.moveSlideUp.bind(this);
        this.slideChanged = this.slideChanged.bind(this);
        this.slideDurationChanged = this.slideDurationChanged.bind(this);
        this.slideTypeChanged = this.slideTypeChanged.bind(this);
    }

    getSlideEditor(currentSlide) {
        const editorComponentClass = editorComponents[currentSlide.type];
        const editorComponent = (editorComponentClass ? editorComponentClass({ slide: currentSlide, editor: this, tv: this.props.tv }) : `no editor for ${currentSlide.type}`);
        const slideTypeOptions = _.keys(editorComponents).map((t) => <option key={t} value={t}>{t}</option>);
        const slideTypeSelect = (<select key="slide-type" value={currentSlide.type} onChange={this.slideTypeChanged}>{slideTypeOptions}</select>);
        const slideDurationInput = (<input type="number" value={currentSlide.duration} min="0" max="10" onChange={this.slideDurationChanged} />);

        return (<div className="slide-editor">
            <div className="toolbar">
                <button onClick={this.props.tv.deleteCurrentSlide}>Poista</button>
                <button onClick={this.moveSlideUp}>Siirrä ylös</button>
                <button onClick={this.moveSlideDown}>Siirrä alas</button>
            </div>
            <div className="toolbar">
                <label>Sliden tyyppi: {slideTypeSelect}</label>
                <label>Sliden kesto: {slideDurationInput}&times;</label>
            </div>
            {editorComponent}
        </div>);
    }

    eepChanged(event) {
        const eep = event.target.value;
        this.props.deck.eep = (eep && eep.length ? eep : null);
        this.props.tv.forceUpdate();
    }

    slideChanged(event) {
        const id = event.target.value;
        this.props.tv.viewSlideById(id);
    }

    slideTypeChanged(event) {
        this.props.currentSlide.type = event.target.value;
        this.props.tv.forceUpdate();
    }

    moveSlide(slide_, direction) {
        const slides = this.props.deck.slides;
        const idx = slides.indexOf(slide_);
        if (idx === -1) return;
        const slide = slides.splice(idx, 1)[0];
        let newIdx = idx + direction;
        if (newIdx < 0) newIdx = 0;
        if (newIdx >= slides.length) newIdx = slides.length;
        slides.splice(newIdx, 0, slide);
    }

    moveSlideUp() {
        this.moveSlide(this.props.currentSlide, -1);
        this.props.tv.viewSlideById(this.props.currentSlide.id);
    }

    moveSlideDown() {
        this.moveSlide(this.props.currentSlide, +1);
        this.props.tv.viewSlideById(this.props.currentSlide.id);
    }

    slideDurationChanged(event) {
        this.props.currentSlide.duration = 0 | event.target.value;
        this.props.tv.forceUpdate();
    }

    confirmAndPublish() {
        if (this.props.deck.slides.length <= 0) {
            alert("Ei voi julkaista tyhjää pakkaa");
            return false;
        }
        if (!confirm("Oletko varma että haluat julkaista nykyisen pakan?")) {
            return false;
        }
        $.ajax({
            type: "POST",
            url: location.pathname,
            data: { action: "post_deck", data: JSON.stringify(this.props.deck) },
            success(data) {
                alert(data.message || "wut :(");
            },
            error() {
                alert("it broke");
            },
        });
        return true;
    }

    render() {
        if (!this.props.deck) {
            return (<div>Missing deck :(</div>);
        }
        const slides = this.props.deck.slides;
        const options = slides.map((s, i) => {
            let text = `Slide ${i + 1} (${s.type}) [${s.id}]`;
            if (s.duration <= 0) text += " (ei päällä)";
            return (<option key={s.id} value={s.id}>{text}</option>);
        });
        const currentSlide = this.props.currentSlide;
        let slideEditor = null;
        if (currentSlide) {
            slideEditor = this.getSlideEditor(currentSlide);
        }
        return (<div>
            <div className="editor-toolbar toolbar">
                <button onClick={this.confirmAndPublish}>Julkaise muutokset</button>
            </div>
            <div className="eep-editor toolbar">
                <label>
                    Erikoisviesti:&nbsp;
                    <input value={this.props.deck.eep || ""} onChange={this.eepChanged} />
                </label>
            </div>
            <div className="slide-selector toolbar">
                <select value={currentSlide ? currentSlide.id : null} onChange={this.slideChanged} id="editor-select-slide">{options}</select>
                <button onClick={this.props.tv.addNewSlide}>Uusi</button>
            </div>
            <div className="slide-editor-ctr">
                {slideEditor}
            </div>
        </div>);
    }
}

EditorComponent.propTypes = {
    deck: propTypes.deck.isRequired,
    tv: propTypes.tv.isRequired,
    currentSlide: propTypes.slide.isRequired,
};

