var fs = require('fs');
var request = require('request');

var userId = 23641860;
//var userId = 965487;
var cacheFileName = "./cache/" + userId + ".json";
var accessTokenFileName = "./access_token";
var accessToken;
var oldImages = [], newImages = [];
var i = 0;
var minId, maxId;

fs.readFile(accessTokenFileName, "utf-8", function (error, data) {
    data = data ? JSON.parse(data) : {};
    accessToken = data["access_token"];
    if (error || !accessToken) {
        console.log("Access token not found");
    } else {
        fs.readFile(cacheFileName, "utf-8", function (error, data) {
            oldImages = data ? JSON.parse(data) : [];

            if (oldImages.length) {
                minId = oldImages[0]["id"];
                //maxId = oldImages[oldImages.length - 1]["id"];
                getNextPage("https://api.instagram.com/v1/users/" + userId + "/media/recent?access_token=" + accessToken + (minId ? "&min_id=" + minId : ""), true);
            } else {
                getNextPage("https://api.instagram.com/v1/users/" + userId + "/media/recent?access_token=" + accessToken);
            }
        });
    }
});

function getNextPage (url, prepend) {
    console.log(++i + ". Get " + url);
    request.get(url, { "json": true }, function (error, response, data) {
        if (error) {
            console.log(error);
        } else {
            if (prepend) {
                data.data.pop();
            }

            newImages = newImages.concat(data.data);

            var nextUrl = data["pagination"] ? data["pagination"]["next_url"] : undefined;
            if (nextUrl) {
                getNextPage(nextUrl);
            } else {
                fs.writeFile(cacheFileName, JSON.stringify(newImages.concat(oldImages)), function (error) {
                    if (error) {
                        console.log(error);
                    }
                });
            }
        }
    });
}
