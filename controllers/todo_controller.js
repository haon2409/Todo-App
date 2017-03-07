var mogoose = require('mongoose');
var TodoCatModel = require('../models/todo_cat');
var TodoItemModel = require('../models/todo_item');

class TodoController {
    constructor() {
    }
    index(req, res) {
        res.render('index', {title: 'TODO-APP'})
    }
    showAll(req, res) {
        let result = {};
        TodoCatModel.find({}, function (err, todoCat) {
            if (err) {
                result.err = '001';
                result.data = null;
                res.status(500).send(result);
            } else {
                result.err = null;
                result.data = todoCat;
                res.send(result);
            }
        });
    }

    addCategory(req, res) {
        let result = {};
        let catTitle = req.body.title;
        if (catTitle === '') {
            result.err = '001';
            result.data = 'Invalid data input';
            res.status(500).send(result);
        }
        let newTodoCat = new TodoCatModel();
        newTodoCat.title = catTitle;

        newTodoCat.save(function (err, savedObject) {
            if (err) {
                result.err = '002';
                result.data = err;
                res.status(500).send(result);
            } else {
                result.err = null;
                result.data = savedObject;
                res.status(200).send(result);
            }
        });
    }

    addItem(req, res) {
        let result = {};
        let catId = req.body.catId;
        let itemTitle = req.body.title;
        let itemDescription = req.body.description;
        if (catId === '' || itemTitle === '' || itemDescription === '') {
            result.err = "001";
            result.data = 'Invalid data input';
            res.status(500).send(result);
        }
        TodoCatModel.findOneAndUpdate(
                {id: catId},
                {
                    $push: {"items": {title: itemTitle, description: itemDescription}}
                },
                {new : true},
                function (err, todoCat) {
                    if (err) {
                        result.err = '002';
                        result.data = 'Database Connection error';
                        res.status(500).send(result);
                    } else {
                        if (!todoCat) {
                            result.err = null;
                            result.data = todoCat;
                            return res.status(404).send(result);
                        } else {
                            result.err = null;
                            result.data = todoCat;
                            return res.status(200).send(result);
                        }
                    }
                }
        );
    }
}

module.exports = TodoController;