var React = require("react/addons");
var _ = require("lodash");
var DummyEditor = require("./dummy-editor.jsx");

var modules = {
    "text": require("./text-slide.jsx"),
    "image": require("./image-slide.jsx"),
    "multi-image": require("./multi-image-slide.jsx"),
    "nownext": require("./nownext-slide.jsx"),
    "social": require("./social-slide.jsx"),
    "anime": require("./anime-slide.jsx")
};

var viewComponents = {};
var editorComponents = {};
_.each(modules, function(mod, key) {
    mod = modules[key];
    viewComponents[key] = React.createFactory(mod.view);
    editorComponents[key] = React.createFactory(mod.editor || DummyEditor);
});

module.exports = {
    modules: modules,
    views: viewComponents,
    editors: editorComponents
};
