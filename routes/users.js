const express = require('express');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const User = require('@models/Users/User');

// And Admin Can See all the added users

// @route  GET    api/users
// @desc   Get All User for Admin Type
// @access   Public
router.get('/', async (req, res) => {
	try {
		const users = await User.find().sort({ date: -1 }).select('-password');
		res.json(users);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route  POST    api/users
// @desc   User Register
// @access   Public
router.post(
	'/',
	[
		check('name', 'Please Add You Name').not().isEmpty(),
		check('email', 'Please Add a Valid Email Id').isEmail(),
		check('password', 'Enter A Password with 6 or more Characters').isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ message: 'User Already Exists!' });
			}

			user = new User({
				name,
				email,
				password,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			res.json({ _id: user.id, name, email, date: user.date });

			// const payload = {
			// 	user: {
			// 		id: user.id,
			// 	},
			// };

			// jwt.sign(
			// 	payload,
			// 	config.get('jwtSecret'),
			// 	{
			// 		expiresIn: 3600,
			// 	},
			// 	(err, token) => {
			// 		if (err) throw err;
			// 		res.json({ token });
			// 	}
			// );
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route  GET    api/users
// @desc   Get All Students
// @access   Public
router.get('/', async (req, res) => {
	try {
		const users = await User.find().sort({ date: -1 }).select('-password');
		res.json(users);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
