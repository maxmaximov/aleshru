
/**
 * Module dependencies.
 */

var express = require("express")
  , routes = require("./routes")
  , auth = require("./routes/auth")
  , aleshru = require("./routes/aleshru")
  , http = require("http")
  , path = require("path");

var app = express();

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.favicon());
app.use(express.logger("dev"));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require("less-middleware")({ src: __dirname + "/public" }));
app.use(express.static(path.join(__dirname, "public")));

// development only
if ("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", routes.index);

app.get("/auth", auth.auth);
app.get("/auth/", auth.auth);

app.get("/aleshru", aleshru.aleshru);
app.get("/aleshru/", aleshru.aleshru);
app.get("/aleshru/:tag", aleshru.aleshru);
app.get("/aleshru/:tag/", aleshru.aleshru);
app.get("/json/:tag", aleshru.aleshru);
app.get("/json/:tag/", aleshru.aleshru);
app.get("/xml/:tag", aleshru.aleshru);
app.get("/xml/:tag/", aleshru.aleshru);

http.createServer(app).listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
