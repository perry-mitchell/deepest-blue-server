const recursiveSearch = require("recursive-readdir");

// ["*.mp3", "*.m4a", "*.wav"]

function getFileList(path) {
    return new Promise(function(resolve, reject) {
        recursiveSearch(path, function(err, files) {
            if (err) {
                console.error("Error", err);
                (reject)(err);
            } else {
                (resolve)(files);
            }
        });
    });
}

module.exports = {

    getFileIndex: function(path) {
        return getFileList(path);
    }

};
