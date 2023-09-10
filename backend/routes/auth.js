const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs'); // Encrypting password
const jwt = require('jsonwebtoken'); // for token
const User = require("../models/Users");
const Admin = require("../models/Admin");

const JWT_SIGN = process.env.JWT_SIGN;

const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const fetchAdmin = require("../middleware/fetchAdmin");

// This file defines the routes for the user and admin management API.

//ROUTE 1 :- Create a user using POST "api/auth/createUser" .Doesn't require auth. No login required
router.post(
	"/createUser",
	[
		// Validate the input data.
		body("first_name", "Enter a valid First Name").isLength({ min: 3 }),
		body("last_name", "Enter a valid Last Name").isLength({ min: 3 }),
		body("email", "Enter a valid Name").isEmail({ min: 3 }),
		body("gender", "Enter a valid Gender").isLength({ min: 3 }),
		body("mobile_number", "Enter a valid Mobile Number").isLength({ min: 9 }),
		body("password", "Enter a valid Password").isLength({ min: 5 }),
	],

	async (req, res) => {
		// Validate the input data.
		// if there are errors, return bad request and error
		const errors = validationResult(req);
		let success = false;
		if (!errors.isEmpty()) {
			// Return an error if the input data is invalid.
			return res.status(400).json({ success, errors: errors.array() });
		}

		//check whether user with this email or mobile number exists already
		try {
			let user = await User.findOne({ $or: [{ email: req.body.email }, { mobile_number: req.body.mobile_number }] });
			//Email Check and Mobile number check
			if (user) {
				// Send the response.
				return res.status(404).json({ success, error: "Email or Mobile number already exists" });
			}

			//Genrate salt
			const salt = await bcrypt.genSaltSync(10);
			const encryptPass = await bcrypt.hash(req.body.password, salt)
			//create user if no error 
			// Create a new User record.
			user = await User.create({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				gender: req.body.gender,
				mobile_number: req.body.mobile_number,
				password: encryptPass,
			});

			// Getting id
			const data = {
				user: {
					id: user.id
				}
			}
			// token generation
			const authToken = jwt.sign(data, JWT_SIGN);
			// Send the response.
			res.status(201).json({ success: true, message: "Account Successfully Created", authToken })
		}

		//catch error
		catch (error) {
			// Handle the error.
			console.log(error.message)
			res.status(500).send("Internal Server Error occurred")
		}
	}
);

//ROUTE 2 :-login  a user using POST "api/auth/login" .Doesn't require auth. No login required
router.post(
	"/loginUser",
	// Validate the input data.
	[
		body("identifier", "Enter a valid Email Id or Phone number").exists(),
		body("password").exists(),
	],

	async (req, res) => {
		// Validate the input data.
		// if there are errors, return bad request and error
		const errors = validationResult(req);
		let success = false;
		if (!errors.isEmpty()) {
			// Return an error if the input data is invalid.
			return res.status(400).json({ errors: errors.array() });
		}

		//check whether user with this email exists already
		// Get the input data.
		const { identifier, password } = req.body;
		try {
			let user = await User.findOne({ $or: [{ email: identifier }, { mobile_number: identifier }] });
			//Checking if user exists or not
			if (!user) {
				// Send the response.
				return res.status(404).json({ success, error: "Incorrect credentials" });
			}

			//Checking for password
			const passCompare = await bcrypt.compare(password, user.password);
			if (!passCompare) {
				// Send the response.
				return res.status(404).json({ success, error: "Incorrect credentials" });
			}

			// Getting id
			const data = {
				user: {
					id: user.id
				}
			}

			// token generation
			const authToken = jwt.sign(data, JWT_SIGN);
			// Send the response.
			res.json({ success: true, message: "Login Successfully!", authToken })
		}

		// catch error
		catch (error) {
			// Handle the error.
			console.log(error.message)
			res.status(500).send("Error occured")
		}
	}
);
//ROUTE 3 :-Getting user data using GET "api/auth/getUser". Login required
router.get("/getUser", fetchUser, async (req, res) => {
	try {

		let user_id = req.user.id;
		const user = await User.findById(user_id).select("-password");
		res.send(user)
	}
	catch (error) {
		console.log(error.message)
		res.status(500).send("Internal Server Error occurred");

	}
})

//ROUTE 4 :-Update User using POST "api/auth/updateUser". User Login required.

router.put("/updateUser/:user_id", fetchUser,
	[
		// Validate the input data.
		body("first_name", "Enter a valid First Name").isLength({ min: 3 }),
		body("last_name", "Enter a valid Last Name").isLength({ min: 3 }),
		body("email", "Enter a valid Name").isEmail({ min: 3 }),
		body("gender", "Enter a valid Gender").isLength({ min: 3 }),
		body("mobile_number", "Enter a valid Mobile Number").isLength({ min: 9 }),
		body("password", "Enter a valid Password").isLength({ min: 5 }),
		body("new_password", "Enter a valid Password").isLength({ min: 5 })
	],
	async (req, res) => {
		try {
			// Get the input data.
			const { first_name, last_name, email, gender, mobile_number, password, new_password } = req.body;

			//Get user id for url
			const user_id = req.params.user_id;
			console.log(user_id)

			// Get user id for fetchuser
			const p_user_id = req.user.id;
			console.log(p_user_id)

			//Check for authenticate user
			if (user_id !== p_user_id) {
				return res.status(404).json({ message: "Not allowed" });
			}

			//checking if record of user exists in db or not
			const userData = await User.findById(user_id);

			//check condition
			if (!userData) {
				return res.status(404).json({ message: "User not found" });
			}

			// Check if the user is updating the email or mobile_number.
			if (email || mobile_number) {
				if (email !== userData.email || mobile_number !== userData.mobile_number) {
					// Generate a verification code and send it to the user for email/mobile verification.
					//const verificationCode = generateVerificationCode(); 
					// Send the verification code to the user via email or SMS.
					//sendVerificationCode(userData.email, userData.mobile_number, verificationCode); 
					console.log(email || mobile_number)
				}
			}

			// Check if the user is updating the password.
			if (password) {
				// Verify the current password.
				const isPasswordValid = await bcrypt.compare(password, userData.password); // Use bcrypt for password hashing.
				if (!isPasswordValid) {
					return res.status(401).send({ message: "Incorrect current password" });
				}
				// Update the password.
				userData.password = await bcrypt.hash(new_password, 10); // Hash and salt the new password.
			}



			//Updating the record
			userData.first_name = first_name;
			userData.last_name = last_name;
			// userData.email = email;
			userData.gender = gender;
			// userData.mobile_number = mobile_number;
			//userData.password = password;

			//saving data
			const updateUserData = await userData.save();

			//send the response.
			res.send(updateUserData);

		} catch (error) {
			// Handle the error.
			console.log(error.message);
			res.status(500).send("Internal Server Error occurred");

		}
	}
)

//ROUTE 4 :-login  a admin using POST "api/auth/loginAdmin" .Doesn't require auth. No login required

router.post(
	"/loginAdmin",
	// Validate the input data.
	[
		body("identifier", "Enter a valid Email Id or Phone number").exists(),
		body("password").exists(),
	],

	async (req, res) => {
		// Validate the input data.
		// if there are errors, return bad request and error
		const errors = validationResult(req);
		let success = false;
		if (!errors.isEmpty()) {
			// Return an error if the input data is invalid.
			return res.status(400).json({ errors: errors.array() });
		}

		//check whether admin with this email exists already
		// Get the input data.
		const { identifier, password } = req.body;
		try {
			let admin = await Admin.findOne({ $or: [{ email: identifier }, { mobile_number: identifier }] });
			//Checking if admin exists or not
			if (!admin) {
				return res.status(404).json({ success, error: "Incorrect credentials" });
			}

			//Checking for password
			const passCompare = await bcrypt.compare(password, admin.password);
			if (!passCompare) {
				return res.status(404).json({ success, error: "Incorrect credentials" });
			}

			//Getting id 
			const data = {
				admin: {
					id: admin.id
				}
			}

			// token generation
			const authToken = jwt.sign(data, JWT_SIGN);
			res.json({ success: true, message: "Login Successfully!", authToken })
		}

		//catch error
		catch (error) {
			console.log(error.message)
			res.status(500).send("Internal Server Error occurred");
		}
	}
);

//ROUTE 5 :-Create  a admin using POST "api/auth/createAdmin" .Doesn't require auth. No login required
router.post(
	"/createAdmin",
	// Validate the input data.
	[
		body("name", "Enter a valid First Name").isLength({ min: 3 }),
		body("email", "Enter a valid Name").isEmail({ min: 3 }),
		body("mobile_number", "Enter a valid Mobile Number").isLength({ min: 9 }),
		body("password", "Enter a valid Password").isLength({ min: 5 }),
	],

	async (req, res) => {
		// Validate the input data.
		// if there are errors, return bad request and error
		const errors = validationResult(req);
		let success = false;
		if (!errors.isEmpty()) {
			// Return an error if the input data is invalid.
			return res.status(400).json({ success, errors: errors.array() });
		}

		//check whether admin with this email or mobile number exists already
		try {
			let admin = await Admin.findOne({ $or: [{ email: req.body.email }, { mobile_number: req.body.mobile_number }] });
			//Email Check and Mobile number check
			if (admin) {
				return res.status(404).json({ success, error: "Email Id or Mobile number already exists" });
			}

			//Genrate salt
			const salt = await bcrypt.genSaltSync(10);
			const encryptPass = await bcrypt.hash(req.body.password, salt)
			//create admin if no error 
			// Create a new Admin record.
			admin = await Admin.create({
				name: req.body.name,
				email: req.body.email,
				mobile_number: req.body.mobile_number,
				password: encryptPass,
			});

			// Getting id 
			const data = {
				admin: {
					id: admin.id
				}
			}
			// token generation
			const authToken = jwt.sign(data, JWT_SIGN);
			// Send the response.
			res.status(201).json({ success: true, message: "Account Successfully Created", authToken })
		}

		catch (error) {
			// Handle the error.
			console.log(error.message)
			res.status(500).send("Internal Server Error occurred")
		}
	}
);

//ROUTE 6 :-Getting admin data using GET "api/auth/getAdmin". Admin required
router.get("/getAdmin", fetchAdmin, async (req, res) => {
	try {
		admin_id = req.admin.id;
		const admin = await Admin.findById(admin_id).select("-password");
		// Send the response.
		res.send(admin)
	}
	catch (error) {
		// Handle the error.
		console.log(error.message)
		res.status(500).send("Internal Server Error occurred");
	}
});

//ROUTE 7:- Delete user data using DELETE "api/auth/deleteUser" . Admin login required.
router.delete('/deleteUser/:user_id', fetchAdmin, async (req, res) => {
	try {
		//Getting user_id ;
		const user_id = req.params.user_id;

		//Finding the data of user 
		const deleteUser = await User.findById(user_id);

		//If user not found
		if (!deleteUser) {
			return res.status(404).json({ message: "User Not Found" });
		}

		//Deleting user
		deleteUser = await User.findByIdAndDelete(user_id);

		//send the response
		res.status(200).send({ "sucess": "successfully delete the user", User: deleteUser })

	} catch (error) {
		// Handle the error.
		console.log(error.message)
		res.status(500).send("Internal Server Error occurred");
	}
})

module.exports = router;
