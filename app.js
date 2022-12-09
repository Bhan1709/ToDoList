const express = require("express");
const date = require(__dirname + "/date.js");
const https = require("https");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

const vDay = date.getFormattedDate();

mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB");

const itemSchema = { name: String };
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your To Do List!"
});

const item2 = new Item({
    name: "Hit the + button to add a new task"
});

const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    tasks: [itemSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("Successfully saved defaultItems to DB.");
            });
            res.redirect("/");
        } else {
            res.render("index", { listTitle: "Today", hDate: vDay, items: foundItems });
        }
    });
});

app.get("/:listName", function (req, res) {
    const customListName = _.capitalize(req.params.listName);
    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {//create a new list
                const list = new List({
                    name: customListName,
                    tasks: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {//show old list
                res.render("index", { listTitle: customListName, hDate: vDay, items: foundList.tasks });
            }
        } else
            console.log(err);
    });

});

app.post("/", function (req, res) {
    const item = new Item({
        name: req.body.newItem
    });

    if (req.body.listButton === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: req.body.listButton }, function (err, foundList) {
            if (!err) {
                foundList.tasks.push(item);
                foundList.save();
                res.redirect("/" + req.body.listButton);
            } else {
                console.log(err);
            }
        });
    }
});

app.post("/delete", function (req, res) {
    if (req.body.checkedList === "Today") {
        Item.findByIdAndRemove(req.body.checkedItem, function (err) {
            if (err)
                console.log(err);
            else
                console.log("Successfully deleted Item from DB.");
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate(
            { name: req.body.checkedList },
            { $pull: { tasks: { _id: req.body.checkedItem } } },
            function (err, foundList) {
                if (!err) {
                    res.redirect("/" + req.body.checkedList);
                } else {
                    console.log(err);
                }
            });
    }
});

app.listen(3000, function () {
    console.log("Server running on port 3000");
});