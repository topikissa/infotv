var React = require("react");
var markdown = require("markdown").markdown;

var TextSlide = React.createClass({
    render: function() {
        var slide = this.props.slide;
        var html = markdown.toHTML(slide.content || "");
        return <div key={this.props.key} className="slide text-slide" dangerouslySetInnerHTML={{__html: html}} />;
    }
});


var TextSlideEditor = React.createClass({
    setContent: function(event) {
        this.props.slide.content = event.target.value;
        this.props.tv.forceUpdate();
    },
    render: function() {
        var slide = this.props.slide;
        return (<div className="text-slide-editor"><textarea value={slide.content || ""} onChange={this.setContent} /></div>);
    }
});

module.exports = {
    view: TextSlide,
    editor: TextSlideEditor
};
