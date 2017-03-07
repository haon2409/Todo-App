var express = require('express');
var router = express.Router();

var todoController = require('../controllers/todo_controller');
var todoControllerSingleton = new todoController();

router.get('/', todoControllerSingleton.index);
router.get('/api/get-all', todoControllerSingleton.showAll);
router.post('/api/cat/add', todoControllerSingleton.addCategory);
router.post('/api/item/add', todoControllerSingleton.addItem);

module.exports = router;
