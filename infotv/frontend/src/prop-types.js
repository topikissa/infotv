import { PropTypes } from "react";

export default {
    deck: PropTypes.shape({
        eep: PropTypes.string,
    }),
    slide: PropTypes.shape({
        src: PropTypes.string,
        config: PropTypes.string,
        id: PropTypes.string,
    }),
    tv: PropTypes.shape({
        forceUpdate: PropTypes.func.isRequired,
        viewSlideById: PropTypes.func.isRequired,
    }),
};
