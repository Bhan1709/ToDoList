const express = require("express");
const app = express();

const https = require("https");

const date = require(__dirname + "/date.js");

app.use(express.urlencoded());

app.use(express.static("public"));

app.set("view engine", "ejs");

const vItems = ["Build a To Do List"];
const vWorkItems = ["Build a To Do List for Work"];

app.get("/", function (req, res) {
    const vDay = date.getFormattedDate();
    res.render("index", { listTitle: vDay, items: vItems });
})

app.post("/", function (req, res) {
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