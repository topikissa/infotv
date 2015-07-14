/* eslint-disable new-cap */
"use strict";
require("!style!css!autoprefixer?browsers=last 2 version!less!current-style");
(function(window) {
    var React = require("react");
    var TVApp = React.createFactory(require("./tv.jsx"));
    window.React = React;
    window.TV = React.render(TVApp(), document.getElementById("tv"));
}(window));
