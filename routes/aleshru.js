var fs = require("fs");
var request = require("request");

exports.aleshru = function (req, res){
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
            console.log(images.length);
            res.render("aleshru", { "images": images, "tag": tag });
        }
    });
};
