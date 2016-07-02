const path = require("path");

const lazyCache = require("./lazy-cache.js");

class Catalog {

    constructor() {
        this._tracks = [];
    }

    addFile(filename) {
        this._tracks.push({
            path: filename,
            filename: path.basename(filename)
        });
    }

    addFiles(filenames) {
        filenames.forEach((filename) => {
            this.addFile(filename);
        });
    }

    getTracks() {
        return this._tracks;
    }

    processTracks() {
        return Promise
            .all(this.getTracks().map(function(track) {
                return lazyCache
                    .getFileInfo(track.path)
                    .then(function(info) {
                        track.info = info;
                    });
            }));
    }

};

module.exports = Catalog;
