import React from "react";
import _ from "lodash";
import DummyEditor from "./dummy-editor.jsx";
import TextSlide from "./text-slide.jsx";
import ImageSlide from "./image-slide.jsx";
import MultiImageSlide from "./multi-image-slide.jsx";
import NowNextSlide from "./nownext-slide.jsx";
//import resultsserviceSlide from "./resultsservice-slide.jsx";
import ChangesSlide from "./changes-slide.jsx";
import SocialSlide from "./social-slide.jsx";
import AnimeSlide from "./anime-slide.jsx";



const slideModules = {
    text: TextSlide,
    image: ImageSlide,
    "multi-image": MultiImageSlide,
    nownext: NowNextSlide,
    changes: ChangesSlide,
    social: SocialSlide,
    //anime: AnimeSlide,
    //resultsservice: resultsserviceSlide,
};

const viewComponents = {};
const editorComponents = {};
_.each(slideModules, (mod, key) => {
    const slideModule = slideModules[key];
    viewComponents[key] = React.createFactory(slideModule.view);
    editorComponents[key] = React.createFactory(slideModule.editor || DummyEditor);
});

export default {
    modules: slideModules,
    views: viewComponents,
    editors: editorComponents,
};
