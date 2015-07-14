module.exports.isImageURL = function(url) {
    return (/^http.+(jpg|gif|png|svg)$/i).test(url || "");
};
