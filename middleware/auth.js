const jwt = require('jsonwebtoken');
const config = require('config');
const Users = require("@models/User");

module.exports = async function (req, res, next) {
	const token = req.header('x-auth-token');

	if (!token) {
		return res.status(402).json({ msg: 'No Token, Authorization Denied' });
	}
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded.user;

		req.isAdminUser =false;
		let checkUser = await Users.findById({_id: req.user}, {isAdminUser});
		if(checkUser) {
			if(checkUser.isAdminUser)
				req.isAdminUser = checkUser.isAdminUser
		}

		
		next();
	} catch (err) {
		return res.status(401).json({ msg: 'Token is not Valid' });
	}
};
