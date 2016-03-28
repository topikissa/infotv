import React from "react";
import SlidesComponent from "./slides.jsx";
import OverlayComponent from "./overlay.jsx";
import EditorComponent from "./editor.jsx";
const $ = require("zepto-browserify").$;
import DatumManager from "./datum";
import _ from "lodash";
import stagger from "./stagger";
import config from "./config";

function checkTallness() {
    document.body.classList.toggle("tall", (window.innerWidth < window.innerHeight));
}

const TVApp = React.createClass({
    getInitialState() {
        return {
            deck: null,
            slideIndex: 0,
            ticksUntilNextSlide: 1,
            edit: false,
        };
    },

    componentWillMount() {
        const self = this;
        this.deckUpdater = stagger({ interval: [50 * 1000, 70 * 1000], callback: self.requestDeck });
        this.scheduleUpdater = stagger({ interval: [60 * 4 * 1000, 60 * 6 * 1000], callback: self.requestSchedule });
        this.socialUpdater = stagger({ interval: [50 * 1000, 90 * 1000], callback: self.requestSocial });
        this.slideSwitchTimer = setInterval(self.slideSwitchTick, 3500);
        this.madokaTimer = setInterval(self.madokaTick, 10000);
        this.requestDeck();
        this.requestSchedule();
        this.requestSocial();
        if (config.edit) this.enableEditing();
        else document.body.classList.add("show");
        window.addEventListener("resize", _.debounce(checkTallness, 200));
        checkTallness();
    },

    componentWillUnmount() {
        this.deckUpdater.stop();
        this.scheduleUpdater.stop();
        this.socialUpdater.stop();
        clearInterval(this.madokaTimer);
        clearInterval(this.slideSwitchTimer);
    },

    slideSwitchTick() {
        if (this.state.edit) return false;
        const ticks = this.state.ticksUntilNextSlide - 1;
        this.setState({ ticksUntilNextSlide: ticks });
        if (ticks <= 0) {
            this.nextSlide();
        }
        return true;
    },

    nextSlide() {
        let ticksUntilNextSlide = 1;
        let newSlideIndex = null;
        for (let offset = 1; offset < 30; offset++) {
            newSlideIndex = Math.max(0, this.state.slideIndex + offset) % this.state.deck.slides.length;
            const newSlide = this.state.deck.slides[newSlideIndex];

            if (newSlide) {
                if ((0 | newSlide.duration) <= 0) continue; // skip zero-duration slides
                ticksUntilNextSlide = newSlide.duration;
                break;
            }
        }
        this.setState({ slideIndex: newSlideIndex, ticksUntilNextSlide });
    },

    viewSlideById(id) {
        const index = _.findIndex(this.state.deck.slides, (s) => s.id === id);
        if (index > -1) {
            this.setState({ slideIndex: index });
            console.log("Viewing slide:", index, "id", id);
        }
    },

    addNewSlide() {
        const slide = { type: "text", duration: 1, id: `s${Date.now().toString(30)}` };
        const deck = this.state.deck;
        deck.slides.splice(this.state.slideIndex, 0, slide);
        this.setState({ deck });
        this.viewSlideById(slide.id);
    },

    deleteCurrentSlide() {
        const deck = this.state.deck;
        deck.slides.splice(this.state.slideIndex, 1);
        this.setState({ deck, slideIndex: 0 });
    },

    requestDeck() {
        const self = this;
        if (self.state.edit) return false; // When in edit mode, prevent auto-update
        $.ajax({
            url: location.pathname,
            data: { action: "get_deck" },
            success(data) {
                const deck = data.deck;
                if (!self.state.deck || self.state.deck.id !== deck.id) {
                    self.setState({ deck, slideIndex: -1 });
                    self.nextSlide();
                    console.log("new deck", deck);
                }
                DatumManager.update(data.datums || {});
            },
        });
        return true;
    },

    requestSchedule() {
        const self = this;
        $.ajax({
            url: "/api/schedule/json2/",
            data: { event: config.event },
            success(data) {
                DatumManager.setValue("schedule", data);
                self.forceUpdate();
            },
        });
    },

    requestSocial() {
        const self = this;
        $.ajax({
            url: "/api/social/",
            success(data) {
                DatumManager.setValue("social", data);
                self.forceUpdate();
            },
        });
    },

    madokaTick() {
        const shouldMadoka = ((new Date()).getHours() < 1 && (Math.random() < 0.1));
        document.getElementById("content").classList.toggle("madoka", shouldMadoka);
    },

    enableEditing() {
        this.setState({ edit: true });
        return true;
    },

    render() {
        let currentSlide = null;
        if (config.only) {
            currentSlide = { type: config.only, id: "only" };
        } else if (this.state.deck && this.state.deck.slides) {
            currentSlide = this.state.deck.slides[this.state.slideIndex];
        }
        const editor = (this.state.edit ? <div id="editor" key="editor"><EditorComponent tv={this} deck={this.state.deck} currentSlide={currentSlide} /></div> : null);
        const eep = (this.state.deck && this.state.deck.eep ? <div id="eep">{this.state.deck.eep}</div> : null);
        const animate = !(this.state.edit || config.slow);
        return (<div>
            <div id="content" key="content">
                <SlidesComponent tv={this} currentSlide={currentSlide} animate={animate} />
            </div>
            <div id="overlay" key="overlay">
                <OverlayComponent />
            </div>
            {eep}
            {editor}
        </div>);
    },
});

export default TVApp;
