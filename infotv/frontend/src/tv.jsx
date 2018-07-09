import React from "react";
import QS from "query-string";
import SlidesComponent from "./slides.jsx";
import OverlayComponent from "./overlay.jsx";
import EditorComponent from "./editor.jsx";
import DatumManager from "./datum";
import _ from "lodash";
import stagger from "./stagger";
import config from "./config";
import { fetchJSON, fetchCorsJSON } from "./utils";

function checkTallness() {
    document.body.classList.toggle("tall", (window.innerWidth < window.innerHeight));
}

export default class TVApp extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.madokaTick = this.madokaTick.bind(this);
        this.requestDeck = this.requestDeck.bind(this);
        this.requestSchedule = this.requestSchedule.bind(this);
        this.requestChanges = this.requestChanges.bind(this);
        this.requestSocial = this.requestSocial.bind(this);
        this.slideSwitchTick = this.slideSwitchTick.bind(this);
        this.addNewSlide = this.addNewSlide.bind(this);
        this.deleteCurrentSlide = this.deleteCurrentSlide.bind(this);

        this.state = {
            deck: null,
            slideIndex: 0,
            ticksUntilNextSlide: 1,
            edit: false,
        };
    }

    componentWillMount() {
        const self = this;
        this.deckUpdater = stagger({ interval: [50 * 1000, 70 * 1000], callback: self.requestDeck });
        this.scheduleUpdater = stagger({ interval: [60 * 4 * 1000, 60 * 6 * 1000], callback: self.requestSchedule });
        this.changesUpdater = stagger({ interval: [60 * 4 * 1000, 60 * 6 * 1000], callback: self.requestChanges });
        this.socialUpdater = stagger({ interval: [50 * 1000, 90 * 1000], callback: self.requestSocial });
        this.slideSwitchTimer = setInterval(self.slideSwitchTick, 3500);
        this.madokaTimer = setInterval(self.madokaTick, 10000);
        this.requestDeck();
        this.requestSchedule();
        this.requestChanges();
        this.requestSocial();
        if (config.edit) this.enableEditing();
        else document.body.classList.add("show");
        window.addEventListener("resize", _.debounce(checkTallness, 200));
        checkTallness();
    }

    componentWillUnmount() {
        this.deckUpdater.stop();
        this.scheduleUpdater.stop();
        this.changesUpdater.stop();
        this.socialUpdater.stop();
        clearInterval(this.madokaTimer);
        clearInterval(this.slideSwitchTimer);
    }

    slideSwitchTick() {
        if (this.state.edit) return false;
        const ticks = this.state.ticksUntilNextSlide - 1;
        this.setState({ ticksUntilNextSlide: ticks });
        if (ticks <= 0) {
            this.nextSlide();
        }
        return true;
    }

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
    }

    viewSlideById(id) {
        const index = _.findIndex(this.state.deck.slides, (s) => s.id === id);
        if (index > -1) {
            this.setState({ slideIndex: index });
            console.log("Viewing slide:", index, "id", id);
        }
    }

    addNewSlide() {
        const slide = { type: "text", duration: 1, id: `s${Date.now().toString(30)}` };
        const deck = this.state.deck;
        deck.slides.splice(this.state.slideIndex, 0, slide);
        this.setState({ deck });
        this.viewSlideById(slide.id);
    }

    deleteCurrentSlide() {
        const deck = this.state.deck;
        deck.slides.splice(this.state.slideIndex, 1);
        this.setState({ deck, slideIndex: 0 });
    }

    requestDeck() {
        if (this.state.edit) return false; // When in edit mode, prevent auto-update

        fetchJSON(`${location.pathname}?${QS.stringify({ action: "get_deck" })}`)
            .then((data) => {
                const deck = data.deck;
                if (!this.state.deck || this.state.deck.id !== deck.id) {
                    this.setState({ deck, slideIndex: -1 });
                    this.nextSlide();
                    console.log("new deck", deck);
                }
                DatumManager.update(data.datums || {});
            });

        return true;
    }

    requestChanges() {
        fetchJSON("/static/infotv/" + config.event + "_orig.json")
                .then((data) => {
                    DatumManager.setValue("orig_schedule", data);    
                    this.forceUpdate();
                });
    
        fetchCorsJSON(`https://kompassi.eu/api/v1/events/ropecon2018/programme`)
                .then((data) => {
                    DatumManager.setValue("current_schedule", data);
                    this.forceUpdate();
                });
    }

    requestSchedule() {

        fetchCorsJSON(`https://kompassi.eu/api/v1/events/ropecon2018/programme`)
                .then((data) => {
                    DatumManager.setValue("schedule", data);
                    this.forceUpdate();
                });
    }

    requestSocial() {
        fetchJSON("/api/social/")
            .then((data) => {
                DatumManager.setValue("social", data);
                this.forceUpdate();
            });
    }

    madokaTick() {
        const shouldMadoka = false; // permanently disable special illegible night font
        document.getElementById("content").classList.toggle("madoka", shouldMadoka);
    }

    enableEditing() {
        this.setState({ edit: true });
        return true;
    }

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
			<img id="lohhe" src="/static/infotv/rcon-small.png"/>
                <OverlayComponent />
            </div>
            {eep}
            {editor}
        </div>);
    }
}
