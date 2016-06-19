import _ from "lodash";
import QS from "query-string";

export default _.extend(
    {},
    window.Options || {},
    QS.parse(window.location.search)
);
