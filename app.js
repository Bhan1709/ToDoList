const express = require("express");
const app = express();

const https = require("https");

app.use(express.urlencoded());

app.set("view engine", "ejs");

var vItems = [];

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    let vDay = today.toLocaleDateString("en-US", options);

    res.render("index", { date: vDay, items: vItems });
})

app.post("/", function (req, res) {
    vItems.push(req.body.newItem);
    res.redirect("/");
})



app.listen(3000, function () {
    console.log("Server running on port 3000");
})