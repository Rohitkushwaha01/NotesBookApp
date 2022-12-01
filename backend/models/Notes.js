const mongoose = require('mongoose');

const notesSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    tag:{
        type: String,
    },
    date:{
        type: Date,
        require: true
    }
});

module.exports = mongoose.model('note', notesSchema);