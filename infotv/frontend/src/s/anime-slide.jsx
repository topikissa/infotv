import React from "react";
import DatumManager from "../datum";

class AnimeSlide extends React.Component {
    render() {
        const anime = `${DatumManager.getValue("anime") || ""}`;
        return (
            <div className="slide anime-slide">
                <span>{anime}</span>
            </div>
        );
    }
}

export default {
    view: AnimeSlide,
};
