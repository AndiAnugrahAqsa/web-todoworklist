const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://admin-aqsa:RMR.id06@cluster0.tfdhy.mongodb.net/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "Welcome to your todolist!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    item: [itemsSchema]
};

const List = mongoose.model("List", listSchema);






app.get("/", function(req, res) {

    Item.find(function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Success!!!")
                }
            });
            res.redirect("/");
        } else {
            res.render('list', { day: "Today", item: foundItems });
        }
    });



});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list

    const item = new Item({
        name: itemName
    })
    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function(err, foundList) {
            foundList.item.push(item)
            foundList.save();
            res.redirect("/" + listName)
        })

    }


});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err) {
                console.log("Successfully delete item");
            } else {
                console.log(err)
            }
        });


        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { item: { _id: checkedItemId } } }, function(err, foundList) {
            res.redirect("/" + listName);
        })
    }


})

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);


    List.findOne({ name: customListName }, function(err, foundList) {
        if (!err) {
            if (!foundList) {
                // Creat a new list
                const list = new List({
                    name: customListName,
                    item: defaultItems
                })
                list.save();

                res.redirect("/" + customListName)
            } else {
                res.render('list', { day: foundList.name, item: foundList.item })
            }
        }
    })

})

app.get("/about", function(req, res) {
    res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}


app.listen(port, function() {
    console.log("Running server successfully");
});