var React = require("react");
var SlidesComponent = require("./slides.jsx");
var OverlayComponent = require("./overlay.jsx");
var EditorComponent = require("./editor.jsx");
var $ = require('zepto-browserify').$;
var DatumManager = require("./datum");
var _ = require("lodash");
var stagger = require("./stagger");
var config = require("./config");

function checkTallness() {
    document.body.classList.toggle("tall", !!(window.innerWidth < window.innerHeight));
}

var TVApp = React.createClass({
	getInitialState: function() {
		return {
			deck: null,
			slideIndex: 0,
			ticksUntilNextSlide: 1,
			edit: false
		};
	},

	componentWillMount: function() {
		var self = this;
		this.deckUpdater = stagger({interval: [50 * 1000, 70 * 1000], callback: self.requestDeck});
		this.scheduleUpdater = stagger({interval: [60 * 4 * 1000, 60 * 6 * 1000], callback: self.requestSchedule});
		this.socialUpdater = stagger({interval: [50 * 1000, 90 * 1000], callback: self.requestSocial});
		this.slideSwitchTimer = setInterval(self.slideSwitchTick, 3500);
		this.madokaTimer = setInterval(self.madokaTick, 10000);
		this.requestDeck();
		this.requestSchedule();
		this.requestSocial();
		if(config.edit) this.enableEditing();
        else document.body.classList.add("show");
        window.addEventListener("resize", _.debounce(checkTallness, 200));
        checkTallness();
	},

	componentWillUnmount: function() {
		this.deckUpdater.stop();
		this.scheduleUpdater.stop();
		this.socialUpdater.stop();
		clearInterval(this.madokaTimer);
		clearInterval(this.slideSwitchTimer);
	},

	slideSwitchTick: function() {
		if (this.state.edit) return false;
		var ticks = this.state.ticksUntilNextSlide - 1;
		this.setState({ticksUntilNextSlide: ticks});
		if (ticks <= 0) {
			this.nextSlide();
		}
	},

	nextSlide: function() {
		var ticksUntilNextSlide = 1;
		var deck = this.state.deck;
		if(deck === null) return;
		for(var offset = 1; offset < 30; offset++) {

            var newSlideIndex = Math.max(0, this.state.slideIndex + offset) % deck.slides.length;
			var newSlide = deck.slides[newSlideIndex];

			if (newSlide) {
				if((0 | newSlide.duration) <= 0) continue; // skip zero-duration slides
				ticksUntilNextSlide = newSlide.duration;
				break;
			}
		}
		this.setState({slideIndex: newSlideIndex, ticksUntilNextSlide: ticksUntilNextSlide});
	},

	viewSlideById: function(id) {
		var index = _.findIndex(this.state.deck.slides, function(s) { return s.id === id; });
		if(index > -1) {
			this.setState({slideIndex: index});
			console.log("Viewing slide:", index, "id", id);
		}
	},

	addNewSlide: function() {
		var slide = {type: "text", duration: 1, id: "s" + (+new Date()).toString(30)};
		var deck = this.state.deck;
		deck.slides.splice(this.state.slideIndex, 0, slide);
		this.setState({deck: deck});
		this.viewSlideById(slide.id);
	},

	deleteCurrentSlide: function() {
		var deck = this.state.deck;
		deck.slides.splice(this.state.slideIndex, 1);
		this.setState({deck: deck, slideIndex: 0});
	},

	requestDeck: function() {
		var self = this;
		if(self.state.edit) return false; // When in edit mode, prevent auto-update
		$.ajax({
			"url": location.pathname,
			"data": {"action": "get_deck"},
			"success": function(data) {
				var deck = data.deck;
				if(!self.state.deck || self.state.deck.id !== deck.id) {
					self.setState({deck: deck, slideIndex: -1});
					self.nextSlide();
					console.log("new deck", deck);
				}
				DatumManager.update(data.datums || {});
			}
		});
	},

	requestSchedule: function() {
		var self = this;
		$.ajax({
			"url": "/api/schedule/json2/",
			"data": {"event": config.event},
			"success": function(data) {
				DatumManager.setValue("schedule", data);
				self.forceUpdate();
			}
		});
	},

	requestSocial: function() {
		var self = this;
		$.ajax({
			"url": "/api/social/",
			"success": function(data) {
				DatumManager.setValue("social", data);
				self.forceUpdate();
			}
		});
	},

	madokaTick: function() {
		if ((new Date()).getHours() < 1) {
			if (Math.random() < 0.1) {
				$('#content').addClass('madoka');
			} else {
				$('#content').removeClass('madoka');
			}
		}
	},

	render: function() {
		var currentSlide = null;
		if(config.only) {
			currentSlide = {"type": config.only, "id": "only"};
		}
		else if(this.state.deck && this.state.deck.slides) {
			currentSlide = this.state.deck.slides[this.state.slideIndex];
		}
		var editor = (this.state.edit ? <div id="editor" key="editor"><EditorComponent tv={this} deck={this.state.deck} currentSlide={currentSlide} /></div> : null);
		var eep = (this.state.deck && this.state.deck.eep ? <div id="eep">{this.state.deck.eep}</div> : null);
		var animate = !(this.state.edit || config.slow);
		return (<div>
			<div id="content" key="content"><SlidesComponent tv={this} currentSlide={currentSlide} animate={animate} /></div>
			<div id="overlay" key="overlay"><OverlayComponent /></div>
			{eep}
			{editor}
		</div>);
	},
	enableEditing: function enableEditing() {
		this.setState({edit: true});
		return true;
	}
});

module.exports = TVApp;
