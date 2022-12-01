require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/Users");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// create a users using post endpoint "api/auth"
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
        return res
          .status(400)
          .json({
            error:
              "Enter a user which does not exits. This email already exits.",
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
        user:{
          id : user.id
        }
      }
      const authToken = jwt.sign(data, process.env.JWTSECRET);
      res.json({authToken});

    } catch (err) {
      console.log(err.message);
      res.status(500)
    }
  }
);

module.exports = router;
