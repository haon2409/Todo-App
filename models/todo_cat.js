var mogoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mogoose);

var TodoCatSchema = mogoose.Schema({
    id: {type: Number, unique: true},
    title: String,
    items: [
        {               
            title: String,
            description: String,
            create_at: {type: Date, required: true, default: Date.now} 
        }
    ]
});

TodoCatSchema.plugin(autoIncrement.plugin, {
    model: 'todoCat',
    field: 'id',
    incrementBy: 1
});

module.exports = mogoose.model('todoCat', TodoCatSchema);
