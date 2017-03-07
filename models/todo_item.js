var mogoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mogoose);

var TodoItemSchema = mogoose.Schema({
    id: {type: Number, unique: true},
    title: String,
    description: String,
    create_at: {type: Date, required: true, default: Date.now},
    todoCat: {
        type: mogoose.Schema.ObjectId,
        ref: "todoCat"
    },
});

TodoItemSchema.plugin(autoIncrement.plugin, {
    model: 'todoItem',
    field: 'id',
    incrementBy: 1
});

module.exports = mogoose.model('todoItem', TodoItemSchema);
