const Catalog = require("./Catalog.js");
const indexer = require("./file-indexer.js");

const debug = require("debug")("dbs-scanner");

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

    getCatalog() {
        return this._catalog;
    }

    scan() {
        let catalog = new Catalog();
        Promise
            .all(
                this._options.scanDirectories.map(function(dir) {
                    return indexer
                        .getFileIndex(dir)
                        .then(function(index) {
                            catalog.addFiles(index);
                            return catalog.processTracks();
                        });
                })
            )
            .then(() => {
                // Update catalog
                this._catalog = catalog;
                debug(`Catalog updated: ${catalog.getTracks().length} tracks`);
                //console.log("Updated catalog", JSON.stringify(catalog.getTracks(), undefined, 4));
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
