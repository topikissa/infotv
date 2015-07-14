var React = require("react");
var isImageURL = require("./utils").isImageURL;

var ImageSlide = React.createClass({
    render: function() {
        var slide = this.props.slide;
        var url = slide.src;
        var style = {};
        if(isImageURL(url)) style.backgroundImage = "url(" + url + ")";
        return (<div key={this.props.key} className="slide image-slide" style={style} />);
    }
});


var ImageSlideEditor = React.createClass({
    setSrc: function(event) {
        this.props.slide.src = event.target.value;
        this.props.tv.forceUpdate();
    },
    render: function() {
        var slide = this.props.slide;
        return (<div className="image-slide-editor">
            <label>Kuvan osoite: <input type="url" value={slide.src || ""} onChange={this.setSrc} /></label>
        </div>);
    }
});


module.exports = {
    view: ImageSlide,
    editor: ImageSlideEditor,
};
