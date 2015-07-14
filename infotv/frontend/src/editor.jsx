var React = require("react");
var $ = require('zepto-browserify').$;
var _ = require("lodash");
var editorComponents = require("./s").editors;

var EditorComponent = React.createClass({
	componentWillMount: function() {
	},

	slideChanged: function(event) {
		var id = event.target.value;
		this.props.tv.viewSlideById(id);
	},

	slideTypeChanged: function(event) {
		var type = event.target.value;
		this.props.currentSlide.type = type;
		this.props.tv.forceUpdate();
	},

	eepChanged: function(event) {
		var eep = event.target.value;
		this.props.deck.eep = (eep && eep.length ? eep : null);
		this.props.tv.forceUpdate();
	},

	moveSlide: function(slide, direction) {
		var slides = this.props.deck.slides;
		var idx = slides.indexOf(slide);
		if(idx === -1) return;
		slide = slides.splice(idx, 1)[0];
		var newIdx = idx + direction;
		if(newIdx < 0) newIdx = 0;
		if(newIdx >= slides.length) newIdx = slides.length;
		slides.splice(newIdx, 0, slide);
	},

	moveSlideUp: function() {
		this.moveSlide(this.props.currentSlide, -1);
		this.props.tv.viewSlideById(this.props.currentSlide.id);
	},

	moveSlideDown: function() {
		this.moveSlide(this.props.currentSlide, +1);
		this.props.tv.viewSlideById(this.props.currentSlide.id);
	},

	slideDurationChanged: function(event) {
		this.props.currentSlide.duration = 0 | event.target.value;
		this.props.tv.forceUpdate();
	},

	confirmAndPublish: function() {
		if(this.props.deck.slides.length <= 0) {
			alert("Ei voi julkaista tyhjää pakkaa");
			return false;
		}
		if(!confirm("Oletko varma että haluat julkaista nykyisen pakan?")) {
			return false;
		}
		$.ajax({
			"type": "POST",
			"url": location.pathname,
			"data": {"action": "post_deck", "data": JSON.stringify(this.props.deck)},
			"success": function(data) {
				alert(data.message || "wut :(");
			},
			"error": function() {
				alert("it broke");
			}
		});
		return true;
	},

	getSlideEditor: function(currentSlide) {
		var editorComponentClass = editorComponents[currentSlide.type];
		var editorComponent = (editorComponentClass ? editorComponentClass({slide: currentSlide, editor: this, tv: this.props.tv}) : "no editor for " + currentSlide.type);
		var slideTypeOptions = _.keys(editorComponents).map(function(t){
			return (<option key={t} value={t}>{t}</option>);
		});
		var slideTypeSelect = (<select key="slide-type" value={currentSlide.type} onChange={this.slideTypeChanged}>{slideTypeOptions}</select>);
		var slideDurationInput = (<input type="number" value={currentSlide.duration} min="0" max="10" onChange={this.slideDurationChanged} />);

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
	},

	render: function() {
		if(!this.props.deck) {
			return (<div>Missing deck :(</div>);
		}
		var slides = this.props.deck.slides;
		var options = slides.map(function(s, i) {
			var text = "Slide " + (i + 1) + " (" + s.type + ") [" + s.id + "]";
			if(s.duration <= 0) text += " (ei päällä)";
			return (<option key={s.id} value={s.id}>{text}</option>);
		});
		var currentSlide = this.props.currentSlide;
		if(currentSlide) {
			var slideEditor = this.getSlideEditor(currentSlide);
		}
		return <div>
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
		</div>;
	}

});

module.exports = EditorComponent;

