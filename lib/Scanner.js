const Catalog = require("./Catalog.js");
const indexer = require("./file-indexer.js");

class Scanner {

    constructor(options = {}) {
        this._options = Object.assign(
            {},
            {
                scanDirectories: ["."],
                scanInterval: 20000
            },
            options
        );
        this._interval = null;
        this._catalog = new Catalog();
    }

    scan() {
        console.log("Scanning", this._options.scanDirectories);
        let catalog = new Catalog();
        Promise
            .all(
                this._options.scanDirectories.map(function(dir) {
                    return indexer
                        .getFileIndex(dir)
                        .then(function(index) {
                            catalog.addFiles(index);
                        });
                })
            )
            .then(() => {
                // Update catalog
                this._catalog = catalog;
                console.log("Updated catalog", catalog.getTracks());
            });
    }

    start() {
        this.scan();
        this._interval = setInterval(() => {
            this.scan();
        }, this._options.scanInterval);
    }

    stop() {
        clearInterval(this._interval);
    }

}

module.exports = Scanner;
