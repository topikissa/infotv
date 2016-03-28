import React from "react";
import DatumManager from "../datum";

function AnimeSlide() {
    const anime = `${DatumManager.getValue("anime") || ""}`;
    return (
        <div className="slide anime-slide">
            <span>{anime}</span>
        </div>
    );
}

export default {
    view: AnimeSlide,
};
