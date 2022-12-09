require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const fetchuser = require("../middleware/fetchuser");
// ROUTE 1: create a users using post endpoint "api/auth"
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // will wait for the query
      let user = await User.findOne({ email: req.body.email });

      // If user found then throw an error.
      if (user) {
        return res.status(400).json({
          error: "Enter a user which does not exits. This email already exits.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);
      // If user didn't exists create one.
      // will wait till user has been created.
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWTSECRET);
      res.json({ authToken });
    } catch (err) {
      console.log(err.message);
      res.status(500);
    }
  }
);

// ROUTE 2: Login user with right credentials.
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      console.log(user);

      if (!user) {
        return res.status(400).json({ errors: "User does exists" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res
          .status(400)
          .json({ errors: "Please try to login with correct Password" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, process.env.JWTSECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get loggedIn user Details using Post "/api/auth/getuser". login required.

router.post("/fetchuser", fetchuser ,async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
