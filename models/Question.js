const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    content: JSON,
    date: Date,
    views: Number
});
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;