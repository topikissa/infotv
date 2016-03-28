import React from "react";
import DatumManager from "../datum";
import moment from "moment";
import cx from "classnames";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

const mediumIcons = {
    ig: "fa fa-instagram",
    tw: "fa fa-twitter",
};

class SocialSlide extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.renderElement = this.renderElement.bind(this);
        this.tick = this.tick.bind(this);

        this.state = {
            frame: 0,
        };
    }

    componentWillMount() {
        this.setState({ timer: setInterval(this.tick, 600) });
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick() {
        this.setState({ frame: this.state.frame + 1 });
    }

    renderElement(element) {
        const cn = `${cx({ item: true, "has-img": !!element.primary_image_url })} ${element.medium}`;
        const rand = parseInt(element.id.replace(/[^0-9]/g, ""), 10);
        const randf = (rand % 5000) / 5000;
        const duration = (0.6 + randf * 0.6);
        const style = {
            backgroundImage: (element.primary_image_url ? `url(${element.primary_image_url})` : null),
            animationDuration: `${duration}s`,
        };
        const author = `@${element.author_name.replace(/^@/, "")}`;
        const time = moment(element.posted_on).format("HH:mm");
        const mediumIcon = mediumIcons[element.medium] || null;
        return (
            <div style={style} className={cn} key={element.id}>
                <div className="meta">
                    <i className={mediumIcon} /> {author} @ {time}</div>
                <div className="body">{element.message}</div>
            </div>
        );
    }

    render() {
        const items = DatumManager.getValue("social") || [];
        const limit = Math.min(this.state.frame, items.length);
        const childElements = items.slice(0, limit).map(this.renderElement);

        return (
            <div className="slide social-slide">
                <ReactCSSTransitionGroup transitionName="social-item" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
                    {childElements}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

SocialSlide.displayName = "SocialSlide";

export default {
    view: SocialSlide,
};
