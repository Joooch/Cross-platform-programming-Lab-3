//const ejs = require()
const bodyParser = require('body-parser');
const session = require('cookie-session');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const history = require('connect-history-api-fallback')

const User = require("./models/User");
const Question = require("./models/Question");
const Answer = require("./models/Answer");

const sha1 = require('sha1');
const salt = "mHMCZANnxg"


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/imgs', express.static(__dirname + '/imgs'));
app.use(cors());
app.use(session({
	name: 'session',
	keys: ['j1LMGzEQy1wYlGZ90HQr', '5P2F3xR0BFgwE5fRg5EQ'],
	cookie: {
		//httpOnly: true,
		secure: true,
		expires: 172800 // 3600 * 24 * 2
	}
}));

async function getUser(info) {
	return await User.findOne(info);
}

app.get("/question/list", (req, res) => {
	Question.find({}).sort({ date: -1 }).populate("user", "-password -_id -__v").select("-__v -content").then(questions => {
		if (!questions) {
			return Promise.reject("Unknown error")
		}
		res.status(200).json(questions);

	}).catch((err) => {
		res.status(400).send({
			error: err
		});
	})
});

app.get("/user", async (req, res) => {
	
	let user;
	if (req.session.userid) {
		user = await getUser({
			_id: req.session.userid,
			password: req.session.password,
		})
	}
	if (user && user.name) {
		res.status(200).send({
			name: user.name,
			icon: "user.jpg"
		})
	} else {
		res.status(400).send()
	}
})
app.post("/user/register", (req, res) => {
	const newUser = new User({
		name: req.body.name,
		password: sha1(salt + req.body.password + salt),
	})
	
	newUser.save((err, user) => {
		if (err) {
			return res.status(400).send({
				error: "This username already exists."
			})
		}
		req.session.userid = user._id;
		res.status(200).send();
	})
})

app.post("/user/login", async (req, res) => {
	const user = await getUser({
		name: req.body.name,
		password: sha1(salt + req.body.password + salt),
	})

	if (!user || !user.name) {
		return res.status(400).send({
			error: "Invalid username or password"
		});
	}

	req.session.userid = user._id;
	req.session.password = user.password;

	res.status(200).send();
})
app.post("/user/logout", (req, res) => {
	req.session.userid = undefined;
	res.status(200).send();
});


app.post("/question/makeAnswer", async (req, res) => {
	let user;
	if (req.session.userid) {
		user = await getUser({
			_id: req.session.userid
		})
	}

	if (!user) {
		res.status(401).send();
		return;
	}

	const newAnswer = new Answer({
		question: req.body.id,
		user: user._id,
		content: req.body.content,
	});
	newAnswer.save((err) => {
		if (err) {
			return res.status(400).send({
				error: "Something went wrong! Try later."
			});
		}

		Answer.find({
			question: req.body.id
		}).select("-question")
			.populate("user", "-password -_id -__v")
			.then(answers => {
				res.status(200).json(answers)
			})
			.catch(err => {
				res.status(400).send({
					error: err
				});
			})
	})
})

app.post("/question/create", async (req, res) => {
	let user;
	if (req.session.userid) {
		user = await getUser({
			_id: req.session.userid
		})
	}

	if (!user) {
		res.status(401).send();
		return;
	}

	const newQuestion = new Question({
		user: user._id,
		title: req.body.title,
		content: req.body.content,
		date: new Date(),
		views: 0,
	});
	newQuestion.save((err, question) => {
		if (err) {
			return res.status(400).send({
				error: "Something went wrong! Try later."
			});
		}

		res.status(200).send({
			id: question._id
		});
	})
})

app.get("/question/get/:id", (req, res) => {
	Question.findOne({
		_id: req.params.id
	}).populate("user", "-password -_id -__v")
		.then(question => {
			if (!question) {
				return Promise.reject("Invalid question")
			}

			Question.findOneAndUpdate({ _id: question._id }, { $inc: { views: 1 } }, { new: true }).exec();

			Answer.find({
				question: question._id
			}).select("-question")
				.populate("user", "-password -_id -__v")
				.then(answers => {
					res.status(200).json({
						answers,
						title: question.title,
						content: question.content,
						user: question.user,
					})
				})
				.catch(err => {
					res.status(400).send({
						error: err
					});
				})

		}).catch((err) => {
			res.status(400).send({
				error: err
			});
		})
})


app.use(express.static(__dirname + '/dist'));
app.use(history());
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/dist/index.html")
});


mongoose.connect('mongodb://localhost:27017/overflow', {
	useUnifiedTopology: true,
	useNewUrlParser: true
}).then(() => {
	app.listen(5000)
})