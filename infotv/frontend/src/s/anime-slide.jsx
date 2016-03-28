import React from "react";
import DatumManager from "../datum";

const AnimeSlide = React.createClass({
    displayName: "AnimeSlide",

    render() {
        const anime = `${DatumManager.getValue("anime") || ""}`;
        return (
            <div className="slide anime-slide">
                <span>{anime}</span>
            </div>
        );
    },
});


export default {
    view: AnimeSlide,
};
