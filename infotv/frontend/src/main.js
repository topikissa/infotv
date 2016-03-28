/* eslint-disable new-cap, no-param-reassign */

import React from "react";
import TV from "./tv.jsx";

require("!style!css!autoprefixer?browsers=last 2 version!less!current-style");

(function main(window) {
    const TVApp = React.createFactory(TV);
    window.React = React;
    window.TV = React.render(TVApp(), document.getElementById("tv"));
}(window));
