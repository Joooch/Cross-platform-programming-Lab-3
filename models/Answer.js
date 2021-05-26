const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
});
const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;