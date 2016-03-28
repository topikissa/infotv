import _ from "lodash";

export default _.extend(
    {},
    window.Options || {},
    require("query-string").parse(window.location.search)
);
