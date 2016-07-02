const path = require("path");

const debug = require("debug")("dbs-cache");

const id3 = require("id3js");

let fileInfo = {};

function extractDetailsFromLameName(fileLameName) {
    let [artist, title] = fileLameName.split("-");
    return {
        artist: artist.trim(),
        title: (title || "").trim()
    };
}

function sanitiseIDInformation(data, tag, filepath) {
    let filename = path.basename(filepath),
        lameName = filename.split(".")[0],
        lameDetails = extractDetailsFromLameName(lameName),
        idTitle = trim(tag.title || ""),
        idAlbum = trim(tag.album || ""),
        idArtist = trim(tag.artist || "");
    data.title = data.title || idTitle || lameDetails.title;
    data.artist = data.artist || lameDetails.artist;
    data.album = data.album || idAlbum;
    return data;
}

function trim(str) {
    return str
        .trim()
        .replace(/\u0000/g, "");
}

module.exports = {

    getFileInfo: function(filepath) {
        if (fileInfo[filepath]) {
            return Promise.resolve(fileInfo[filepath]);
        }
        let fileData = {
            title: "",
            artist: "",
            album: ""
        };
        return new Promise(function(resolve, reject) {
            id3(
                {
                    file: filepath,
                    type: id3.OPEN_LOCAL
                },
                function(err, tags) {
                    if (err) {
                        (reject)(err);
                    } else {
                        //fileData.tag = tags;
                        fileInfo[filepath] = sanitiseIDInformation(fileData, tags, filepath);
                        debug("New file: " + filepath);
                        (resolve)(fileData);
                    }
                }
            );
        });
    }

};
