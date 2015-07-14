var React = require("react/addons");
var DatumManager = require("../datum");

var AnimeSlide = React.createClass({
    displayName: 'AnimeSlide',

    render: function () {
        var anime = "" + (DatumManager.getValue("anime") || "");
        return (
            <div className="slide anime-slide">
                <span>{anime}</span>
            </div>
        );
    }
});


module.exports = {
    view: AnimeSlide,
};
