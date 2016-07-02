const http = require("http");

const debug = require("debug")("dbs");

class DBS {

    constructor(options) {
        this._options = options;
        this._running = false;
    }

    handleTrackList() {
        let catalog = this._options.scanner.getCatalog(),
            tracks = catalog.getTracks(),
            info = {
                status: "ok",
                context: "tracklist",
                tracks: tracks
            };
        return JSON.stringify(info);
    }

    start() {
        if (!this._running) {
            // listen port
            let port = 33100;

            // create server
            this._server = http.createServer((request, response) => {
                if (/\/tracklist\/?$/.test(request.url)) {
                    debug("Request: tracklist");
                    response.end(this.handleTrackList());
                } else {
                    response.end(JSON.stringify({status: "failure"}));
                }
            });

            // start server
            this._server.listen(port, function() {
                debug("Listening on " + port);
            });
        }
    }

}

module.exports = DBS;
