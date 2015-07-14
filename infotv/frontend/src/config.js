var _ = require("lodash");
module.exports = _.extend(
    {},
    window.Options || {},
    require("query-string").parse(window.location.search)
);
