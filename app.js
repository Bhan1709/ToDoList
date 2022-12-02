const express = require("express");
const app = express();

const https = require("https");

app.use(express.urlencoded());

app.use(express.static("public"));

app.set("view engine", "ejs");

let vItems = [];
let vWorkItems = [];

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    let vDay = today.toLocaleDateString("en-US", options);

    res.render("index", { listTitle: vDay, items: vItems });
})

app.post("/", function (req, res) {
    console.log(req.body);
    if (req.body.listButton === "Work") {
        vWorkItems.push(req.body.newItem);
        res.redirect("/work");
    } else {
        vItems.push(req.body.newItem);
        res.redirect("/");
    }
})

app.get("/work", function (req, res) {
    res.render("index", { listTitle: "Work List", items: vWorkItems })
})

app.listen(3000, function () {
    console.log("Server running on port 3000");
})