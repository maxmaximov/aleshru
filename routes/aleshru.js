var fs = require("fs");
var request = require("request");

exports.aleshru = function (req, res){
    var json = /^\/json\//.test(req.path);
    var userId = 23641860;
    //var userId = 965487;
    var cacheFileName = "./cache/" + userId + ".json";
    var images = [];
    var tag = req["params"]["tag"];

    fs.readFile(cacheFileName, "utf-8", function (error, data) {
        if (error) {
            console.log(error);
        } else {
            images = data ? JSON.parse(data) : [];

            images = images.filter(function (item) {
                return item && item["images"];
            });

            if (tag) {
                images = images.filter(function (item) {
                    return item["tags"].length && ~item["tags"].indexOf(tag);
                });
            }

            if (json) {
                res.send(images);
            } else {
                res.render("aleshru", { "images": images, "tag": tag });
            }
        }
    });
};
