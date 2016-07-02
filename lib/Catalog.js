const path = require("path");

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

};

module.exports = Catalog;
