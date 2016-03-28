
export function isImageURL(url) {
    return (/^http.+(jpg|gif|png|svg)$/i).test(url || "");
}
