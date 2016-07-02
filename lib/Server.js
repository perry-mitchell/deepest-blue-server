const http = require("http");
const urlTools = require("url");
const socketIO = require("socket.io");
const socketStream = require("socket.io-stream");
const fs = require("fs");

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
            let infoPort = 33100,
                dataPort = 33200;

            let trackSocket;

            // create server
            this._server = http.createServer((request, response) => {
                if (/\/tracklist\/?$/.test(request.url)) {
                    debug("Request: tracklist");
                    response.end(this.handleTrackList());
                } else if (/\/connect\/?$/.test(request.url)) {
                    debug("Request: connect");
                    response.end(JSON.stringify({
                        status: "ok"
                    }));
                } else if (/\/send-track\/?\?filename=.+?$/.test(request.url)) {
                    let urlParts = urlTools.parse(request.url, true),
                        query = urlParts.query,
                        trackFilename = query.filename;
                    debug("Track request: " + trackFilename);
                    let stream = socketStream.createStream();
                    socketStream(trackSocket).emit("track", stream, { name: trackFilename });
                    fs.createReadStream(trackFilename).pipe(stream);
                } else {
                    response.end(JSON.stringify({status: "failure"}));
                }
            });

            // start server
            this._server.listen(infoPort, function() {
                debug("Listening on " + infoPort);
            });

            this._io = socketIO.listen(dataPort);
            this._io.of('/track').on('connection', function(socket) {
                trackSocket = socket;
            });
        }
    }

}

module.exports = DBS;
