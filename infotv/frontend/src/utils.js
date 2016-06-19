
export function isImageURL(url) {
    return (/^http.+(jpg|gif|png|svg)$/i).test(url || "");
}

export function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    return response.json()
        .then((body) => { error.body = body; })
        .catch(() => {}) // Catch body parsing errors and continue
        .then(() => { throw error; });
}

export function fetchJSON(url, opts = {}) {
    const defaultOpts = { credentials: "same-origin" };
    return fetch(url, Object.assign({}, defaultOpts, opts))
        .then(checkStatus)
        .then((response) => response.json());
}
