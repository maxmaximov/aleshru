var fs = require('fs');
var request = require('request');

exports.auth = function(req, res){
    var accessTokenFileName = "./access_token";
    var clientId = "9382f93607cb4eae8e6b5aa80f305ca2";
    var clientSecret = "e148e5cea82645b082ff68cf02ffebbd";
    var redirectUrl = "http://82.196.4.108:3000/auth/";

    var authorizationCode = req.query["code"];
    var accessToken;

    if (authorizationCode) {
        var form = {
            "client_id": clientId,
            "client_secret": clientSecret,
            "grant_type": "authorization_code",
            "redirect_uri": redirectUrl,
            "code": authorizationCode
        };

        console.log("Request Instagram access token...");
        request.post("https://api.instagram.com/oauth/access_token", { "form": form, "json": true }, function (error, response, data) {
            accessToken = data["access_token"];

            if (error || !accessToken) {
                console.log(error);
                res.send(error);
            } else {
                console.log("Got it! " + accessToken);

                console.log("Write Instagram access token to file...");
                fs.writeFile(accessTokenFileName, JSON.stringify(data), function (error) {
                    if (error) {
                        console.log(error);
                        res.send(error);
                    }
                });

                res.redirect("/auth/");
            }
        });

    } else {
        console.log("Read Instagram access token from file...");
        fs.readFile(accessTokenFileName, "utf-8", function (error, data) {
            data = data ? JSON.parse(data) : {};
            accessToken = data["access_token"];
            if (error || !accessToken) {
                console.log("Redirect to Instagram...");
                res.redirect("https://api.instagram.com/oauth/authorize/?client_id=" + clientId + "&redirect_uri=" + encodeURIComponent(redirectUrl) + "&response_type=code");
            } else {
                console.log("Got it! " + accessToken);
                res.render("auth", { "img": data["user"]["profile_picture"] });
            }
        });
    }
};
